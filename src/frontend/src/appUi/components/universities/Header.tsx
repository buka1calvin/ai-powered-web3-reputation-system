import { FaSearch } from "react-icons/fa";
import React from "react";
const Header = () => {
  return (
    <div className="w-full py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-slate-700">All Universities</h1>
      
      <div className="w-2/3 flex justify-end px-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
     <FaSearch className="text-gray-500" /> 
          </span>
          <input
            type="text"
            placeholder="Search universities..."
            className=" pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
      </div>

      <button className="bg-cyan-700 text-white px-4 py-2 rounded-md hover:bg-cyan-950">
        Apply University
      </button>
    </div>
  );
};

export default Header;
