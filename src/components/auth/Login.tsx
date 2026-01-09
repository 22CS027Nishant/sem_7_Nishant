// // filepath: e:\cryptosim-pro\client\src\components\auth\Login.tsx
// import { FC, useState, FormEvent } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';

// const Login: FC = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const { login } = useAuth();

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     try {
//       await login(email, password);
//       navigate('/dashboard');
//     } catch (err) {
//       setError('Failed to login. Please check your credentials.');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Sign in to your account
//           </h2>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           {error && (
//             <div className="text-red-500 text-center p-2 bg-red-50 rounded">
//               {error}
//             </div>
//           )}
//           <div className="rounded-md shadow-sm -space-y-px">
//             <div>
//               <input
//                 type="email"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 placeholder="Email address"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//             <div>
//               <input
//                 type="password"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//           </div>
//           <div>
//             <button
//               type="submit"
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Sign in
//             </button>
//           </div>
//           <div className="text-center">
//             <Link to="/register" className="text-indigo-600 hover:text-indigo-500">
//               Don't have an account? Sign up
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

// src/components/Login.tsx
import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import axios from "axios";

const Login: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
  const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
  localStorage.setItem("token", res.data.token);
  // Persist user so AuthContext can pick it up and Profile shows the logged-in user
  if (res.data.user) localStorage.setItem('user', JSON.stringify(res.data.user));
  alert("Login successful!");
  window.location.href = "/dashboard";
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side Gradient */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-emerald-500 via-indigo-600 to-blue-600 items-center justify-center">
        <div className="text-center px-10">
          <h1 className="text-5xl font-extrabold text-white mb-4">CryptoSim Pro</h1>
          <p className="text-lg text-white/80">
            Track your portfolio, trade crypto, and visualize your performance like a pro.
          </p>
        </div>
      </div>

      {/* Right Side Login Card */}
      <div className="flex-1 flex items-center justify-center px-6 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">Welcome Back</h2>
          <p className="text-center text-gray-500 dark:text-gray-300 mt-2">
            Log in to your account
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div className="relative">
              <EnvelopeIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-emerald-400 outline-none transition"
              />
            </div>

            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-emerald-400 outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold shadow-lg hover:opacity-90 transition"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 dark:text-blue-400 hover:underline font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
