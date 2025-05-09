import React, { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react"; // Icon library
import { useSelector, useDispatch } from "react-redux";
import { setUser, logout } from "../app/slices/authSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // For mobile menu
  const [profileOpen, setProfileOpen] = useState(false); // For profile dropdown
  const profileRef = useRef(null); // Reference for the dropdown

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user); // Get user state from Redux

  const toggleMenu = () => setIsOpen(!isOpen); // Toggle mobile menu
  const toggleProfile = () => setProfileOpen(!profileOpen); // Toggle profile dropdown

  const handleLogout = () => {
    dispatch(logout()); // Clear user state in Redux
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/login"); // Redirect to login page
  };

  // Fetch user details from the backend
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        if (!token) return;

        const response = await axios.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` }, // Pass token in headers
        });

        if (response.status === 200) {
          dispatch(setUser(response.data)); // Store user details in Redux
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [dispatch]);

  // Close the profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false); // Close the dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-blue-600 p-2 shadow-md">
      <div className="flex justify-between items-center text-white font-medium max-w-7xl mx-auto px-4">
        {/* Logo */}
        <div className="text-xl md:text-2xl font-bold tracking-wide">
          <button onClick={() => navigate("/home")} className="hover:text-gray-400">
            CREDZIN
          </button>
        </div>

        {/* Hamburger Icon */}
        <button onClick={toggleMenu} className="md:hidden text-white focus:outline-none">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 items-center">
          {user && (
            <>
              {/* Manage Cards Button */}
              <li>
                <button
                  onClick={() => navigate("/manage-cards")} // Navigate to Manage Cards page
                  className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-lg transition block shadow-sm"
                >
                  Manage Cards
                </button>
              </li>

              {/* Profile Dropdown */}
              <li className="relative" ref={profileRef}>
                <button
                  onClick={toggleProfile}
                  className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-lg transition block shadow-sm"
                >
                  Profile
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b">
                      {/* Display First Name */}
                      <p className="font-semibold">
                        {user?.name?.split(" ")[0] || "User"}
                      </p>
                      <p className="text-sm text-gray-600">{user?.email || "Email"}</p>
                    </div>
                    <ul className="py-2">
                      <li>
                        <button
                          onClick={() => navigate("/home")}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                        >
                          View Profile
                        </button>
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
          )}
        </ul>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden flex flex-col space-y-4 mt-4">
          {user && (
            <>
              <li>
                <button
                  onClick={() => navigate("/manage-cards")}
                  className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-lg transition block shadow-sm w-full text-left"
                >
                  Manage Cards
                </button>
              </li>
              <li>
                <button
                  onClick={toggleProfile}
                  className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-lg transition block shadow-sm w-full text-left"
                >
                  Profile
                </button>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded-lg transition block shadow-sm w-full text-left"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;