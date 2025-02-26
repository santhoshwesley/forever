import React from "react";
import { assets } from "../assets/assets";

const Navbar = ({ setToken }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
    Logout
  </button>;

  return (
    <div className="flex items-center py-2 px-[4%] justify-between">
      <img className="w-[max(10%,80px)]" src={assets.logo} alt="" />
      <button
        onClick={handleLogout}
        className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
