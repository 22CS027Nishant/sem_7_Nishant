// src/components/PortfolioPage.tsx
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Line } from "react-chartjs-2";
import { coinGeckoService, CoinMarketData } from '../../services/coingeckoService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Portfolio: React.FC = () => {
  const [positions, setPositions] = useState<Array<any>>([]);
  const [cashBalance, setCashBalance] = useState<number>(0);
  const [invested, setInvested] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [chartSeries, setChartSeries] = useState<number[]>([]);

  // Helper to compute portfolio from trades in localStorage
  const computePortfolio = async () => {
    const initialBalance = (() => {
      const stored = localStorage.getItem('mockBalance');
      return stored ? Number(stored) : 1000000;
    })();

    const saved = localStorage.getItem('trades');
    const trades = saved ? JSON.parse(saved) as Array<any> : [];

    // Build a symbol map of aggregated buys/sells
    const agg: Record<string, { amount: number; buyCost: number; sellProceeds: number }> = {};
    for (const t of trades) {
      const sym = t.symbol.toUpperCase();
      if (!agg[sym]) agg[sym] = { amount: 0, buyCost: 0, sellProceeds: 0 };
      if (t.type === 'buy') {
        agg[sym].amount += t.amount;
        agg[sym].buyCost += t.total; // total = amount * price
      } else {
        agg[sym].amount -= t.amount;
        agg[sym].sellProceeds += t.total;
      }
    }

    const symbols = Object.keys(agg);

    // fetch market data for top coins and match by symbol
    let market: CoinMarketData[] = [];
    try {
      market = await coinGeckoService.getMarketData();
    } catch (err) {
      console.warn('Failed to fetch market data for portfolio:', err);
    }

    const marketBySymbol: Record<string, CoinMarketData> = {};
      for (const m of market) marketBySymbol[m.symbol.toUpperCase()] = m;

    const pos: Array<any> = [];
    let totalInvested = 0;

    for (const s of symbols) {
      const a = agg[s];
      if (a.amount <= 0) continue; // skip empty/short

      const md = marketBySymbol[s];
      const currentPrice = md ? md.current_price : 0;
      const changePct = md ? md.price_change_percentage_24h : 0;
      const totalVal = a.amount * currentPrice;

      // approximate avg price = (buyCost - sellProceeds) / amount
      const costBasis = a.buyCost - a.sellProceeds;
      const avgPrice = a.amount > 0 ? (costBasis / a.amount) : 0;

      pos.push({ symbol: s, amount: a.amount, avgPrice, currentPrice, totalValue: totalVal, changePct });
      totalInvested += totalVal;
    }

    // Calculate cash balance: initial + sells - buys
    const totalBuys = trades.filter(t => t.type === 'buy').reduce((acc, t) => acc + t.total, 0);
    const totalSells = trades.filter(t => t.type === 'sell').reduce((acc, t) => acc + t.total, 0);
    const cash = initialBalance + totalSells - totalBuys;

    setPositions(pos);
    setCashBalance(cash);
    setInvested(totalInvested);
    setTotalValue(cash + totalInvested);``

    // Build 7-day history for portfolio by summing per-symbol historical prices * amount
    try {
      const days = 7;
      // Determine mapping symbol -> coin id (from market data)
      const idBySymbol: Record<string, string> = {};
      for (const m of market) idBySymbol[m.symbol.toUpperCase()] = m.id;

      // Collect price time series per symbol
      const perSymbolSeries: Record<string, { [date: string]: number }> = {};
      const dateSet = new Set<string>();

      for (const s of Object.keys(agg)) {
        const a = agg[s];
        if (a.amount <= 0) continue;
        const coinId = idBySymbol[s];
        if (!coinId) continue;

        try {
          const mc: any = await coinGeckoService.getCoinMarketData(coinId, 'usd', String(days), 'daily');
          const prices: [number, number][] = mc?.prices ?? [];
          const dayMap: Record<string, number> = {};
          for (const [ts, price] of prices) {
            const d = new Date(ts).toISOString().slice(0, 10); // YYYY-MM-DD
            // overwrite to keep latest price in that day
            dayMap[d] = price;
            dateSet.add(d);
          }
          perSymbolSeries[s] = dayMap;
        } catch (err) {
          console.warn('Failed to fetch market_chart for', s, err);
        }
      }

      // Build sorted list of dates (last `days` days)
      const dates = Array.from(dateSet).sort();
      // If no dates (e.g., no data), fallback to single 'Now' point
      if (dates.length === 0) {
        setChartLabels(['Now']);
        setChartSeries([cash + totalInvested]);
      } else {
        // Ensure we only take last `days` entries
        const lastDates = dates.slice(-days);
        const seriesValues: number[] = [];
        for (const d of lastDates) {
          let totalForDay = 0;
          for (const s of Object.keys(perSymbolSeries)) {
            const amt = agg[s]?.amount ?? 0;
            const price = perSymbolSeries[s][d] ?? 0;
            totalForDay += amt * price;
          }
          // add cash (assume cash stays constant)
          seriesValues.push(Number((totalForDay + cash).toFixed(2)));
        }
        setChartLabels(lastDates);
        setChartSeries(seriesValues);
      }
    } catch (err) {
      console.warn('Failed to build portfolio history:', err);
      setChartLabels(['Now']);
      setChartSeries([cash + totalInvested]);
    }
  };

  useEffect(() => {
    computePortfolio();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'trades' || e.key === 'mockBalance') computePortfolio();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Mock chart data (you can replace this with dynamic backend data)
  const chartData = {
    labels: chartLabels.length > 0 ? chartLabels : ['Now'],
    datasets: [
      {
        label: 'Portfolio Value',
        data: chartSeries.length > 0 ? chartSeries : [totalValue || 0],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#1f2937'
        }
      },
      title: {
        display: true,
        text: "Portfolio Value Over Last 7 Days",
        font: { size: 16 },
        color: document.documentElement.classList.contains('dark') ? '#fff' : '#1f2937'
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#1f2937'
        }
      },
      x: {
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#1f2937'
        }
      }
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex">
      <Sidebar />
      <div className="flex-1 p-6">
        {/* Positions Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Positions</h2>
          {positions.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">No positions yet.</div>
          ) : (
            <div className="space-y-4">
              {positions.map((p) => (
                <div key={p.symbol} className="bg-white dark:bg-gray-800 rounded-lg p-6 flex justify-between items-center shadow-lg">
                  <div>
                    <p className="text-lg font-bold dark:text-white">
                      {p.symbol}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Amount: {p.amount.toLocaleString()}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Avg Price: ${p.avgPrice.toFixed(2)}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Current Price: ${p.currentPrice.toFixed(2)}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Total Value: ${p.totalValue.toFixed(2)}</p>
                  </div>
                  <div className={`text-right font-semibold ${p.changePct < 0 ? "text-red-500 dark:text-red-400" : "text-green-500 dark:text-green-400"}`}>
                    <p>{p.changePct < 0 ? '' : '+'}{(p.currentPrice - p.avgPrice).toFixed(2)}</p>
                    <p>{p.changePct.toFixed(2)}%</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Portfolio Summary Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Portfolio Summary</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex justify-between shadow-lg">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Cash Balance</p>
              <p className="text-gray-900 dark:text-white font-semibold text-lg">${cashBalance.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Invested</p>
              <p className="text-gray-900 dark:text-white font-semibold text-lg">${invested.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total Value</p>
              <p className="text-gray-900 dark:text-white font-semibold text-lg">${totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Portfolio Chart Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Portfolio Chart</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
