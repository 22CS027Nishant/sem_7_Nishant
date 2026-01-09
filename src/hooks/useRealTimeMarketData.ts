import { useState, useEffect } from 'react';
import { coinGeckoService, CoinMarketData, CoinOHLCData } from '../services/coingeckoService';

interface UseMarketDataReturn {
  marketData: CoinMarketData[];
  candlestickData: CoinOHLCData[];
  isLoading: boolean;
  error: Error | null;
  selectedCoin: string;
  setSelectedCoin: (coin: string) => void;
}

export const useRealTimeMarketData = (
  initialCoin: string = 'bitcoin',
  updateInterval: number = 30000 // 30 seconds
): UseMarketDataReturn => {
  const [marketData, setMarketData] = useState<CoinMarketData[]>([]);
  const [candlestickData, setCandlestickData] = useState<CoinOHLCData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedCoin, setSelectedCoin] = useState(initialCoin);

  const fetchMarketData = async () => {
    try {
  const data = await coinGeckoService.getMarketData();
      setMarketData(data);
    } catch (err: any) {
      setError(err);
    }
  };

  const fetchCandlestickData = async () => {
    try {
  const data = await coinGeckoService.getCoinOHLC(selectedCoin, 'usd', 1);
      setCandlestickData(data);
    } catch (err: any) {
      setError(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchMarketData(),
          fetchCandlestickData()
        ]);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up polling interval for real-time updates
    const intervalId = setInterval(fetchData, updateInterval);

    return () => clearInterval(intervalId);
  }, [selectedCoin]);

  return {
    marketData,
    candlestickData,
    isLoading,
    error,
    selectedCoin,
    setSelectedCoin
  };
};

export default useRealTimeMarketData;