import { FC } from "react";
import { Crown, Medal, Award, Trophy } from "lucide-react";
import Sidebar from "./Sidebar";

interface User {
  id: number;
  name: string;
  balance: number;
  return: number; // percentage return
  trades: number;
  winRate: number;
  bestTrade: number;
  worstTrade: number;
  status: 'rising' | 'falling' | 'stable';
}

const usersData: User[] = [
  { id: 1, name: "CryptoWhale", balance: 1250000, return: 25.0, trades: 58, winRate: 68, bestTrade: 22.5, worstTrade: -5.2, status: 'rising' },
  { id: 2, name: "BTCMaster", balance: 1180000, return: 18.0, trades: 45, winRate: 65, bestTrade: 19.8, worstTrade: -6.1, status: 'rising' },
  { id: 3, name: "AlphaTrader", balance: 1150000, return: 15.0, trades: 52, winRate: 62, bestTrade: 18.2, worstTrade: -7.3, status: 'stable' },
  { id: 4, name: "DiamondHands", balance: 1120000, return: 12.0, trades: 32, winRate: 59, bestTrade: 16.5, worstTrade: -8.2, status: 'rising' },
  { id: 5, name: "CryptoNinja", balance: 1080000, return: 8.0, trades: 41, winRate: 55, bestTrade: 15.3, worstTrade: -9.1, status: 'stable' },
  { id: 6, name: "HODLKing", balance: 1050000, return: 5.0, trades: 28, winRate: 52, bestTrade: 13.7, worstTrade: -10.2, status: 'falling' },
  { id: 7, name: "TechAnalyst", balance: 980000, return: -2.0, trades: 48, winRate: 45, bestTrade: 12.1, worstTrade: -12.5, status: 'falling' },
  { id: 8, name: "DayTrader", balance: 950000, return: -5.0, trades: 56, winRate: 42, bestTrade: 10.8, worstTrade: -13.8, status: 'falling' },
  { id: 9, name: "SwingMaster", balance: 920000, return: -8.0, trades: 39, winRate: 38, bestTrade: 9.5, worstTrade: -15.2, status: 'falling' },
  { id: 10, name: "CryptoPro", balance: 900000, return: -10.0, trades: 44, winRate: 35, bestTrade: 8.2, worstTrade: -16.5, status: 'falling' },
];

const Leaderboard: FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar/>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <Trophy className="h-6 w-6 text-yellow-500 mr-2" /> Global Leaderboard
        </h2>

        <div className="space-y-4">
          {usersData.map((user, index) => {
            const positive = user.return >= 0;

            // Rank icon logic
            let icon = <span className="font-bold dark:text-white">#{index + 1}</span>;
            if (index === 0) icon = <Crown className="h-6 w-6 text-yellow-500" />;
            else if (index === 1) icon = <Medal className="h-6 w-6 text-gray-400" />;
            else if (index === 2) icon = <Award className="h-6 w-6 text-orange-400" />;

            return (
              <div
                key={user.id}
                className="flex flex-col bg-white dark:bg-gray-800 shadow-md rounded-xl px-6 py-4"
              >
                {/* Top Row */}
                <div className="flex justify-between items-center mb-3">
                  {/* Left Side */}
                  <div className="flex items-center space-x-3">
                    {icon}
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-gray-200">{user.name}</div>
                      <div
                        className={`text-sm ${
                          positive ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"
                        }`}
                      >
                        {user.return.toFixed(2)}% return
                      </div>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="text-right">
                    <div className="font-bold text-gray-900 dark:text-white">
                      ${user.balance.toLocaleString()}
                    </div>
                    <div
                      className={`text-sm ${
                        positive ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"
                      }`}
                    >
                      {positive ? "+" : ""}${Math.abs(user.balance - 1000000).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-4 gap-4 mt-2 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Trades</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{user.trades}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Win Rate</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{user.winRate}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Best Trade</p>
                    <p className="font-semibold text-green-600 dark:text-green-400">+{user.bestTrade}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Worst Trade</p>
                    <p className="font-semibold text-red-600 dark:text-red-400">{user.worstTrade}%</p>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="mt-2 flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    user.status === 'rising' 
                      ? 'bg-green-500' 
                      : user.status === 'falling' 
                        ? 'bg-red-500' 
                        : 'bg-yellow-500'
                  }`}></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {user.status === 'rising' 
                      ? 'Rising' 
                      : user.status === 'falling' 
                        ? 'Falling' 
                        : 'Stable'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Users */}
        <p className="mt-6 text-gray-600 dark:text-gray-400">
          Total Users: <span className="font-semibold">{usersData.length}</span>
        </p>
      </main>
    </div>
  );
};

export default Leaderboard;
