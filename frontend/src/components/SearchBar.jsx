import React, { useContext, useEffect, useRef, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useLocation, useNavigate } from "react-router-dom";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch, products } =
    useContext(ShopContext);
  const searchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  useEffect(() => {
    if (!location.pathname.includes("collection")) {
      setShowSearch(false);
    }
  }, [location, setShowSearch]);

  // Close search bar if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        !event.target.closest("li")
      ) {
        setShowSearch(false);
      }
    };

    if (showSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSearch, setShowSearch]);

  // Show suggestions when typing
  useEffect(() => {
    if (search.trim() !== "") {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );

      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  }, [search, products]);

  // Handle suggestion click - Redirects to product page
  const handleSuggestionClick = (product) => {
    setSearch("");
    setTimeout(() => {
      navigate(`/product/${product._id}`);
      setShowSearch(false);
    }, 100);
  };

  return showSearch ? (
    <div
      ref={searchRef}
      className="fixed top-0 left-0 right-0 bg-gray-50 text-center p-4 shadow-md z-50 flex items-center justify-center"
    >
      <div className="flex flex-col w-3/4 sm:w-1/2 rounded-lg shadow-lg">
        {/* Search Bar */}
        <div className="flex items-center border border-gray-400 px-5 py-2 ">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none bg-inherit text-sm"
            type="text"
            placeholder="Search..."
            autoFocus
          />
          <img
            className="w-4 cursor-pointer"
            src={assets.search_icon}
            alt="Search"
          />
        </div>

        {/* Suggestions */}
        {filteredSuggestions.length > 0 && (
          <ul className="bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-auto">
            {filteredSuggestions.map((product, index) => (
              <li
                key={product._id}
                onClick={() => handleSuggestionClick(product)}
                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer text-left"
              >
                {/* Product Image */}
                <img
                  src={product.images}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded-md mr-3"
                />
                {/* Product Name */}
                <span>{product.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <img
        onClick={() => setShowSearch(false)}
        className="w-5 ml-3 cursor-pointer"
        src={assets.cross_icon}
        alt="Close"
      />
    </div>
  ) : null;
};

export default SearchBar;
