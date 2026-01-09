import { FC } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, BarChart3, ShieldCheck, Users } from "lucide-react";

const Home: FC = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-6 py-16">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white">
          Welcome to <span className="text-blue-600">CryptoSim Pro</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
          Your ultimate crypto trading simulator — practice trading, track your portfolio,
          and improve your strategies without risking real money.
        </p>
        <div className="mt-6 flex space-x-4">
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 bg-emerald-500 text-white rounded-lg shadow hover:bg-emerald-600 transition"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-800 py-16 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white">
          Why Choose CryptoSim Pro?
        </h2>
        <p className="mt-2 text-center text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Everything you need to sharpen your trading skills in one platform.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-2xl shadow hover:shadow-lg transition">
            <TrendingUp className="h-10 w-10 text-blue-600" />
            <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              Real-Time Data
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Trade with live crypto market data powered by trusted APIs.
            </p>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-2xl shadow hover:shadow-lg transition">
            <BarChart3 className="h-10 w-10 text-emerald-500" />
            <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              Portfolio Tracking
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Monitor your trades, profits, and losses in an intuitive dashboard.
            </p>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-2xl shadow hover:shadow-lg transition">
            <ShieldCheck className="h-10 w-10 text-purple-500" />
            <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              Risk-Free Practice
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Experiment with strategies without putting real money at stake.
            </p>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-2xl shadow hover:shadow-lg transition">
            <Users className="h-10 w-10 text-orange-500" />
            <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              Compete & Learn
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Join leaderboards and see how you stack up against other traders.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <footer className="bg-blue-600 text-white py-12 text-center">
        <h2 className="text-3xl font-bold">Ready to Start Trading Smarter?</h2>
        <p className="mt-2 text-lg text-blue-100">
          Sign up today and take your first step towards becoming a pro trader.
        </p>
        <div className="mt-6">
          <Link
            to="/register"
            className="px-6 py-3 bg-white text-blue-600 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Get Started for Free
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
