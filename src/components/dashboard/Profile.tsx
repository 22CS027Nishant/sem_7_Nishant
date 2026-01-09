// src/components/dashboard/Profile.tsx
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { useAuth } from '../../contexts/AuthContext';

// Trade type (should match your Trade component)
interface Trade {
  id: number;
  symbol: string;
  type: "buy" | "sell";
  amount: number;
  price: number;
  total: number;
  timestamp: string;
}

const Profile: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const { user } = useAuth();

  // Function to calculate balance dynamically
  const calculateBalance = () => {
    const storedTrades = localStorage.getItem("trades");
    const initialBalance = 1000000; // default mock balance
    if (!storedTrades) {
      localStorage.setItem("mockBalance", initialBalance.toString());
      return initialBalance;
    }

    const trades: Trade[] = JSON.parse(storedTrades);

    // Calculate balance: subtract total for buys, add total for sells
    const currentBalance = trades.reduce((acc, trade) => {
      if (trade.type === "buy") return acc - trade.total;
      else return acc + trade.total;
    }, initialBalance);

    return currentBalance;
  };

  useEffect(() => {
    setBalance(calculateBalance());

    // Listen for changes in localStorage (e.g., new trades)
    const handleStorageChange = () => setBalance(calculateBalance());
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <p className="text-lg">
            <span className="font-medium dark:text-gray-300">Username:</span>{' '}
            <span className="dark:text-gray-200">{user?.email ? user.email.split('@')[0] : 'Demo User'}</span>
          </p>
          <p className="text-lg">
            <span className="font-medium dark:text-gray-300">Email:</span>{' '}
            <span className="dark:text-gray-200">{user?.email ?? 'demo@example.com'}</span>
          </p>
          <p className="text-lg mt-4">
            <span className="font-medium dark:text-gray-300">Mock Balance:</span>{" "}
            <span className="text-green-600 dark:text-green-400 font-bold">
              ${balance.toLocaleString()}
            </span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Profile;
