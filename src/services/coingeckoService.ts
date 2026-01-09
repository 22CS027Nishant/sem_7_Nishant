import axios, { AxiosRequestConfig } from 'axios';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

export interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  high_24h: number;
  low_24h: number;
  total_volume: number;
  image: string;
}

export interface CoinOHLCData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface DetailedCoinData {
  id: string;
  symbol: string;
  name: string;
  description: { en: string };
  market_data: {
    current_price: { [key: string]: number };
    ath: { [key: string]: number };
    ath_change_percentage: { [key: string]: number };
    ath_date: { [key: string]: string };
    market_cap: { [key: string]: number };
    total_volume: { [key: string]: number };
    high_24h: { [key: string]: number };
    low_24h: { [key: string]: number };
    price_change_24h: number;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
  };
}

class CoinGeckoService {
  // Simple in-memory cache to reduce request rate and dedupe concurrent calls
  private cache = new Map<string, { expires: number; data: any; promise?: Promise<any> }>();

  // Default TTLs (ms)
  private MARKET_TTL = 30 * 1000; // 30s for market list
  private OHLC_TTL = 25 * 1000; // 25s for OHLC (slightly less than polling interval)

  // Retry settings
  private MAX_RETRIES = 3;
  private INITIAL_BACKOFF = 500; // ms

  private async sleep(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }

  private makeCacheKey(url: string, params?: Record<string, any>) {
    if (!params) return url;
    const keys = Object.keys(params).sort();
    const parts = keys.map((k) => `${k}=${JSON.stringify(params[k])}`);
    return `${url}?${parts.join('&')}`;
  }

  private async requestWithRetry<T = any>(url: string, config: AxiosRequestConfig = {}, cacheKey?: string, ttl?: number): Promise<T> {
    // Caching: return cached value if valid
    if (cacheKey && ttl) {
      const cached = this.cache.get(cacheKey);
      const now = Date.now();
      if (cached) {
        if (cached.data && cached.expires > now) {
          return cached.data as T;
        }
        if (cached.promise) {
          // A request for this key is already in progress — wait for it
          return cached.promise as Promise<T>;
        }
      }
    }

    // Create a promise and store it to dedupe concurrent calls
    const perform = async (): Promise<T> => {
      let attempt = 0;
      let lastErr: any = null;
      while (attempt < this.MAX_RETRIES) {
        try {
          const res = await axios.get(url, config);
          // successful
          if (cacheKey && ttl) {
            this.cache.set(cacheKey, { data: res.data, expires: Date.now() + (ttl || 0) });
          }
          return res.data as T;
        } catch (err: any) {
          lastErr = err;
          // If rate limited (429), throw immediately with helpful message
          const status = err?.response?.status;
          if (status === 429) {
            throw new Error('Rate limit exceeded (429) from CoinGecko. Back off and retry later.');
          }

          // For client errors (4xx other than 429), don't retry
          if (status && status >= 400 && status < 500) {
            throw new Error(`CoinGecko API error: ${status} ${err?.response?.statusText ?? ''}`);
          }

          // Otherwise retry with exponential backoff
          attempt += 1;
          const backoff = this.INITIAL_BACKOFF * Math.pow(2, attempt - 1);
          await this.sleep(backoff);
        }
      }
      // Exhausted retries
      throw lastErr ?? new Error('Unknown network error');
    };

    const promise = perform();
    if (cacheKey && ttl) {
      this.cache.set(cacheKey, { expires: Date.now() + (ttl || 0), data: undefined, promise });
    }
    try {
      const result = await promise;
      // ensure cache entry has data & expires
      if (cacheKey && ttl) this.cache.set(cacheKey, { expires: Date.now() + (ttl || 0), data: result });
      return result;
    } catch (err) {
      // on failure, remove the pending cache entry so future calls can retry
      if (cacheKey) this.cache.delete(cacheKey);
      throw err;
    }
  }

  // Get list of supported coins with basic info
  async getSupportedCoins(): Promise<{ id: string; symbol: string; name: string }[]> {
    try {
      const url = `${COINGECKO_API_URL}/coins/list`;
      const cacheKey = this.makeCacheKey(url);
      const data = await this.requestWithRetry<{ id: string; symbol: string; name: string }[]>(url, {}, cacheKey, this.MARKET_TTL);
      return data;
    } catch (error) {
      console.error('Error fetching supported coins:', error);
      throw error;
    }
  }

  // Get current market data for specified coins
  async getMarketData(): Promise<CoinMarketData[]> {
    try {
      const url = `${COINGECKO_API_URL}/coins/markets`;
      const params = { vs_currency: 'usd', order: 'market_cap_desc', per_page: 100, page: 1, sparkline: false };
      const cacheKey = this.makeCacheKey(url, params);
      const data = await this.requestWithRetry<CoinMarketData[]>(url, { params, timeout: 10000 }, cacheKey, this.MARKET_TTL);
      return data;
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw error;
    }
  }

  async getCoinMarketData(
    coinId: string,
    vsCurrency: string = 'usd',
    days: string = '1',
    interval: string = 'hourly'
  ): Promise<CoinMarketData> {
    try {
      const url = `${COINGECKO_API_URL}/coins/${coinId}/market_chart`;
      const params = { vs_currency: vsCurrency, days, interval };
      const cacheKey = this.makeCacheKey(url, params);
      const data = await this.requestWithRetry<any>(url, { params, timeout: 15000 }, cacheKey, this.OHLC_TTL);
      return data;
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw error;
    }
  }

  async getCoinList(): Promise<Array<{ id: string; symbol: string; name: string }>> {
    try {
      const url = `${COINGECKO_API_URL}/coins/list`;
      const cacheKey = this.makeCacheKey(url);
      const data = await this.requestWithRetry<{ id: string; symbol: string; name: string }[]>(url, {}, cacheKey, this.MARKET_TTL);
      return data;
    } catch (error) {
      console.error('Error fetching coin list:', error);
      throw error;
    }
  }

  async getCoinPrice(
    coinId: string,
    vsCurrency: string = 'usd'
  ): Promise<number> {
    try {
      const url = `${COINGECKO_API_URL}/simple/price`;
      const params = { ids: coinId, vs_currencies: vsCurrency };
      const cacheKey = this.makeCacheKey(url, params);
      const data = await this.requestWithRetry<any>(url, { params, timeout: 8000 }, cacheKey, 5000);
      return data?.[coinId]?.[vsCurrency];
    } catch (error) {
      console.error('Error fetching coin price:', error);
      throw error;
    }
  }

  async getCoinOHLC(
    coinId: string,
    vsCurrency: string = 'usd',
    days: number = 1
  ): Promise<CoinOHLCData[]> {
    try {
      const url = `${COINGECKO_API_URL}/coins/${coinId}/ohlc`;
      const params = { vs_currency: vsCurrency, days };
      const cacheKey = this.makeCacheKey(url, params);

      const responseData = await this.requestWithRetry<any[]>(url, { params, timeout: 10000 }, cacheKey, this.OHLC_TTL);

      // OHLC endpoint returns an array of [time, open, high, low, close]
      if (Array.isArray(responseData) && responseData.length > 0) {
        return responseData.map((item: [number, number, number, number, number]) => ({
          time: item[0],
          open: item[1],
          high: item[2],
          low: item[3],
          close: item[4]
        }));
      }

      // If OHLC returned empty, fallback to market_chart and synthesize OHLC
      console.warn(`OHLC endpoint returned empty for ${coinId} (days=${days}), falling back to market_chart`);

      const mcUrl = `${COINGECKO_API_URL}/coins/${coinId}/market_chart`;
      const mcParams = { vs_currency: vsCurrency, days };
      const mcCacheKey = this.makeCacheKey(mcUrl, mcParams);
      const mc = await this.requestWithRetry<any>(mcUrl, { params: mcParams, timeout: 10000 }, mcCacheKey, this.OHLC_TTL);

      // market_chart returns prices: [ [timestamp, price], ... ]
      const prices: [number, number][] = mc?.prices ?? [];
      if (!Array.isArray(prices) || prices.length === 0) {
        throw new Error('No price data available from market_chart fallback');
      }

      // Aggregate prices into OHLC candles. We'll create one candle per intervalMs.
      const intervalMs = days <= 1 ? 15 * 60 * 1000 : 60 * 60 * 1000; // 15min for intraday, else hourly

      const buckets: Record<number, { open: number; high: number; low: number; close: number; time: number } > = {};
      for (const [ts, price] of prices) {
        const time = Math.floor(ts / intervalMs) * intervalMs;
        if (!buckets[time]) {
          buckets[time] = { open: price, high: price, low: price, close: price, time };
        } else {
          const b = buckets[time];
          b.high = Math.max(b.high, price);
          b.low = Math.min(b.low, price);
          b.close = price;
        }
      }

      const result = Object.values(buckets)
        .sort((a, b) => a.time - b.time)
        .map(b => ({ time: b.time, open: b.open, high: b.high, low: b.low, close: b.close }));

      if (result.length === 0) throw new Error('Failed to synthesize OHLC from market_chart data');
      return result;
    } catch (error: any) {
      console.error('Error fetching OHLC data (and fallback):', error?.message ?? error);
      // Normalize axios/network errors into a clear Error
      if (error?.response) {
        throw new Error(`CoinGecko API error: ${error.response.status} ${error.response.statusText}`);
      }
      throw new Error(error?.message ?? 'Unknown network error when fetching OHLC');
    }
  }
}

// Export a singleton instance
export const coinGeckoService = new CoinGeckoService();