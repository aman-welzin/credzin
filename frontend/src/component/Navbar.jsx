import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react'; // Icon library
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../app/slices/authSlice';
import axios from 'axios';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false); // For profile dropdown
  const [userDetails, setUserDetails] = useState(null); // Store user details

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfile = () => setProfileOpen(!profileOpen);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); // Get user state from Redux

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    dispatch(setUser(null)); // Reset user state in Redux
    window.location.href = '/login'; // Redirect to login page
  };

  const menuItems = [
    { name: "Home", href: user ? "/home" : "/" },
    { name: "About", href: "/about" },
  ];

  // Fetch user details from the backend
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserDetails(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    if (user) {
      fetchUserDetails();
    }
  }, [user]);

  return (
    <nav className="bg-blue-600 p-2 shadow-md">
      <div className="flex justify-between items-center text-white font-medium max-w-7xl mx-auto px-4">
        {/* Logo */}
        <div className="text-xl md:text-2xl font-bold tracking-wide">
          <a href="/" className="hover:text-gray-400">CREDZIN</a>
        </div>

        {/* Hamburger Icon */}
        <button onClick={toggleMenu} className="md:hidden text-white focus:outline-none">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 items-center">
          {menuItems.map(({ name, href }) => (
            <li key={name}>
              <a
                href={href}
                className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-lg transition block shadow-sm"
              >
                {name}
              </a>
            </li>
          ))}
          {user ? (
            <>
              {/* Profile Dropdown */}
              <li className="relative">
                <button
                  onClick={toggleProfile}
                  className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-lg transition block shadow-sm"
                >
                  Profile
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b">
                      <p className="font-semibold">{userDetails?.name || 'User'}</p>
                      <p className="text-sm text-gray-600">{userDetails?.email || 'Email'}</p>
                    </div>
                    <ul className="py-2">
                      <li>
                        <a
                          href="/profile"
                          className="block px-4 py-2 hover:bg-gray-100 transition"
                        >
                          View Profile
                        </a>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            </>
          ) : (
            <li>
              <a
                href="/login"
                className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-lg transition block shadow-sm"
              >
                Sign In / Sign Up
              </a>
            </li>
          )}
        </ul>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden flex flex-col space-y-2 px-4 pt-2 pb-4 bg-blue-500 text-white">
          {menuItems.map(({ name, href }) => (
            <li key={name}>
              <a
                href={href}
                className="block w-full px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {name}
              </a>
            </li>
          ))}
          {user ? (
            <>
              <li>
                <button
                  onClick={toggleProfile}
                  className="block w-full px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-700 transition"
                >
                  Profile
                </button>
                {profileOpen && (
                  <div className="mt-2 bg-white text-black rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b">
                      <p className="font-semibold">{userDetails?.name || 'User'}</p>
                      <p className="text-sm text-gray-600">{userDetails?.email || 'Email'}</p>
                    </div>
                    <ul className="py-2">
                      <li>
                        <a
                          href="/profile"
                          className="block px-4 py-2 hover:bg-gray-100 transition"
                        >
                          View Profile
                        </a>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            </>
          ) : (
            <li>
              <a
                href="/login"
                className="block w-full px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-700 transition"
              >
                Sign In / Sign Up
              </a>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;