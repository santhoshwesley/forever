import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { setShowSearch, getCartCount, token, setToken, setCartItems } =
    useContext(ShopContext);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  // Handle search icon click
  const handleSearchClick = () => {
    if (!location.pathname.includes("collection")) {
      navigate("/collection");
    }
    setShowSearch(true);
  };

  return (
    <div className="flex items-center justify-between py-5 font-medium relative">
      <Link to="/">
        <img src={assets.logo} className="w-36" alt="Logo" />
      </Link>

      {/* Navigation Menu */}
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        {["/", "/collection", "/about", "/contact"].map((path, index) => {
          const labels = ["HOME", "COLLECTION", "ABOUT", "CONTACT"];
          return (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 ${
                  isActive ? "text-black font-bold" : ""
                }`
              }
            >
              <p>{labels[index]}</p>
              <hr
                className={`w-2/4 border-none h-[1.5px] bg-gray-700 ${
                  location.pathname === path ? "block" : "hidden"
                }`}
              />
            </NavLink>
          );
        })}
      </ul>

      {/* Icons Section */}
      <div className="flex items-center gap-6">
        {/* Search Icon */}
        <img
          onClick={() => {
            if (!location.pathname.includes("collection")) {
              navigate("/collection");
            }
            setShowSearch(true);
          }}
          src={assets.search_icon}
          className="w-5 cursor-pointer"
          alt="Search"
        />

        {/* Profile Dropdown */}
        <div className="relative group">
          <img
            onClick={() => (token ? null : navigate("/login"))}
            className="w-5 cursor-pointer"
            src={assets.profile_icon}
            alt="Profile"
          />
          {token && (
            <div className="hidden group-hover:block absolute dropdown-menu right-0 pt-4">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                <p className="cursor-pointer hover:text-black">My Profile</p>
                <p
                  onClick={() => navigate("/orders")}
                  className="cursor-pointer hover:text-black"
                >
                  Orders
                </p>
                <p onClick={logout} className="cursor-pointer hover:text-black">
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Cart Icon */}
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt="Menu"
        />
      </div>

      {/* Search Bar Component */}
      <SearchBar />
    </div>
  );
};

export default Navbar;
