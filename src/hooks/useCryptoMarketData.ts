import { useState, useEffect } from 'react';
import { coinGeckoService, CoinOHLCData } from '../services/coingeckoService';

interface UseMarketDataOptions {
  coinId: string;
  interval?: '1h' | '1d' | '7d' | '30d';
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface MarketDataHook {
  data: CoinOHLCData[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const intervalToDays: Record<string, number> = {
  '1h': 1,
  '1d': 1,
  '7d': 7,
  '30d': 30,
};

export const useMarketData = ({
  coinId,
  interval = '1d',
  autoRefresh = true,
  refreshInterval = 60000, // 1 minute
}: UseMarketDataOptions): MarketDataHook => {
  const [data, setData] = useState<CoinOHLCData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const days = intervalToDays[interval];
  const ohlcData = await coinGeckoService.getCoinOHLC(coinId, 'usd', days);
      setData(ohlcData);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    if (autoRefresh) {
      const intervalId = setInterval(fetchData, refreshInterval);
      return () => clearInterval(intervalId);
    }
  }, [coinId, interval]);

  return { data, loading, error, refetch: fetchData };
};