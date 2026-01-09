// import { FC, useState } from 'react';
// import axios from "axios";
// import toast from "react-hot-toast";


// const Register: FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [username, setUsername] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Basic validation
//     if (!username) return toast.error("Username is required");
//     if (!email.includes("@")) return toast.error("Invalid email address");
//     if (password.length < 6) return toast.error("Password must be at least 6 characters");

//     try {
//       // Call backend API
//       const response = await axios.post("http://localhost:5000/api/auth/register", {
//         username,
//         email,
//         password,
//       });

//       // Show success toast
//       toast.success(response.data.message || "Registration successful!");

//       // Clear form fields
//       setUsername("");
//       setEmail("");
//       setPassword("");

//       // Redirect to login after 1.5s
//       setTimeout(() => {
//         window.location.href = "/login";
//       }, 1500);
//     } catch (error: any) {
//       // Show error toast
//       toast.error(error.response?.data?.message || "Registration failed");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Register</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block mb-1">Username</label>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="w-full p-2 border rounded"
//           />
//         </div>
//         <div>
//           <label className="block mb-1">Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full p-2 border rounded"
//           />
//         </div>
//         <div>
//           <label className="block mb-1">Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full p-2 border rounded"
//           />
//         </div>
//         <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
//           Register
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Register;

// src/components/Register.tsx
import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { UserIcon, EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import toast from "react-hot-toast";

const Register: FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes("@")) return toast.error("Invalid email address");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", { username, email, password });
      toast.success(res.data.message || "Registration successful!");
      setUsername("");
      setEmail("");
      setPassword("");
      setTimeout(() => (window.location.href = "/login"), 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side Gradient */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-emerald-500 via-indigo-600 to-blue-500 items-center justify-center">
        <div className="text-center px-10">
          <h1 className="text-5xl font-extrabold text-white mb-4">CryptoSim Pro</h1>
          <p className="text-lg text-white/80">
            Track your portfolio, trade crypto, and visualize your performance like a pro.
          </p>
        </div>
      </div>

      {/* Right Side Registration Card */}
      <div className="flex-1 flex items-center justify-center px-6 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">Create Account 🚀</h2>
          <p className="text-center text-gray-500 dark:text-gray-300 mt-2">
            Join CryptoSim Pro today
          </p>

          <form onSubmit={handleRegister} className="mt-8 space-y-6">
            {/* Username */}
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-emerald-400 outline-none transition"
              />
            </div>

            {/* Email */}
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

            {/* Password */}
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

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold shadow-lg hover:opacity-90 transition"
            >
              Register
            </button>
          </form>

          <p className="mt-6 text-center text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 dark:text-blue-400 hover:underline font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
