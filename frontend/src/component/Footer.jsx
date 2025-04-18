import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-4 mt-0 shadow-lg">
      <div className="max-w-7xl mx-auto px4 md:px-8 flex flex-col md:flex-row justify-center items-center gap-4 text-sm md:text-base text-center md:text-left">
        
        {/* Left Side: Copyright */}
        <p>
          © {new Date().getFullYear()} <span className="font-semibold">Credzin</span>. All rights reserved.
        </p>
        <span>|</span>
        {/* Right Side: Links */}
        <div className="flex items-center gap-8">
          <a href="/" className="hover:text-gray-400 transition">Privacy Policy</a>
          <span>|</span>
          <a href="/" className="hover:text-gray-400 transition">Terms of Service</a>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;