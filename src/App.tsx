import { FC } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./components/dashboard/Dashboard";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Navbar from "./components/shared/Navbar";
import Homepage from "./components/shared/Home";
import Leaderboard from "./components/dashboard/Leaderboard";
import Trade from "./components/dashboard/Trade";
import Profile from "./components/dashboard/Profile";
import Portfolio from "./components/dashboard/Portfolio";
import TransactionPage from "./components/dashboard/TransactionPage";
import TradingInterface from "./components/trading/TradingInterface";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

const AppContent: FC = () => {
  const location = useLocation();

  // Show Navbar only on homepage
  const showNavbar = location.pathname === "/";

  return (
    <div className="bg-background dark:bg-dark-background">
      {showNavbar && <Navbar />}
      <main className="">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/login" element={<Login />} />
          <Route path="/transactions" element={<TransactionPage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/trading" element={<TradingInterface />} />
          <Route
            path="*"
            element={
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  404 - Page Not Found
                </h2>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

const App: FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
