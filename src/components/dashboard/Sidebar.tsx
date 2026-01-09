import { FC } from "react";
import { NavLink } from "react-router-dom";
import { Home, User, List, LogOut, PieChart, Award, CreditCard } from "lucide-react"; // using CreditCard as Trade icon
import ThemeToggle from "../shared/ThemeToggle";
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: FC = () => {
  const { logout } = useAuth();
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `w-full flex items-center px-4 py-3 rounded-lg transition ${
      isActive ? "bg-white/30" : "hover:bg-white/20"
    }`;

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-600 to-emerald-500 dark:from-gray-800 dark:to-gray-900 text-white flex flex-col">
      <div className="h-16 flex items-center justify-between px-4 text-xl font-bold border-b border-white/20">
        <span>Crypto Trader</span>
        <ThemeToggle />
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink to="/dashboard" className={linkClass}>
          <Home className="h-5 w-5 mr-2" /> Dashboard
        </NavLink>
        <NavLink to="/trade" className={linkClass}>
          <CreditCard className="h-5 w-5 mr-2" /> Trade
        </NavLink>
        <NavLink to="/profile" className={linkClass}>
          <User className="h-5 w-5 mr-2" /> Profile
        </NavLink>
        <NavLink to="/transactions" className={linkClass}>
          <List className="h-5 w-5 mr-2" /> Transactions
        </NavLink>
        <NavLink to="/portfolio" className={linkClass}>
          <PieChart className="h-5 w-5 mr-2" /> Portfolio
        </NavLink>
        <NavLink to="/leaderboard" className={linkClass}>
          <Award className="h-5 w-5 mr-2" /> Leaderboard
        </NavLink>
        <button
          onClick={async () => {
            try {
              await logout();
            } catch (err) {
              console.error('Logout failed:', err);
            }
          }}
          className="w-full flex items-center px-4 py-3 mt-auto rounded-lg hover:bg-white/20 transition"
        >
          <LogOut className="h-5 w-5 mr-2" /> Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
