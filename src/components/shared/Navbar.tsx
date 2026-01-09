import { FC } from "react";
import { Link } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import ThemeToggle from "./ThemeToggle";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

const NavLink: FC<NavLinkProps> = ({ to, children }) => (
  <Link
    to={to}
    className="text-gray-100 hover:text-white dark:text-gray-300 px-3 py-2 rounded-md transition-colors duration-200"
  >
    {children}
  </Link>
);

const Navbar: FC = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-emerald-500 shadow-md dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-white tracking-wide"
          >
            CryptoSim Pro
          </Link>̣

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <ThemeToggle />
            <Link
              to="/login"
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium shadow hover:bg-gray-100 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-emerald-600 transition"
            >
              Register
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center">
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="p-2 rounded-md hover:bg-blue-700/30 transition">
                <Bars3Icon className="h-6 w-6 text-white" />
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="py-2">
                  {["Home", "Dashboard", "Portfolio", "Trading"].map((item) => (
                    <Menu.Item key={item}>
                      {({ active }) => (
                        <Link
                          to={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                          className={`${
                            active ? "bg-gray-100 dark:bg-gray-700" : ""
                          } block px-4 py-2 text-gray-700 dark:text-gray-300`}
                        >
                          {item}
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/login"
                        className={`${
                          active ? "bg-gray-100 dark:bg-gray-700" : ""
                        } block px-4 py-2 text-blue-600 font-semibold`}
                      >
                        Login
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/register"
                        className={`${
                          active ? "bg-gray-100 dark:bg-gray-700" : ""
                        } block px-4 py-2 text-emerald-600 font-semibold`}
                      >
                        Register
                      </Link>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
