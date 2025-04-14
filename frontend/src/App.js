


import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate,Navigate , useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Hello from './pages/Hello';
import PrivateRoute from './component/PrivateRoutes';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from './app/slices/authSlice';
import { setCart } from './app/slices/cartSlice';
import './index.css';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token');

  // Step 1: Get token from URL and store it
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      window.history.replaceState({}, document.title, '/home'); // remove query param
      navigate('/home'); // force redirect to /home route
    }
  }, [location.search, navigate]);
  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const tokenFromURL = urlParams.get('token');
  //   if (tokenFromURL) {
  //     console.log("Setting token from URL:", tokenFromURL);
  //     localStorage.setItem('token', tokenFromURL);
  
  //     // Optional: Clean up the URL (remove token param)
  //     const newUrl = window.location.pathname;
  //     window.history.replaceState({}, document.title, newUrl);
  //   }
  // }, []);

  // Step 2: Fetch user info
  const getUser = async () => {
    if (localStorage.getItem('token')) {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/auth/userdata', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log('User data:', response.data.user);
        if (response.status === 200) {
          dispatch(setUser(response.data.user));
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
  };

  // Step 3: Fetch card info
  const getCardDetails = async () => {
    if (localStorage.getItem('token')) {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/auth/addedcards', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log('Card details:', response.data.cards);
        if (response.status === 200) {
          dispatch(setCart(response.data.cards));
        }
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    }
  };

  // Step 4: Run once on mount
  useEffect(() => {
    getUser();
    getCardDetails();
  }, []);

  return (
    <div className="App">
      <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
