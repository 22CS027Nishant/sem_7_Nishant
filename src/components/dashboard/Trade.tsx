import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ApexOptions } from 'apexcharts';

import { motion } from "framer-motion";
import CandlestickChart from "../trading/CandlestickChart";
import useRealTimeMarketData from '../../hooks/useRealTimeMarketData';
import { CoinMarketData, CoinOHLCData } from '../../services/coingeckoService';

// Asset and Trade types remain the same
interface Asset { id: string; symbol: string; name: string; price: number; change: number; icon: string }
interface Trade { id: number; symbol: string; type: "buy" | "sell"; amount: number; price: number; total: number; timestamp: string; icon: string }

// Helper functions for data conversion
const mapMarketDataToAssets = (marketData: CoinMarketData[]): Asset[] => {
  return marketData.map(coin => ({
    id: coin.id,
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    price: coin.current_price,
    change: coin.price_change_percentage_24h,
    icon: coin.image
  }));
};

// Sample candlestick data
interface CandlestickDataPoint {
  x: number;
  y: [number, number, number, number];
}

const generateCandlestickData = (): CandlestickDataPoint[] => {
  const data: CandlestickDataPoint[] = [];
  let time = new Date();
  let price = 100;
  
  for (let i = 0; i < 50; i++) {
    const open = price;
    const high = price * (1 + Math.random() * 0.02);
    const low = price * (1 - Math.random() * 0.02);
    const close = low + Math.random() * (high - low);
    
    data.push({
      x: time.getTime(),
      y: [open, high, low, close] as [number, number, number, number]
    });
    
    time = new Date(time.getTime() - 15 * 60000); // 15 minutes back
    price = close;
  }
  
  return data.reverse();
};

// Convert candlestick data to chart format
const formatCandlestickData = (data: CoinOHLCData[]) => {
  return data.map(item => ({
    x: item.time,
    y: [item.open, item.high, item.low, item.close] as [number, number, number, number]
  }));
};

export default function Trade() {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [trades, setTrades] = useState<Trade[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<CandlestickDataPoint[]>([]);
  const [timeframe, setTimeframe] = useState<'1H' | '1D' | '1W' | '1M' | '1Y'>('1D');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { coinGeckoService } = await import('../../services/coingeckoService');
        const marketData = await coinGeckoService.getMarketData();
        const mappedAssets = marketData.map((coin: CoinMarketData) => ({
          id: coin.id,
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          price: coin.current_price,
          change: coin.price_change_percentage_24h,
          icon: coin.image
        }));
        setAssets(mappedAssets);

        // If we have a selected asset, fetch its OHLC data
        if (selectedAsset) {
          // Map timeframe to days parameter accepted by CoinGecko
          const timeframeToDays = (tf: string) => {
            switch (tf) {
              case '1H':
              case '1D':
                return 1;
              case '1W':
                return 7;
              case '1M':
                return 30;
              case '1Y':
                return 365;
              default:
                return 1;
            }
          };

          const days = timeframeToDays(timeframe);
          const ohlcData = await coinGeckoService.getCoinOHLC(
            selectedAsset.id,
            'usd',
            days
          );

          console.debug('OHLC fetched for', selectedAsset.id, 'days=', days, 'count=', Array.isArray(ohlcData) ? ohlcData.length : 'n/a');

          if (Array.isArray(ohlcData) && ohlcData.length > 0) {
            setChartData(ohlcData.map((item: CoinOHLCData) => ({
              x: item.time,
              y: [item.open, item.high, item.low, item.close]
            })));
            setError(null);
          } else {
            // no data returned for this timeframe — keep previous data and surface an error
            setError('No OHLC data available for the selected timeframe.');
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch market data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [selectedAsset, timeframe]);

  // Fetch market list less frequently (separate effect)
  useEffect(() => {
    let cancelled = false;
    const loadMarketList = async () => {
      try {
        const { coinGeckoService } = await import('../../services/coingeckoService');
        const marketData = await coinGeckoService.getMarketData();
        if (cancelled) return;
        setAssets(marketData.map((coin: CoinMarketData) => ({
          id: coin.id,
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          price: coin.current_price,
          change: coin.price_change_percentage_24h,
          icon: coin.image
        })));
      } catch (err) {
        console.warn('Failed to load market list:', err);
      }
    };

    loadMarketList();
    const id = setInterval(loadMarketList, 60000); // every 60s
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  useEffect(() => { 
    const saved = localStorage.getItem("trades"); 
    if (saved) setTrades(JSON.parse(saved)); 
  }, []);

  useEffect(() => { 
    localStorage.setItem("trades", JSON.stringify(trades)); 
  }, [trades]);

  const handleSelectAsset = (asset: Asset) => { 
    setSelectedAsset(asset); 
    setAmount(0);
     // setSelectedCoin(asset.symbol.toLowerCase()); // Removed unused reference
  };

  const handlePlaceOrder = () => {
    if (!selectedAsset || amount <= 0) return;
    const newTrade: Trade = { 
      id: Date.now(), 
      symbol: selectedAsset.symbol, 
      type: orderType, 
      amount, 
      price: selectedAsset.price, 
      total: amount * selectedAsset.price, 
      timestamp: new Date().toLocaleString(), 
      icon: selectedAsset.icon 
    };
    setTrades((prev) => [newTrade, ...prev]);
    setAmount(0);
  };

  const totalCost = amount && selectedAsset ? (amount * selectedAsset.price).toFixed(2) : "0.00";

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <Sidebar />

      <main className="flex-1 p-6 overflow-auto">
        {!selectedAsset ? (
          <div>
            <h2 className="text-2xl font-bold mb-6">Select Asset to Trade</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {assets.map((asset) => (
                <motion.div
                  key={asset.symbol}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg rounded-xl p-5 cursor-pointer flex flex-col justify-between transition-all duration-300"
                  onClick={() => handleSelectAsset(asset)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img src={asset.icon} alt={asset.symbol} className="w-10 h-10" />
                    <div>
                      <p className="font-bold">{asset.symbol}</p>
                      <p className="text-gray-500 text-sm">{asset.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">${asset.price.toLocaleString()}</p>
                    <p className={`text-sm font-medium ${asset.change < 0 ? "text-red-500" : "text-green-500"}`}>
                      {asset.change > 0 ? "+" : ""}{asset.change}%
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <button onClick={() => setSelectedAsset(null)} className="mb-6 text-sm underline hover:text-blue-500">← Back</button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Chart Section */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-xl rounded-xl p-6 col-span-2">
                <h2 className="text-2xl font-bold mb-2 dark:text-white">{selectedAsset.name} ({selectedAsset.symbol})</h2>
                <p className="text-xl font-semibold mb-4 dark:text-white">${selectedAsset.price.toLocaleString()}</p>
                <div className="mb-4 flex items-center justify-end space-x-2">
                  {[
                    { label: '1H', value: '1H' },
                    { label: '1D', value: '1D' },
                    { label: '1W', value: '1W' },
                    { label: '1M', value: '1M' },
                    { label: '1Y', value: '1Y' }
                  ].map((tf) => (
                    <button
                      key={tf.value}
                      onClick={() => setTimeframe(tf.value as any)}
                      className={`px-3 py-1 rounded text-sm ${
                        timeframe === tf.value
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {tf.label}
                    </button>
                  ))}
                </div>
                {isLoading ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                  </div>
                ) : (
                  <>
                    {error && (
                      <div className="mb-4 p-2 rounded bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-200">
                        {error}
                      </div>
                    )}
                    <CandlestickChart data={chartData} height={300} />
                  </>
                )}
              </div>

              {/* Trade Panel */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-xl rounded-xl p-6 flex flex-col gap-4">
                <h3 className="text-lg font-bold mb-2 dark:text-white">Place Order</h3>

                <input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 text-black dark:text-white dark:bg-gray-700" />

                <div className="flex gap-2 mb-4">
                  <button onClick={() => setOrderType("buy")} className={`flex-1 p-3 rounded-md ${orderType === "buy" ? "bg-green-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"} transition`}>
                    Buy
                  </button>
                  <button onClick={() => setOrderType("sell")} className={`flex-1 p-3 rounded-md ${orderType === "sell" ? "bg-red-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"} transition`}>
                    Sell
                  </button>
                </div>

                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md mb-4 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Order Summary</p>
                  <p className="font-bold text-lg dark:text-white">Total: ${totalCost}</p>
                </div>

                <button onClick={handlePlaceOrder} className={`w-full p-3 rounded-md ${orderType === "buy" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"} text-white font-semibold transition`}>
                  {orderType === "buy" ? `Buy ${selectedAsset.symbol}` : `Sell ${selectedAsset.symbol}`}
                </button>
              </div>
            </div>

            {/* Trade History */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-xl rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4 dark:text-white">Trade History</h3>
              {trades.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No trades yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0">
                      <tr>
                        <th className="p-2 text-left dark:text-gray-200">Type</th>
                        <th className="p-2 text-left dark:text-gray-200">Asset</th>
                        <th className="p-2 text-left dark:text-gray-200">Amount</th>
                        <th className="p-2 text-left dark:text-gray-200">Price</th>
                        <th className="p-2 text-left dark:text-gray-200">Total</th>
                        <th className="p-2 text-left dark:text-gray-200">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trades.map((trade) => (
                        <tr key={trade.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                          <td className={`p-2 font-bold ${trade.type === "buy" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{trade.type.toUpperCase()}</td>
                          <td className="p-2 flex items-center gap-2 dark:text-gray-300">
                            <img src={trade.icon} className="w-5 h-5" />
                            {trade.symbol}
                          </td>
                          <td className="p-2 dark:text-gray-300">{trade.amount}</td>
                          <td className="p-2 dark:text-gray-300">${trade.price.toFixed(2)}</td>
                          <td className="p-2 dark:text-gray-300">${trade.total.toFixed(2)}</td>
                          <td className="p-2 text-gray-500 dark:text-gray-400">{trade.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
