import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import api from "../../../api/api";
import { useDispatch, Provider } from "react-redux";
import { setLoading } from "../../../redux/reduxSlice";

const NavbarBottom = () => {
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/fetchOnlyRequiredCategories');
        setCategories(response.data);
      } catch (error) {
        console.log('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId, categoryName) => {
    dispatch(setLoading(true));
    setIsDropdownOpen(false);
    navigate(`/products?category=${categoryName}`);
    setTimeout(() => {
      dispatch(setLoading(false));
    }, 2000);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNavigation = (to) => {
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById(to);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  return (
    <div className="max-w-container mx-auto h-auto mt-4 bg-white">
      <div className="hidden md:flex justify-center items-center px-4">
        <motion.ul
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-6"
        >
          <Link
            to="/"
            className="relative uppercase text-[16px] text-gray-800 font-thin group hover:text-gray-600"
          >
            Home
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#7b246d] transition-all duration-300 group-hover:w-[75%]"></span>
          </Link>

          <Link
            to="/products"
            className="relative uppercase text-[16px] text-red-600 font-thin group animate-blink"
          >
            Sale
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#7b246d] transition-all duration-300 group-hover:w-[75%]"></span>
          </Link>

          <ScrollLink
            to="new-arrivals"
            smooth={true}
            duration={500}
            offset={-50}
            onClick={() => handleNavigation('new-arrivals')}
            className="relative uppercase text-[16px] text-gray-800 font-thin group cursor-pointer"
          >
            New Arrivals
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#7b246d] transition-all duration-300 group-hover:w-[75%]"></span>
          </ScrollLink>

          <ScrollLink
            to="nayab-exclusive"
            smooth={true}
            duration={500}
            offset={-50}
            onClick={() => handleNavigation('nayab-exclusive')}
            className="relative uppercase text-[16px] text-gray-800 font-thin group cursor-pointer"
          >
            Nayab Exclusive
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#7b246d] transition-all duration-300 group-hover:w-[75%]"></span>
          </ScrollLink>

          <ScrollLink
            to="special-offers"
            smooth={true}
            duration={500}
            offset={-50}
            onClick={() => handleNavigation('special-offers')}
            className="relative uppercase text-[16px] text-gray-800 font-thin group cursor-pointer"
          >
            Special Offers
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#7b246d] transition-all duration-300 group-hover:w-[75%]"></span>
          </ScrollLink>

          <Link
            to="/products"
            className="relative uppercase text-[16px] text-gray-800 font-thin group hover:text-gray-600"
          >
            Explore Shop
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#7b246d] transition-all duration-300 group-hover:w-[75%]"></span>
          </Link>

          <div className="relative"
            onMouseEnter={handleMouseEnter}
            onClick={handleDropdownToggle}
            ref={dropdownRef}
          >
            <span className="relative uppercase text-[16px] text-gray-800 font-thin cursor-pointer group-hover:text-gray-600">
              Categories
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#7b246d] transition-all duration-300 group-hover:w-[75%]"></span>
            </span>

            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-lg border border-gray-200 z-50 p-4 w-60">
                <div className="overflow-hidden rounded-lg">
                  {categories.length > 0 ? (
                    <ul className="space-y-2">
                      {categories.map((category) => (
                        <li key={category.id}>
                          <button
                            onClick={() => handleCategoryClick(category.id, category.name)}
                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-[#7b246d] hover:bg-opacity-20 rounded-lg transition-colors duration-300"
                          >
                            {category.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-2 text-gray-700">No Categories</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.ul>
      </div>
    </div>
  );
};

export default NavbarBottom;
