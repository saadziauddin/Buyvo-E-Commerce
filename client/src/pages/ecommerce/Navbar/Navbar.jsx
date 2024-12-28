import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { SlEnvolope, SlPhone } from "react-icons/sl";
import { HiOutlineSearch, HiSearch } from "react-icons/hi";
import { HiMiniBars3BottomRight, HiMiniShoppingBag, HiMiniUser, HiUser } from "react-icons/hi2";
import { CiUser } from "react-icons/ci";
import { PiShoppingCartThin } from "react-icons/pi";
import { PK, US, GB, TR, OM, AE, SA, QA, CA, EU, AU, BD, HK, TH, NZ } from 'country-flag-icons/react/3x2';
import { RiArrowDropDownLine } from "react-icons/ri";
import logo from "/Images/BuyvoLogo.png";
import api from "../../../api/api";
import { toast } from 'react-toastify';
import MobileSidebar from "./MobileSidebar";
import { FaSleigh } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { useDispatch, Provider } from "react-redux";
import { setLoading } from "../../../redux/reduxSlice";
import { CiSearch } from "react-icons/ci";

const Navbar = ({ onCurrencyChange }) => {
  const [currency, setCurrency] = useState('PKR');
  const [sidenav, setSidenav] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const products = useSelector((state) => state.reduxReducer.products);
  const [userInfo, setUserInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDesktopDropdown, setShowDesktopDropdown] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const currencyRef = useRef(null);
  // const userRef = useRef(null);
  // const desktopSearchDropdownRef = useRef(null);
  // const isMobileSearchOpenRef = useRef(null);
  // const mobileSearchDropdownRef = useRef(null);
  // const dropdownRef = useRef(null);
  // const searchRef = useRef(null);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (currencyRef.current && !currencyRef.current.contains(event.target)) {
  //       setIsOpen(false);
  //     }
  //     if (userRef.current && !userRef.current.contains(event.target)) {
  //       setShowUser(false);
  //     }
  //     if (desktopSearchDropdownRef.current && !desktopSearchDropdownRef.current.contains(event.target)) {
  //       setShowDesktopDropdown(false);
  //     }
  //     if (isMobileSearchOpenRef.current && !isMobileSearchOpenRef.current.contains(event.target)) {
  //       setIsMobileSearchOpen(false);
  //     }
  //     if (mobileSearchDropdownRef.current && !mobileSearchDropdownRef.current.contains(event.target)) {
  //       setShowMobileDropdown(false);
  //     }
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setIsDropdownOpen(false);
  //     }
  //     if (searchRef.current && !searchRef.current.contains(event.target)) {
  //       setSearchOpen(false);
  //     }
  //   };
  //   document.body.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [currencyRef, userRef, desktopSearchDropdownRef, isMobileSearchOpenRef, mobileSearchDropdownRef, dropdownRef, searchRef]);

  const currencyRef = useRef(null);
  const userRef = useRef(null);
  const desktopSearchDropdownRef = useRef(null);
  const isMobileSearchOpenRef = useRef(null);
  const mobileSearchDropdownRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const refs = {
    currency: currencyRef,
    user: userRef,
    desktopSearch: desktopSearchDropdownRef,
    mobileSearch: isMobileSearchOpenRef,
    mobileDropdown: mobileSearchDropdownRef,
    dropdown: dropdownRef,
    search: searchRef,
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
            case "desktopSearch":
              setShowDesktopDropdown(false);
              break;
            case "mobileSearch":
              setIsMobileSearchOpen(false);
              break;
            case "mobileDropdown":
              setShowMobileDropdown(false);
              break;
            case "dropdown":
              setIsDropdownOpen(false);
              break;
            case "search":
              setSearchOpen(false);
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
        setShowDesktopDropdown(true);
      } catch (error) {
        console.error('Error fetching search results', error);
        toast.error('Error fetching search results', error);
      }
    } else {
      setShowDesktopDropdown(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleDesktopSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowDesktopDropdown(true);
  };

  const handleMobileSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowMobileDropdown(true);
  };

  const handleCategoryClick = (categoryName) => {
    dispatch(setLoading(true));
    setIsDropdownOpen(false);
    setShowDesktopDropdown(false);
    navigate(`/products?category=${categoryName}`);
    setTimeout(() => {
      dispatch(setLoading(false));
    }, 2000);
  };

  const handleProductClick = (productName) => {
    setShowDesktopDropdown(false);
    navigate(`/products?name=${productName}`);
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

  // Navigation Links Part
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
    <div className="w-full">
      {/* Top Announcement Bar */}
      <div className="w-full xs:h-6 md:h-8 xs:text-xs md:text-[15px] font-titleFont bg-gray-950 text-gray-200 text-center xs:py-1 md:py-2 overflow-hidden group">
        <p className="flex min-w-[100%] animate-marquee group-hover:pause-marquee whitespace-nowrap group-hover:animate-none group-hover:justify-center cursor-pointer">
          Shop Smarter Live Better. Enjoy free delivery in Pakistan &nbsp;
          {flagComponents.PKR}
        </p>
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
              <div className="absolute top-full mt-0 bg-white shadow-md rounded-md w-52 max-h-60 overflow-auto scrollbar-none z-[80] border border-gray-100">
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
      <div className="w-full h-[60px] md:h-[80px] bg-white border-b border-gray-200 sticky top-0 z-50">
        <nav className="flex items-center justify-between px-4 md:px-12 py-3">
          {/* Logo */}
          <Link to="/">
            <img src={logo} alt="Logo" className="w-[60px] h-[40px] md:w-[90px] md:h-[55px]" />
          </Link>

          {/* Navigation Links */}
          <motion.ul
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="hidden md:flex space-x-6 uppercase text-gray-800 font-light"
          >
            <li>
              <div className="relative group">
                {/* Parent Link */}
                <Link to="/products" className="relative uppercase text-[16px] text-gray-800 font-thin group-hover:text-gray-600 cursor-pointer">
                  Men
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#7b246d] transition-all duration-300 group-hover:w-[75%]"></span>
                </Link>

                {/* Dropdown Container */}
                <div className="absolute left-0 mt-3 bg-white shadow-lg border border-gray-200 rounded-lg hidden group-hover:block w-[800px] p-6 z-50">
                  <div className="grid grid-cols-4 gap-6">
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
              <div className="relative group">
                {/* Parent Link */}
                <Link to="/products" className="relative uppercase text-[16px] text-gray-800 font-thin group hover:text-gray-600">
                  Women
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#7b246d] transition-all duration-300 group-hover:w-[75%]"></span>
                </Link>

                {/* Dropdown Container */}
                <div className="absolute left-0 mt-3 bg-white shadow-lg border border-gray-200 rounded-lg hidden group-hover:block w-[800px] p-6 z-50">
                  <div className="grid grid-cols-4 gap-6">
                    {/* Column 1: Topwear */}
                    <div>
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
                    </div>

                    {/* Column 2: Bottomwear */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">BOTTOMWEAR</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>Boxers</li>
                        <li>Shorts</li>
                        <li>Jeans</li>
                        <li>Pants</li>
                        <li>Trousers</li>
                      </ul>
                    </div>

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
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">ACCESSORIES</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>Wallets</li>
                        <li>Belts & Key Chains</li>
                        <li>Fragrances</li>
                        <li>Eyewear</li>
                        <li>Bags</li>
                        <li>Watches</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            <li>
              <div className="relative group">
                {/* Parent Link */}
                <Link to="/products" className="relative uppercase text-[16px] text-gray-800 font-thin group hover:text-gray-600">
                  Kids
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#7b246d] transition-all duration-300 group-hover:w-[75%]"></span>
                </Link>

                {/* Dropdown Container */}
                <div className="absolute left-0 mt-3 bg-white shadow-lg border border-gray-200 rounded-lg hidden group-hover:block w-[800px] p-6 z-50">
                  <div className="grid grid-cols-4 gap-6">
                    {/* Column 1: Topwear */}
                    <div>
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
                    </div>

                    {/* Column 2: Bottomwear */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">BOTTOMWEAR</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>Boxers</li>
                        <li>Shorts</li>
                        <li>Jeans</li>
                        <li>Pants</li>
                        <li>Trousers</li>
                      </ul>
                    </div>

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
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">ACCESSORIES</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>Wallets</li>
                        <li>Belts & Key Chains</li>
                        <li>Fragrances</li>
                        <li>Eyewear</li>
                        <li>Bags</li>
                        <li>Watches</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            <li>
              <ScrollLink
                to="small-banner"
                smooth={true}
                duration={500}
                offset={-50}
                onClick={() => handleNavigation('small-banner')}
                className="relative uppercase text-[16px] text-gray-800 font-thin group cursor-pointer"
              >
                Top Trending
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#7b246d] transition-all duration-300 group-hover:w-[75%]"></span>
              </ScrollLink>
            </li>

            <li>
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
            </li>
          </motion.ul>

          {/* Left Section: Currency, User, and Cart */}
          <div className="flex">
            {/* Search Section */}
            <div className="relative flex items-center w-full">
              {/* Search Toggle Button */}
              <button onClick={() => setSearchOpen(!searchOpen)} className="flex-shrink-0 text-gray-600 hover:text-gray-800 md:ml-4">
                <HiSearch className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
              </button>

              {/* Search Input */}
              {searchOpen && (
                <div className={`absolute top-full left-0 md:left-auto md:right-0 mt-2 p-4 w-full md:w-screen max-w-xs md:max-w-md lg:max-w-lg bg-gray-100 border border-gray-200 rounded-lg shadow-lg z-50 ${window.innerWidth < 768 ? "w-full" : "max-w-md"}`} ref={searchRef}>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products, categories..."
                      value={searchQuery}
                      onChange={(e) => {
                        handleDesktopSearchChange(e);
                        setShowDesktopDropdown(true);
                      }}
                      className="w-full h-10 pl-2 pr-10 border border-gray-300 rounded-full outline-none text-gray-800 bg-gray-100 focus:ring-2 focus:ring-gray-400 transition-all"
                    />
                    <button className="absolute top-1/2 transform -translate-y-1/2 right-4 text-gray-500 hover:text-gray-700"
                      onClick={() => {
                        setSearchOpen(false);
                        setShowDesktopDropdown(false);
                      }}
                    >
                      &#10005;
                    </button>
                  </div>
                </div>
              )}

              {/* Dropdown Results */}
              {showDesktopDropdown && (searchResults.products?.length > 0 || searchResults.categories?.length > 0) && (
                <div
                  className="absolute top-[calc(100%+0.5rem)] left-0 md:left-auto md:right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-72 max-w-md overflow-auto"
                  ref={desktopSearchDropdownRef}
                >
                  {/* Categories */}
                  {searchResults.categories?.length > 0 && (
                    <>
                      <h3 className="px-4 py-2 text-gray-700 font-semibold uppercase">Categories</h3>
                      {searchResults.categories.map((category) => (
                        <div
                          key={category._id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleCategoryClick(category.name)}
                        >
                          <p className="text-gray-800 font-medium">{category.name}</p>
                          <p className="text-sm text-gray-500">{category.description || null}</p>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Products */}
                  {searchResults.products?.length > 0 && (
                    <>
                      <h3 className="px-4 py-2 text-gray-700 font-semibold uppercase">Products</h3>
                      {searchResults.products.map((product) => (
                        <div
                          key={product._id}
                          className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleProductClick(product.name)}
                        >
                          <img
                            src={product.images?.[0]?.imagePath || 'default-image.png'}
                            alt={product.name}
                            className="w-20 h-16 object-cover rounded mr-3"
                          />
                          <div>
                            <p className="text-gray-800 font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600">
                              {product.color || 'Color (N/A)'} - {product.size || 'Size (N/A)'}
                            </p>
                            <p className="text-xs text-gray-500">{product.shortDescription}</p>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div className="relative">
              <div
                className="p-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => setShowUser(!showUser)}
                ref={userRef}
              >
                {userInfo ? (
                  <img src={userImage} alt="User" className="w-5 h-5 md:w-6 md:h-6 rounded-full" />
                ) : (
                  <HiMiniUser className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
                )}
              </div>
              {/* User Dropdown Menu */}
              {showUser && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg">
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
                      <Link to="/signin" className="block p-2 hover:bg-gray-100 uppercase">Sign In</Link>
                      <Link to="/signup" className="block p-2 hover:bg-gray-100 uppercase">Sign Up</Link>
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
    </div>
  );
};

export default Navbar;
