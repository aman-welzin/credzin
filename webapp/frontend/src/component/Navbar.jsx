// import React, { useState, useEffect, useRef } from "react";
// import { Menu, X } from "lucide-react"; // Icon library
// import { useSelector, useDispatch } from "react-redux";
// import { setUser, logout } from "../app/slices/authSlice";
// import axios from "axios";
// import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation for route checking

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false); // For mobile menu
//   const [profileOpen, setProfileOpen] = useState(false); // For profile dropdown
//   const profileRef = useRef(null); // Reference for the dropdown

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation(); // Get the current route
//   const user = useSelector((state) => state.auth.user); // Get user state from Redux

//   const toggleMenu = () => setIsOpen(!isOpen); // Toggle mobile menu
//   const toggleProfile = () => setProfileOpen(!profileOpen); // Toggle profile dropdown

//   const handleLogout = () => {
//     dispatch(logout()); // Clear user state in Redux
//     localStorage.removeItem("token"); // Remove token from localStorage
//     navigate("/login"); // Redirect to login page
//   };

//   // Fetch user details from the backend
// useEffect(() => {
//   const fetchUserDetails = async () => {
//     try {
//       const token = localStorage.getItem("token"); // Get token from localStorage
//       if (!token) return;

//       const response = await axios.get("/api/user/profile", {
//         headers: { Authorization: `Bearer ${token}` }, // Pass token in headers
//       });

//       if (response.status === 200) {
//         dispatch(setUser(response.data)); // Store user details in Redux
//       }
//     } catch (error) {
//       console.error("Error fetching user details:", error);
//     }
//   };

//   fetchUserDetails();
// }, [dispatch, user]); // Add `user` as a dependency

//   // Close the profile dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileRef.current && !profileRef.current.contains(event.target)) {
//         setProfileOpen(false); // Close the dropdown
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Check if the current route is login or signup
//   const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

//   return (
//     <nav className="bg-blue-600 p-1 shadow-md">
//       <div className="flex justify-between items-center text-white font-medium max-w-7xl mx-auto px-4">
//         {/* Logo */}
//         <div className="text-xl md:text-2xl font-bold tracking-wide">
//           <button onClick={() => navigate("/home")} className="hover:text-gray-400">
//             CREDZIN
//           </button>
//         </div>

//         {/* Hamburger Icon */}
//         <button onClick={toggleMenu} className="md:hidden text-white focus:outline-none">
//           {isOpen ? <X size={28} /> : <Menu size={28} />}
//         </button>

//         {/* Desktop Menu */}
//         {!isAuthPage && user && (
//           <ul className="hidden md:flex space-x-6 items-center">
            

//             {/* Profile Dropdown */}
//             <li className="relative" ref={profileRef}>
//               <button
//                 onClick={toggleProfile}
//                 className="bg-blue-500 hover:bg-blue-700 px-6 py-1 rounded-lg transition block shadow-sm"
//               >
//                 Profile
//               </button>
//               {profileOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-50">
//                   <div className="p-4 border-b">
//                     {/* Display First Name */}
//                     <p className="font-semibold">
//                       {user?.name?.split(" ")[0] || "User"}
//                     </p>
//                     <p className="text-sm text-gray-600">{user?.email || "Email"}</p>
//                   </div>
//                   <ul className="py-2">
//                     {/* Manage Cards Button */}
//                     <li>
//                       <button
//                         onClick={() => {
//                           navigate("/manage-cards");
//                           setProfileOpen(false); // Close dropdown after navigation
//                         }}
//                         className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
//                       >
//                         Manage Cards
//                       </button>
//                     </li>
//                     <li>
//                       <button
//                         onClick={() => {
//                           navigate("/profile");
//                           setProfileOpen(false); // Close dropdown after navigation
//                         }}
//                         className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
//                       >
//                         View Profile
//                       </button>
//                     </li>
//                     <li>
//                       <button
//                         onClick={() => {
//                           handleLogout();
//                           setProfileOpen(false); // Close dropdown before logout
//                         }}
//                         className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
//                       >
//                         Logout
//                       </button>
//                     </li>
//                   </ul>
//                 </div>
//               )}
//             </li>
//           </ul>
//         )}
//       </div>

//       {/* Mobile Menu */}
//       {isOpen && !isAuthPage && user && (
//         <ul className="md:hidden flex flex-col space-y-4 mt-4">
//           <li>
//             <button
//               onClick={() => {
//                 navigate("/manage-cards");
//                 setIsOpen(false); // Close the menu
//               }}
//               className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-lg transition block shadow-sm w-full text-left"
//             >
//               Manage Cards
//             </button>
//           </li>
//           <li>
//             <button
//               onClick={() => {
//                 toggleProfile();
//                 setIsOpen(false); // Close the menu
//               }}
//               className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-lg transition block shadow-sm w-full text-left"
//             >
//               Profile
//             </button>
//           </li>
//           <li>
//             <button
//               onClick={() => {
//                 handleLogout();
//                 setIsOpen(false); // Close the menu
//               }}
//               className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded-lg transition block shadow-sm w-full text-left"
//             >
//               Logout
//             </button>
//           </li>
//         </ul>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setUser, logout } from "../app/slices/authSlice";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfile = () => setProfileOpen(!profileOpen);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/login");
  };

  // useEffect(() => {
  //   const fetchUserDetails = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       if (!token) return;

  //       const response = await axios.get("/api/user/profile", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });

  //       if (response.status === 200) {
  //         dispatch(setUser(response.data));
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user details:", error);
  //     }
  //   };

  //   fetchUserDetails();
  // }, [dispatch,user, location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <nav className="bg-blue-600 p-1 shadow-md">
      <div className="flex justify-between items-center text-white font-medium max-w-7xl mx-auto px-4">
        <div className="text-xl md:text-2xl font-bold tracking-wide">
          <button onClick={() => navigate("/home")} className="hover:text-gray-400">
            CREDZIN
          </button>
        </div>

        <button onClick={toggleMenu} className="md:hidden text-white focus:outline-none">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {!isAuthPage && user && (
          <ul className="hidden md:flex space-x-6 items-center">
            <li>
              <button
                onClick={() => navigate("/home")}
                className="hover:text-gray-200"
              >
                Home
              </button>
            </li>

            <li className="relative" ref={profileRef}>
              <button
                onClick={()=>{
                  toggleProfile();
                  
                }}
                className="bg-blue-500 hover:bg-blue-700 px-6 py-1 rounded-lg transition block shadow-sm"
              >
                Profile
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b">
                    <p className="font-semibold">
                      {user?.name?.split(" ")[0] || "User"}
                    </p>
                    <p className="text-sm text-gray-600">{user?.email || "Email"}</p>
                  </div>
                  <ul className="py-2">
                    <li>
                      <button
                        onClick={() => {
                          navigate("/manage-cards");
                          setProfileOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                      >
                        Manage Cards
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() =>{
                          navigate("/profile")
                          toggleProfile();}
                        }

                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                      >
                        View Profile
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleLogout();
                          setProfileOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </li>
          </ul>
        )}
      </div>

      {isOpen && !isAuthPage && user && (
        <ul className="md:hidden flex flex-col space-y-4 mt-4 px-4">
          <li>
            <button
              onClick={() => {
                navigate("/home");
                setIsOpen(false);
              }}
              className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-lg transition block shadow-sm w-full text-left"
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                navigate("/manage-cards");
                setIsOpen(false);
              }}
              className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-lg transition block shadow-sm w-full text-left"
            >
              Manage Cards
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                toggleProfile();
                setIsOpen(false);
              }}
              className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-lg transition block shadow-sm w-full text-left"
            >
              Profile
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded-lg transition block shadow-sm w-full text-left"
            >
              Logout
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
