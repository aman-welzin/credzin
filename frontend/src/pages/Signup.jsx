import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiEndpoint } from '../api';


const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    contact: '',
  });
  const [error, setError] = useState('');
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
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${apiEndpoint}/api/v1/auth/signup`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        contact: formData.contact,
      });

      console.log('Signup successful:', response.data);
      navigate('/login');
    } catch (err) {
      setError('Signup failed. Please try again.');
      console.log(err.message);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100">
      <div className="flex flex-row w-full min-h-screen">
        {/* Left Side - Form */}
        <div className="w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2 text-center">
              Create an Account
            </h2>
            <p className="text-center text-gray-500 mb-8">
              Join us today
            </p>

            {error && (
              <p className="text-center text-red-500 text-sm mb-4">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Name */}
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400"
                  placeholder="John"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400"
                  placeholder="Doe"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
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

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
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

              {/* Confirm Password */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400"
                  placeholder="••••••••"
                />
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <label
                  htmlFor="contact"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contact
                </label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400"
                  placeholder="123-456-7890"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transition-all duration-300 font-semibold"
              >
                Sign Up
              </button>
            </form>

            {/* Login Link */}
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>

        {/* Right Side - Image (Option 1) */}
        <div className="w-1/2 flex items-center justify-center bg-gray-200">
          <div className="relative w-3/4 h-3/4 rounded-lg overflow-hidden shadow-md">
            <img
              src="https://images.pexels.com/photos/164501/pexels-photo-164501.jpeg?auto=compress&cs=tinysrgb&w=400"
              alt="Signup Visual"
              className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-center justify-center">
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;