import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

// ✅ Trade type (same as in Trade component)
interface Trade {
  id: number;
  symbol: string;
  type: "buy" | "sell";
  amount: number;
  price: number;
  total: number;
  timestamp: string;
}

export default function TransactionPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [filter, setFilter] = useState<"all" | "buy" | "sell">("all");
  const [search, setSearch] = useState<string>("");

  // Load trades from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("trades");
    if (saved) setTrades(JSON.parse(saved));
  }, []);

  // Filtered trades based on type and search
  const filteredTrades = trades.filter((trade) => {
    const matchesType = filter === "all" || trade.type === filter;
    const matchesSearch =
      trade.symbol.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar />

      <main className="flex-1 p-6 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Transaction History</h2>

        {/* Filter & Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-md ${
                filter === "all" 
                  ? "bg-indigo-600 text-white dark:bg-indigo-500" 
                  : "bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("buy")}
              className={`px-4 py-2 rounded-md ${
                filter === "buy" 
                  ? "bg-green-600 text-white dark:bg-green-500" 
                  : "bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setFilter("sell")}
              className={`px-4 py-2 rounded-md ${
                filter === "sell" 
                  ? "bg-red-600 text-white dark:bg-red-500" 
                  : "bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              Sell
            </button>
          </div>

          <input
            type="text"
            placeholder="Search by symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-md p-2 w-full md:w-64 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
          />
        </div>

        {/* Trades Table */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5">
          {filteredTrades.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No transactions found.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="p-2 text-left dark:text-gray-200">Type</th>
                  <th className="p-2 text-left dark:text-gray-200">Asset</th>
                  <th className="p-2 text-left dark:text-gray-200">Amount</th>
                  <th className="p-2 text-left dark:text-gray-200">Price</th>
                  <th className="p-2 text-left dark:text-gray-200">Total</th>
                  <th className="p-2 text-left dark:text-gray-200">Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrades.map((trade) => (
                  <tr key={trade.id} className="border-t dark:border-gray-700">
                    <td
                      className={`p-2 font-bold ${
                        trade.type === "buy"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {trade.type.toUpperCase()}
                    </td>
                    <td className="p-2 dark:text-gray-300">{trade.symbol}</td>
                    <td className="p-2 dark:text-gray-300">{trade.amount}</td>
                    <td className="p-2 dark:text-gray-300">${trade.price.toFixed(2)}</td>
                    <td className="p-2 dark:text-gray-300">${trade.total.toFixed(2)}</td>
                    <td className="p-2 text-gray-500 dark:text-gray-400">{trade.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
