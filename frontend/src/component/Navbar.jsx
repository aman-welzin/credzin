import React, { useState } from 'react';
import { Menu, X } from 'lucide-react'; // icon library (requires lucide-react)

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/" },
    { name: "Sign In / Sign Up", href: "/login" },
  ];

  return (
    <nav className="bg-blue-600 p-3 shadow-md">
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
        <ul className="hidden md:flex space-x-6">
          {menuItems.map(({ name, href }) => (
            <li key={name}>
              <a
                href={href}
                className="bg-blue-500 hover:bg-blue-700 px-4 py-1 rounded-lg transition duration-200 block shadow-sm"
              >
                {name}
              </a>
            </li>
          ))}
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
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
