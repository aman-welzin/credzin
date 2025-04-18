import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-3 shadow-md">
      <div className="flex justify-between items-center text-white font-medium max-w-7x1 mx-auto">
        
        {/* Company Name */}
        <div className="text-xl md:text-2xl lg:text-2xl font-bold tracking-wide">
          <a href="/" className="hover:text-gray-400 px-8 py-1">CREDZIN</a>
        </div>

        {/* Navigation Items */}
        <ul className="flex space-x-6">
          {["Home", "About", "Sign In / Sign Up"].map((item, index) => {
            const hrefs = ["/", "/", "/login"];
            return (
              <li key={index}>
                <a
                  href={hrefs[index]}
                  className="bg-blue-500 hover:bg-blue-700 px-4 py-1 rounded-lg transition duration-200 block text-center shadow-sm"
                >
                  {item}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
