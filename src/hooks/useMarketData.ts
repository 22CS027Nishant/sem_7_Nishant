import { useState, useEffect } from 'react';
import axios from 'axios';

interface MarketDataPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface MarketDataResponse {
  data: MarketDataPoint[];
}

const useMarketData = () => {
  const [marketData, setMarketData] = useState<MarketDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await axios.get<MarketDataResponse>(
          'http://localhost:5000/api/market-data'
        );
        setMarketData(response.data.data);
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return { marketData, loading, error };
};

export default useMarketData;