import { FC, useEffect, useState } from "react";
import Sidebar from "./Sidebar";

interface Trade {
  id: number;
  symbol: string;
  type: "buy" | "sell";
  amount: number;
  price: number;
  total: number;
  timestamp: string;
}

interface Asset {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

const Dashboard: FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    const storedBalance = localStorage.getItem("mockBalance");
    setBalance(storedBalance ? Number(storedBalance) : 1000000);

    const savedTrades = localStorage.getItem("trades");
    if (savedTrades) setTrades(JSON.parse(savedTrades));

    setAssets([
      { symbol: "BTC", name: "Bitcoin", price: 108466, change: -3.67 },
      { symbol: "ETH", name: "Ethereum", price: 4345.35, change: -3.29 },
      { symbol: "XRP", name: "XRP", price: 2.83, change: -5.12 },
      { symbol: "USDT", name: "Tether", price: 1.0, change: 0.01 },
      { symbol: "BNB", name: "BNB", price: 856.2, change: -2.25 },
      { symbol: "SOL", name: "Solana", price: 203.57, change: -3.22 },
    ]);
  }, []);

  // ✅ Total investment = sum of all trade totals
  const totalInvestment = trades.reduce((acc, t) => acc + t.total, 0);

  // ✅ Total Amount left = mockBalance - totalInvestment
  const totalAmount = balance - totalInvestment;

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Sidebar />

      <main className="flex-1 p-6 overflow-auto">
        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
            <p className="text-2xl font-bold mt-1 dark:text-white">${totalAmount.toLocaleString()}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Available Cash</p>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Investment</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">${totalInvestment.toLocaleString()}</p>
            <p className="text-blue-600 dark:text-blue-400 text-sm">Sum of Trades</p>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5">
            <p className="text-sm text-gray-500 dark:text-gray-400">Global Rank</p>
            <p className="text-2xl font-bold mt-1 dark:text-white">#N/A</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Keep trading to climb!</p>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5 relative">
            <div className="absolute top-2 right-2 bg-gray-500 text-xs px-2 py-1 rounded-full text-white">
              Performance
            </div>
            <p className="text-sm text-gray-500">Portfolio Status</p>
            <p className="text-2xl font-bold mt-1">
              ${totalAmount.toLocaleString()}
            </p>
            <p className="text-gray-500 text-sm">Remaining Cash</p>
          </div>
        </div>

        {/* Market Overview */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Market Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {assets.map((coin) => (
              <div
                key={coin.symbol}
                className="bg-white dark:bg-gray-700 shadow-sm rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-bold dark:text-white">{coin.symbol}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{coin.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold dark:text-white">${coin.price.toLocaleString()}</p>
                  <p className={coin.change >= 0 ? "text-green-500 dark:text-green-400 text-sm" : "text-red-500 dark:text-red-400 text-sm"}>
                    {coin.change}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
