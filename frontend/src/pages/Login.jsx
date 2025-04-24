import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import sampleImage from "../Images/pexels-ivan-samkov-7621136.jpg";
import { apiEndpoint } from '../api';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${apiEndpoint}/api/v1/auth/login`,
        formData,
        { withCredentials: true }
      );
      console.log("response from login is", response.data);
      const token = response.data.token;
      localStorage.setItem('token', token);
      console.log("Token received:", token);
      navigate('/home');
    } catch (err) {
      console.error("Login error:", err.response?.data?.message || err.message);
    }
  };

  const handleGoogleLogin = () => {
    window.open(`${apiEndpoint}/api/v1/auth/google`, "_self");
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen w-full bg-cover bg-center relative"
      style={{ backgroundImage: `url(${sampleImage})` }}
    >
      {/* Optional dark overlay for contrast */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-0"></div>

      {/* Form Content */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col md:flex-row items-center justify-center p-6">
        <div className="w-full md:w-1/2 bg-white rounded-xl shadow-lg p-8 h-fit">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-0 text-center">
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 mb-3">
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transition-all duration-300 font-semibold"
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition duration-300 font-semibold"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                alt="Google logo"
                className="h-5 w-5 mr-2"
              />
              Sign in with Google
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
