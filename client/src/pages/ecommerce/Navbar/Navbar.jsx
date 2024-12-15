import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { SlEnvolope, SlPhone } from "react-icons/sl";
import { HiOutlineBars3BottomLeft } from "react-icons/hi2";
import { GoSearch } from "react-icons/go";
import { CiUser } from "react-icons/ci";
import { PiShoppingCartThin } from "react-icons/pi";
import { PK, US, GB, TR, OM, AE, SA, QA, CA, EU, AU, BD, HK, TH, NZ } from 'country-flag-icons/react/3x2';
import { RiArrowDropDownLine } from "react-icons/ri";
import logo from "/Images/NayabLogo.png";
import api from "../../../api/api";
import MobileSidebar from "./MobileSidebar";
import { toast } from 'react-toastify';
import { FaSleigh } from "react-icons/fa";

const Navbar = ({ onCurrencyChange }) => {
  const [currency, setCurrency] = useState('PKR');
  const [sidenav, setSidenav] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const products = useSelector((state) => state.reduxReducer.products);

  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [showDesktopDropdown, setShowDesktopDropdown] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);

  const currencyRef = useRef(null);
  const userRef = useRef(null);
  const desktopSearchDropdownRef = useRef(null);
  const isMobileSearchOpenRef = useRef(null);
  const mobileSearchDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (currencyRef.current && !currencyRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShowUser(false);
      }
      if (desktopSearchDropdownRef.current && !desktopSearchDropdownRef.current.contains(event.target)) {
        setShowDesktopDropdown(false);
      }
      if (isMobileSearchOpenRef.current && !isMobileSearchOpenRef.current.contains(event.target)) {
        setIsMobileSearchOpen(false);
      }
      if (mobileSearchDropdownRef.current && !mobileSearchDropdownRef.current.contains(event.target)) {
        setShowMobileDropdown(false);
      }
    };
    document.body.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [currencyRef, userRef, desktopSearchDropdownRef, isMobileSearchOpenRef, mobileSearchDropdownRef]);

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
    setShowDesktopDropdown(false);
    navigate(`/products?category=${categoryName}`);
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

  return (
    <>
      {/* Top Announcement Bars */}
      <div className="w-full xs:h-6 md:h-8 xs:text-xs md:text-[15px] font-titleFont bg-gray-800 text-gray-200 text-center xs:py-1 md:py-2  overflow-hidden">
        {/* <p className="flex min-w-[100%] animate-marquee group-hover:pause-marquee whitespace-nowrap group-hover:animate-none group-hover:justify-center cursor-pointer"> */}
        <p className="flex min-w-[100%] whitespace-nowrap justify-center">
          Nayab Fashion is Pakistan's No.1 TRUSTED Women's Clothing Store.
        </p>
      </div>

      <div className="w-full xs:h-6 md:h-8 xs:text-xs md:text-[15px] font-titleFont bg-[#711b63] text-gray-200 text-center xs:py-1 md:py-2  overflow-hidden group">
        <p className="flex min-w-[100%] animate-marquee group-hover:pause-marquee whitespace-nowrap group-hover:animate-none group-hover:justify-center cursor-pointer">
          Welcome to your dream closet🌸 Enjoy free delivery in Pakistan&nbsp;{flagComponents.PKR}
          {/* 🎉 50% OFF SALE on selected items!&nbsp; 
          <span className="cursor-pointer animate-blink font-bold group-hover:animate-none">
            <Link to="/products" className="group-hover:text-white">Shop now!</Link>
          </span> */}
        </p>
      </div>

      {/* Email & Phone */}
      <div className="w-full h-[35px] bg-gray-200 text-gray-900 py-1 md:px-12 flex justify-between items-center overflow-hidden">
        <div className="flex items-center space-x-2 ml-4 md:ml-10">
          <SlEnvolope className="xs:text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg text-gray-600" />
          <a href="mailto:info@nayabfashion.com.pk" target="_blank" className="xs:text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm text-gray-700">
            info@nayabfashion.com.pk
          </a>
        </div>

        <div className="flex flex-col md:flex-row space-y-1 md:space-y-0 md:space-x-6 mr-4 md:mr-10">
          <div className="flex items-center">
            <SlPhone className="xs:text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg text-gray-600" />
            <a href="tel:+923100122349" className="pl-2 xs:text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm text-gray-700 hover:text-gray-900">
              +92-310-0122349
            </a>
          </div>
          {/* <div className="flex items-center">
            <SlPhone className="xs:text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg text-gray-600" />
            <a href="tel:+923100122349" className="pl-2 xs:text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm text-gray-700 hover:text-gray-900">
              +92-310-0122349
            </a>
          </div> */}
        </div>
      </div>

      {/* Navbar */}
      <div className="w-full h-[70px] bg-white sticky top-0 z-[80] border-b border-b-gray-200">
        <nav className="relative flex justify-between items-center h-full px-4 max-w-container mx-auto">
          {/* Left Section */}
          <div className="flex items-center flex-grow">
            <div className="hidden md:flex relative w-full">
              <GoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600" />
              <input
                type="text"
                onChange={handleDesktopSearchChange}
                value={searchQuery}
                className="h-8 pl-12 pr-4 border-b border-gray-300 outline-none text-gray-800 placeholder-gray-500 placeholder:text-sm focus:ring-0 focus:border-gray-500 transition-all"
                placeholder="Search products, categories..."
              />

              {showDesktopDropdown && (searchResults.products?.length > 0 || searchResults.categories?.length > 0) && (
                <div className="absolute left-0 right-0 mt-10 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-72 max-w-md overflow-auto" ref={desktopSearchDropdownRef}>
                  {/* Display Categories */}
                  {searchResults.categories?.length > 0 && (
                    <>
                      <h3 className="px-4 py-2 text-gray-700 font-heading font-semibold uppercase">Categories</h3>
                      {searchResults.categories.map((category) => {

                        const categoryImage = category.imagePath
                          ? `${category.imagePath}`
                          : `https://res.cloudinary.com/dzmjsrpdp/image/upload/v1732013415/image_not_available_pjpz1f.png`;

                        return (
                          <div key={category._id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleCategoryClick(category.name)}>
                            {/* <img src={categoryImage} alt={category.name} className="w-12 h-12 object-cover" /> */}
                            <p className="text-gray-800 font-heading font-medium">{category.name}</p>
                            <p className="text-sm font-heading text-gray-500">{category.description || null}</p>
                          </div>
                        );
                      })}
                    </>
                  )}

                  {/* Display Products */}
                  {searchResults.products?.length > 0 && (
                    <>
                      <h3 className="px-4 py-2 text-gray-700 font-heading font-semibold uppercase">Products</h3>
                      {searchResults.products.map((product, index) => {

                        const firstImage = product.images?.[0]?.imagePath
                          ? `${product.images[0].imagePath}`
                          : `https://res.cloudinary.com/dzmjsrpdp/image/upload/v1732013415/image-not-available_jrcuh6.png`;

                        const color = product.color || 'Color (N/A)';
                        const size = product.size || 'Size (N/A)';

                        return (
                          <div key={product._id} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleProductClick(product.name)}>
                            <img src={firstImage} alt={product.name} className="w-28 h-20 object-cover mr-3 rounded" />
                            <div>
                              <p className="text-gray-800 font-heading font-medium">{product.name}</p>
                              <p className="text-gray-600 font-heading text-sm">{color} - {size}</p>
                              <p className="text-gray-500 font-heading text-xs">{product.shortDescription}</p>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Sidebar */}
            <HiOutlineBars3BottomLeft
              className="block md:hidden h-7 w-8 text-gray-700"
              onClick={() => setSidenav(!sidenav)}
            />
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

            {/* Mobile Seacrh Icon */}
            <GoSearch
              className="block md:hidden h-5 w-8 text-gray-700"
              // onClick={() => setSidenav(!sidenav)} 
              onClick={() => setIsMobileSearchOpen(true)}
            />
          </div>

          {/* Center Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link to="/">
              <img src={logo} alt="Nayab Logo" className="w-[150px] h-[50px]" />
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex flex-grow relative gap-1 items-center justify-end">
            {/* Currency Dropdown */}
            <div className="relative" onClick={() => { setIsOpen(!isOpen); }} ref={currencyRef}>
              <div className="flex items-center p-1 border rounded-md cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                {flagComponents[currency]}
                <span className="hidden md:inline">{currency}</span>
                <RiArrowDropDownLine className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
              </div>
              {isOpen && (
                <div className="absolute top-full right-0 mt-1 w-60 bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-y-auto  md:scrollbar-none">
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

            {/* User Dropdown */}
            <div className="relative hidden md:block cursor-pointer" onClick={() => { setShowUser(!showUser); }} ref={userRef}>
              <div className="flex items-center cursor-pointer p-1 rounded-md hover:bg-gray-100 transition-colors duration-200">
                {userInfo ? (
                  <img src={userImage} alt="User Profile" className="w-6 h-6 rounded-full" />
                ) : (
                  <CiUser className="w-6 h-6 text-gray-700" />
                )}
              </div>
              {showUser && (
                <div className="absolute top-full right-0 mt-3 w-40 bg-white border border-gray-300 rounded-md shadow-lg">
                  {userInfo ? (
                    <>
                      <div className="flex text-center font-titleFont px-3 py-2 w-full border-b cursor-text">
                        <span className="ml-2">Hi, {userInfo.name}</span>
                      </div>
                      <div className="flex justify-center items-center font-titleFont px-3 py-2 w-full border-b hover:bg-gray-100 cursor-pointer" onClick={handleEditProfile}>
                        <span className="ml-2">Edit Profile</span>
                      </div>
                      <div className="flex justify-center items-center font-titleFont px-3 py-2 w-full border-b hover:bg-gray-100 cursor-pointer" onClick={handleMyOrders}>
                        <span className="ml-2">My Orders</span>
                      </div>
                      <div className="flex justify-center items-center font-titleFont px-3 py-2 w-full hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                        <span className="ml-2">Logout</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link to="/signin">
                        <div className="flex justify-center items-center font-titleFont px-3 py-2 w-full border-b hover:bg-gray-100 cursor-pointer">
                          <span className="ml-2">Sign In</span>
                        </div>
                      </Link>
                      <Link to="/signup">
                        <div className="flex justify-center items-center font-titleFont px-3 py-2 w-full hover:bg-gray-100 cursor-pointer">
                          <span className="ml-2">Sign Up</span>
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative flex items-center p-1 rounded-md hover:bg-gray-100 transition-colors duration-200">
              <PiShoppingCartThin className="w-6 h-6 text-gray-700" />
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#7b246d] text-white text-xs flex items-center justify-center rounded-full shadow-md">
                {products.length > 0 ? products.length : 0}
              </span>
            </Link>
          </div>
        </nav>

        {/* Mobile Search */}
        {isMobileSearchOpen && (
          <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" ref={isMobileSearchOpenRef}>
              <div className="bg-white w-[85%] p-4 rounded-full shadow-2xl relative flex items-center transition-transform duration-300 ease-in-out transform scale-100">
                <GoSearch className="text-gray-500 ml-4" size={20} />
                <input
                  type="text"
                  onChange={handleMobileSearchChange}
                  value={searchQuery}
                  className="w-full ml-2 pl-2 pr-4 py-2 bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 placeholder:text-sm focus:ring-0 transition-all"
                  placeholder="Search for products, categories..."
                />
                <button
                  className="text-gray-500 hover:text-gray-700 transition duration-200 mr-4"
                  onClick={() => setIsMobileSearchOpen(false)}
                >
                  ✕
                </button>
              </div>


              {/* Search results dropdown */}
              {showMobileDropdown && (searchResults.products?.length > 0 || searchResults.categories?.length > 0) && (
                <div className="fixed top-[50%] left-1/2 transform -translate-x-1/2 mt-4 w-[80%] bg-white shadow-lg rounded-lg p-4 max-h-[300px] overflow-y-auto z-50">
                  {searchResults.categories?.length > 0 && (
                    <>
                      <h3 className="text-gray-700 mt-4 font-heading font-semibold uppercase">Categories</h3>
                      {searchResults.categories.map((category, index) => {

                        const categoryImage = category.imagePath
                          ? `${category.imagePath}`
                          : `https://res.cloudinary.com/dzmjsrpdp/image/upload/v1732013415/image_not_available_pjpz1f.png`;

                        return (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-2 mb-1 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              handleCategoryClick(category.name);
                              setIsMobileSearchOpen(false);
                            }}
                          >
                            {/* <img src={categoryImage} alt={category.name} className="w-12 h-12 object-cover" /> */}
                            <h4 className="font-medium text-gray-800">{category.name}</h4>
                            <p className="text-sm text-gray-500">{category.description}</p>
                          </div>
                        );
                      })}
                    </>
                  )}

                  {searchResults.products?.length > 0 && (
                    <>
                      <h3 className="font-heading font-semibold text-gray-700 uppercase">Products</h3>
                      {searchResults.products.map((product, index) => {

                        const firstImage = product.images?.[0]?.imagePath
                          ? `${product.images[0].imagePath}`
                          : `https://res.cloudinary.com/dzmjsrpdp/image/upload/v1732013415/image-not-available_jrcuh6.png`;

                        const color = product.color || 'N/A';
                        const size = product.size || 'N/A';

                        return (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              handleProductClick(product.name);
                              setIsMobileSearchOpen(false);
                            }}
                          >
                            <img src={firstImage} alt={product.name} className="w-12 h-12 object-cover" />
                            <div>
                              <h4 className="font-medium font-heading text-gray-800">{product.name}</h4>
                              <p className="text-sm font-[450px] font-heading text-gray-600">Color: {color}, Size: {size}</p>
                              <p className="text-xs font-titleFont text-gray-500">{product.shortDescription}</p>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;
