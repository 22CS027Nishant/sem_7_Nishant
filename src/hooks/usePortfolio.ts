import { useState, useEffect } from 'react';
import axios from 'axios';

interface PortfolioHolding {
  asset: string;
  quantity: number;
  value: number;
  change24h?: number;
}

interface PortfolioResponse {
  holdings: PortfolioHolding[];
}

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState<PortfolioHolding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get<PortfolioResponse>(
          'http://localhost:5000/api/portfolio',
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setPortfolio(response.data.holdings);
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  const updatePortfolio = (newHoldings: PortfolioHolding[]) => {
    setPortfolio(newHoldings);
  };

  return { portfolio, loading, error, updatePortfolio };
};