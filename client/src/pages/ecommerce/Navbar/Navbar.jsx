import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { SlEnvolope, SlPhone } from "react-icons/sl";
import { HiSearch } from "react-icons/hi";
import { HiMiniBars3BottomRight, HiMiniShoppingBag, HiMiniUser } from "react-icons/hi2";
import { PK, US, GB, TR, OM, AE, SA, QA, CA, EU, AU, BD, HK, TH, NZ } from 'country-flag-icons/react/3x2';
import { RiArrowDropDownLine } from "react-icons/ri";
import logo from "/Images/BuyvoLogo.png";
import api from "../../../api/api";
import { toast } from 'react-toastify';
import MobileSidebar from "./MobileSidebar";
import { motion } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../redux/reduxSlice";
import Marquee from 'react-fast-marquee';

const Navbar = ({ onCurrencyChange }) => {
  const [currency, setCurrency] = useState('PKR');
  const [sidenav, setSidenav] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const products = useSelector((state) => state.reduxReducer.products);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currencyRef = useRef(null);
  const userRef = useRef(null);
  const dropdownRef = useRef(null);

  const refs = {
    currency: currencyRef,
    user: userRef,
    dropdown: dropdownRef,
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(refs).forEach((key) => {
        if (refs[key].current && !refs[key].current.contains(event.target)) {
          switch (key) {
            case "currency":
              setIsOpen(false);
              break;
            case "user":
              setShowUser(false);
              break;
            case "dropdown":
              setIsDropdownOpen(false);
              break;
            default:
              break;
          }
        }
      });
    };

    document.body.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.body.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = async (query) => {
    if (query.length > 0) {
      try {
        const response = await api.get(`/api/search?term=${searchQuery}`);
        const { products, categories } = response.data;

        setSearchResults({ products, categories });
        setShowDropdown(true);
      } catch (error) {
        console.error('Error fetching search results', error);
        toast.error('Error fetching search results', error);
      }
    } else {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleCategoryClick = (categoryName) => {
    dispatch(setLoading(true));
    setSearchOpen(false);
    setShowDropdown(false);
    setSearchQuery('');
    setTimeout(() => { dispatch(setLoading(false)); }, 2000);
    navigate(`/products?category=${categoryName}`);
  };

  const handleProductClick = (productName) => {
    dispatch(setLoading(true));
    setSearchOpen(false);
    setShowDropdown(false);
    setSearchQuery('');
    setTimeout(() => { dispatch(setLoading(false)); }, 2000);
    navigate(`/products?name=${productName}`);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowDropdown(true);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setShowDropdown(false);
    setSearchQuery('');
  };

  const flagComponents = {
    PKR: <PK className="inline-block w-5 h-5 mr-2" />,
    USD: <US className="inline-block w-5 h-5 mr-2" />,
    AED: <AE className="inline-block w-5 h-5 mr-2" />,
    SAR: <SA className="inline-block w-5 h-5 mr-2" />,
    OMR: <OM className="inline-block w-5 h-5 mr-2" />,
    TRY: <TR className="inline-block w-5 h-5 mr-2" />,
    GBP: <GB className="inline-block w-5 h-5 mr-2" />,
    QAR: <QA className="inline-block w-5 h-5 mr-2" />,
    CAD: <CA className="inline-block w-5 h-5 mr-2" />,
    EUR: <EU className="inline-block w-5 h-5 mr-2" />,
    AUD: <AU className="inline-block w-5 h-5 mr-2" />,
    BDT: <BD className="inline-block w-5 h-5 mr-2" />,
    HKD: <HK className="inline-block w-5 h-5 mr-2" />,
    THB: <TH className="inline-block w-5 h-5 mr-2" />,
    NZD: <NZ className="inline-block w-5 h-5 mr-2" />
  };

  const currencies = [
    { code: "PKR", name: "Pakistani Rupee" },
    { code: "USD", name: "US Dollar" },
    { code: "AED", name: "UAE Dirham" },
    { code: "SAR", name: "Saudi Riyal" },
    { code: "OMR", name: "Omani Rial" },
    { code: "TRY", name: "Turkish Lira" },
    { code: "GBP", name: "British Pound" },
    { code: "QAR", name: "Qatari Riyal" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "BDT", name: "Bangladeshi Taka" },
    { code: "HKD", name: "Hong Kong Dollar" },
    { code: "THB", name: "Thai Baht" },
    { code: "NZD", name: "New Zealand Dollar" }
  ];

  const handleCurrencyChange = (e) => {
    const selectedCurrency = e.target.value;
    setCurrency(selectedCurrency);
    onCurrencyChange(selectedCurrency);
    setIsOpen(false);
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserInfo(storedUser);
    }
  }, []);

  const userImage = userInfo?.image
    ? `${userInfo.image}`
    : `https://res.cloudinary.com/dzmjsrpdp/image/upload/v1732013415/default_profile_jlmahy.png`;

  const handleEditProfile = () => {
    if (userInfo.userId) {
      const userId = userInfo.userId;
      navigate(`/editprofile/${userId}`);
    } else {
      console.error("User ID is not defined");
    }
  };

  const handleMyOrders = () => {
    if (userInfo.email) {
      const userEmail = userInfo.email;
      navigate(`/orderdetails/${userEmail}`);
    } else {
      console.error("User email is not defined");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await api.get('/api/logout');
      localStorage.removeItem("user");
      setUserInfo(null);
      navigate("/");
    } catch (error) {
      console.log("Error logging out:", error);
      setError("Error during logout, Please try again.");
    }
  };

  // Fetch Categories
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

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

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
    <>
      {/* Top Announcement Bar */}
      <div className="w-full xs:h-6 md:h-8 xs:py-1 md:py-2 xs:text-xs md:text-[15px] text-center text-gray-200 bg-gray-950 font-titleFont group">
        <Marquee speed={90} pauseOnHover={true}>
          <p className="flex min-w-[100%] ">
            Shop Smarter Live Better. Enjoy free delivery in Pakistan &nbsp;
            {flagComponents.PKR}
          </p>
        </Marquee>
      </div>

      {/* Top Bar */}
      <div className="w-full bg-gray-100 text-gray-900 flex justify-between items-center px-2 md:px-8 py-1">
        {/* Left Section */}
        <div className="flex items-center space-x-3 pl-4 md:pl-7">
          {/* Currency Dropdown */}
          <div className="relative" ref={currencyRef} onClick={() => setIsOpen(!isOpen)}>
            <div className="flex items-center p-1 border rounded-md cursor-pointer hover:bg-gray-100">
              {flagComponents[currency]}
              <span className="hidden md:inline ml-1">{currency}</span>
              <RiArrowDropDownLine className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </div>
            {isOpen && (
              <div className="absolute top-full mt-0 bg-white shadow-md rounded-b-lg w-60 max-h-72 overflow-auto scrollbar-thin z-[80] border border-gray-100">
                {currencies.map((curr) => (
                  <div key={curr.code} className="flex items-center p-2 w-full border-b hover:bg-gray-100 cursor-pointer" onClick={() => handleCurrencyChange({ target: { value: curr.code } })}>
                    <div className="flex items-center justify-center w-10 h-8">
                      {flagComponents[curr.code]}
                    </div>
                    <span className="ml-2">{curr.code} - {curr.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col md:flex-row space-y-1 md:space-y-0 md:space-x-6 mr-4 md:mr-10">
          <div className="flex items-center">
            <SlEnvolope className="xs:text-sm md:text-lg text-gray-600" />
            <a href="mailto:info@buyvo.com" className="pl-2 xs:text-xs md:text-sm text-gray-700 hover:text-gray-900">
              info@buyvo.com
            </a>
          </div>
          <div className="flex items-center">
            <SlPhone className="xs:text-sm md:text-lg text-gray-600" />
            <a href="tel:+923093602377" className="pl-2 xs:text-xs md:text-sm text-gray-700 hover:text-gray-900">
              +92 309 3602377
            </a>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <div className="w-full h-[60px] md:h-[80px] bg-white/90 border-b border-gray-200 sticky top-0 z-50">
        <nav className="flex items-center justify-between px-4 md:px-12 py-3">

          {/* Logo */}
          <Link to="/">
            <img src={logo} alt="Logo" className="w-[60px] h-[50px] md:w-[85px] md:h-[55px]" />
          </Link>

          {/* Navigation Links */}
          <motion.ul
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="hidden md:flex space-x-6 uppercase text-gray-800 font-light"
          >
            <li>
              <div className="relative group"
                onClick={(e) => e.stopPropagation()} // Prevent closing dropdown when clicking inside
              >
                {/* Parent Link */}
                <Link to="/products" className="relative text-gray-800 text-xl font-heading group-hover:text-gray-600 cursor-pointer uppercase">
                  Men
                  {/* <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#7b246d] transition-all duration-300 group-hover:w-[75%]"></span> */}
                </Link>

                {/* Dropdown Container */}
                <div className="absolute left-0 mt-3 bg-white shadow-lg border border-gray-200 rounded-lg hidden group-hover:block w-[180px] p-6 z-50">
                  <div className="grid grid-cols-1 gap-6">
                    {/* Column 1: Topwear */}
                    {/* <div>
                      <h4 className="font-semibold text-gray-800 mb-2">TOPWEAR</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>Vest</li>
                        <li>Shirts</li>
                        <li>T-Shirts</li>
                        <li>Hoodies</li>
                        <li>Sweatshirts</li>
                        <li>Traditional</li>
                        <li>Sleep & Lounge</li>
                      </ul>
                    </div> */}

                    {/* Column 2: Bottomwear */}
                    {/* <div>
                      <h4 className="font-semibold text-gray-800 mb-2">BOTTOMWEAR</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>Boxers</li>
                        <li>Shorts</li>
                        <li>Jeans</li>
                        <li>Pants</li>
                        <li>Trousers</li>
                      </ul>
                    </div> */}

                    {/* Column 3: Footwear */}
                    <div>
                      <h1 className="font-semibold text-gray-800 mb-2">FOOTWEAR</h1>
                      <ul className="space-y-2 text-gray-600">
                        <li>Casual Shoes</li>
                        <li>Boots</li>
                        <li>Sports Shoes</li>
                        <li>Formal Shoes</li>
                        <li>Sandals</li>
                        <li>Sneakers</li>
                        <li>Slippers</li>
                      </ul>
                    </div>

                    {/* Column 4: Accessories */}
                    {/* <div>
                      <h4 className="font-semibold text-gray-800 mb-2">ACCESSORIES</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>Wallets</li>
                        <li>Belts & Key Chains</li>
                        <li>Fragrances</li>
                        <li>Eyewear</li>
                        <li>Bags</li>
                        <li>Watches</li>
                      </ul>
                    </div> */}
                  </div>
                </div>
              </div>
            </li>

            <li>
              <div className="relative group">
                {/* Parent Link */}
                <Link to="/products" className="relative uppercase text-xl font-heading text-gray-800 group hover:text-gray-600">
                  Women
                </Link>

                {/* Dropdown Container */}
                <div className="absolute left-0 mt-3 bg-white shadow-lg border border-gray-200 rounded-lg hidden group-hover:block w-[180px] p-6 z-50">
                  <div className="grid grid-cols-1 gap-6">
                    {/* Column 1: Topwear */}
                    {/* <div>
                      <h4 className="font-semibold text-gray-800 mb-2">TOPWEAR</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>Vest</li>
                        <li>Shirts</li>
                        <li>T-Shirts</li>
                        <li>Hoodies</li>
                        <li>Sweatshirts</li>
                        <li>Traditional</li>
                        <li>Sleep & Lounge</li>
                      </ul>
                    </div> */}

                    {/* Column 2: Bottomwear */}
                    {/* <div>
                      <h4 className="font-semibold text-gray-800 mb-2">BOTTOMWEAR</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>Boxers</li>
                        <li>Shorts</li>
                        <li>Jeans</li>
                        <li>Pants</li>
                        <li>Trousers</li>
                      </ul>
                    </div> */}

                    {/* Column 3: Footwear */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">FOOTWEAR</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>Casual Shoes</li>
                        <li>Boots</li>
                        <li>Sports Shoes</li>
                        <li>Formal Shoes</li>
                        <li>Sandals</li>
                        <li>Sneakers</li>
                        <li>Slippers</li>
                      </ul>
                    </div>

                    {/* Column 4: Accessories */}
                    {/* <div>
                      <h4 className="font-semibold text-gray-800 mb-2">ACCESSORIES</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>Wallets</li>
                        <li>Belts & Key Chains</li>
                        <li>Fragrances</li>
                        <li>Eyewear</li>
                        <li>Bags</li>
                        <li>Watches</li>
                      </ul>
                    </div> */}
                  </div>
                </div>
              </div>
            </li>

            <li>
              <div className="relative"
                onMouseEnter={handleMouseEnter}
                onClick={handleDropdownToggle}
                ref={dropdownRef}
              >
                {/* Parent Link */}
                <span className="relative uppercase text-xl font-heading text-gray-800 group hover:text-gray-600">
                  Kids
                </span>

                {isDropdownOpen && (
                  <div className="absolute left-0 mt-3 bg-white shadow-lg rounded-md border border-gray-200 p-2 w-48 z-50">
                    <div className="overflow-hidden rounded-md">
                      {categories.length > 0 ? (
                        <ul className="space-y-2">
                          {categories.map((category) => (
                            <li key={category.id}>
                              <button
                                onClick={() => handleCategoryClick(category.id, category.name)}
                                className="w-full text-left font-heading px-2 py-2 text-gray-800 hover:bg-gray-300 hover:bg-opacity-20 rounded-md transition-colors duration-300"
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

                {/* {isDropdownOpen && (
                  <div className="absolute left-0 mt-3 bg-white shadow-lg border border-gray-200 rounded-lg z-50 p-6 w-[720px]">
                    <div className="grid grid-cols-4 gap-6">
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <div key={category.id}>
                            <h4 className="font-semibold text-gray-800 mb-2">{category.name}</h4>
                            <ul className="space-y-2 text-gray-600">
                              {Array.isArray(category.subcategories) && category.subcategories.length > 0 ? (
                                category.subcategories.map((subcategory) => (
                                  <li key={subcategory.id}>
                                    <button
                                      onClick={() => handleCategoryClick(subcategory.id, subcategory.name)}
                                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-[#7b246d] hover:bg-opacity-20 rounded-lg transition-colors duration-300"
                                    >
                                      {subcategory.name}
                                    </button>
                                  </li>
                                ))
                              ) : (
                                <li className="text-gray-500">No Subcategories</li>
                              )}
                            </ul>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-4 px-4 py-2 text-gray-700">No Categories</div>
                      )}
                    </div>
                  </div>
                )} */}

              </div>
            </li>

            <li>
              <ScrollLink
                to="small-banner"
                smooth={true}
                duration={500}
                offset={-50}
                onClick={() => handleNavigation('small-banner')}
                className="relative text-xl font-heading text-gray-800 group cursor-pointer uppercase"
              >
                Top Trending
              </ScrollLink>
            </li>

            <li>
              <ScrollLink
                to="new-arrivals"
                smooth={true}
                duration={500}
                offset={-50}
                onClick={() => handleNavigation('new-arrivals')}
                className="relative text-xl font-heading text-gray-800 group cursor-pointer uppercase"
              >
                New Arrivals
              </ScrollLink>
            </li>

            {/* <div className="relative"
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
            </div> */}
          </motion.ul>

          {/* Left Section: Currency, User, and Cart */}
          <div className="flex">
            {/* Search Section */}
            <div className="relative">
              {/* Search Toggle Button */}
              <button onClick={() => setSearchOpen(true)} className="p-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer text-gray-600 hover:text-gray-800">
                <HiSearch className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
              </button>

              {/* Full-Screen Search */}
              {searchOpen && (
                <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex flex-col z-50">
                  {/* <div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-sm flex flex-col z-50"> */}
                  <div className="relative flex items-center p-6 border-b border-gray-300">
                    <input
                      type="text"
                      placeholder="Search for products or categories..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="flex-grow h-12 px-4 text-gray-800 bg-gray-100 rounded-full focus:ring-2 focus:ring-gray-600 focus:outline-none"
                      autoFocus
                    />
                    <button className="absolute top-1/2 right-10 transform -translate-y-1/2 ml-4 text-xl text-gray-700 hover:text-gray-800" onClick={closeSearch}>
                      &#10005;
                    </button>
                  </div>

                  {/* Dropdown Results */}
                  {showDropdown && (searchResults.products?.length > 0 || searchResults.categories?.length > 0) && (
                    <div className="flex-grow overflow-auto p-4 backdrop-blur-sm">
                      {/* No Results Found */}
                      {searchResults.categories?.length === 0 && searchResults.products?.length === 0 && (
                        <p className="text-center text-gray-800">No results found.</p>
                      )}

                      {/* Categories */}
                      {searchResults.categories?.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">Categories</h3>
                          {searchResults.categories.map((category) => (
                            <div
                              key={category._id}
                              className="p-2 bg-gray-100 rounded-lg mb-2 hover:bg-gray-200 cursor-pointer"
                              onClick={() => handleCategoryClick(category.name)}
                            >
                              <p className="font-medium text-gray-800">{category.name}</p>
                              {/* <p className="text-sm text-gray-500">{category.description}</p> */}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Products */}
                      {searchResults.products?.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">Products</h3>
                          {searchResults.products.map((product) => (
                            <div
                              key={product._id}
                              className="flex items-center p-2 bg-gray-100 rounded-lg mb-2 hover:bg-gray-200 cursor-pointer"
                              onClick={() => handleProductClick(product.name)}
                            >
                              <img
                                src={product.images[0]?.imagePath || 'default-image.png'}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-full mr-3"
                              />
                              <div>
                                <p className="font-medium text-gray-800">{product.name}</p>
                                <p className="text-sm text-gray-600">
                                  {product.color || 'Color (N/A)'} - {product.size || 'Size (N/A)'}
                                </p>
                                <p className="text-xs text-gray-500">{product.shortDescription}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div className="relative">
              <div className="p-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setShowUser(!showUser)} ref={userRef}>
                {userInfo ? (
                  <img src={userImage} alt="User" className="w-5 h-5 md:w-6 md:h-6 rounded-full" />
                ) : (
                  <HiMiniUser className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
                )}
              </div>
              {/* User Dropdown Menu */}
              {showUser && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg"
                  onClick={(e) => e.stopPropagation()} // Prevent closing dropdown when clicking inside
                >
                  {userInfo ? (
                    <>
                      <div className="p-2 cursor-default">Hi, {userInfo.name}</div>
                      <div className="p-2 hover:bg-gray-100 cursor-pointer uppercase" onClick={handleEditProfile}>
                        Edit Profile
                      </div>
                      <div className="p-2 hover:bg-gray-100 cursor-pointer uppercase" onClick={handleLogout}>
                        Logout
                      </div>
                    </>
                  ) : (
                    <>
                      <Link to="/signin" className="block p-2 hover:bg-gray-100 uppercase" onClick={() => setShowUser(false)}>
                        Sign In
                      </Link>
                      <Link to="/signup" className="block p-2 hover:bg-gray-100 uppercase" onClick={() => setShowUser(false)}>
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 rounded-md hover:bg-gray-100 transition-colors">
              <HiMiniShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
              <span className="absolute -top-1 -right-1 bg-gray-800 text-white text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                {products.length > 0 ? products.length : 0}
              </span>
            </Link>

            {/* Mobile Screen - Sidebar Toggle */}
            <button
              className="block md:hidden p-2 text-gray-600 hover:text-gray-800"
              onClick={() => setSidenav(!sidenav)}
            >
              <HiMiniBars3BottomRight className="w-6 h-6" />
            </button>
            <MobileSidebar
              sidenav={sidenav}
              setSidenav={setSidenav}
              handleSearch={(e) => setSearchQuery(e.target.value)}
              searchQuery={searchQuery}
              logo={logo}
              userInfo={userInfo}
              userImage={userImage}
              handleEditProfile={handleEditProfile}
              handleMyOrders={handleMyOrders}
              handleLogout={handleLogout}
            />
          </div>

        </nav>
      </div>
    </>
  );
};

export default Navbar;
