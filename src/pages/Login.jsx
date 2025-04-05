
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.token && data.user) {
        login(data.token, data.user);
        alert("Login successful!");
        navigate("/");
      } else {
        setError(data.error || "Login failed!");
        alert("Login failed!");
      }
    } catch (err) {
      setError("An error occurred during login.");
      console.error(err);
    }
  };

  return (
    <div
      className="relative bg-cover bg-gray-900 bg-center min-h-screen flex items-center justify-center"
      
    >
      <div className="absolute inset-0  bg-opacity-70"></div>
      
      <div className="relative z-10 text-center bg-gray-800/90 p-10 rounded-2xl shadow-lg w-full max-w-md">
        <form onSubmit={handleLogin} className="space-y-6">
          <h1 className="text-4xl font-bold text-white mb-6">Login</h1>
          
          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-3 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:from-indigo-600 hover:to-purple-600 transition"
          >
            Login
          </button>
        </form>
        
        <div className="flex items-center mt-6">
          <div className="flex-1 h-px bg-gray-600"></div>
          <p className="text-gray-400 mx-4 text-sm">New to EventPro?</p>
          <div className="flex-1 h-px bg-gray-600"></div>
        </div>
        
        <Link
          to="/register"
          className="block mt-4 border border-gray-600 text-gray-400 py-2 px-6 rounded-md hover:bg-gray-700 hover:text-white transition"
        >
          Register
        </Link>
        
        {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
