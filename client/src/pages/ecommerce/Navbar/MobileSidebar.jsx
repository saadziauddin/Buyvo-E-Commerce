import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { RxCross1 } from "react-icons/rx";
import { FaSearch, FaSignInAlt, FaUserPlus, FaWhatsapp, FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Link as ScrollLink } from 'react-scroll';
import api from "../../../api/api";

const MobileSidebar = ({ sidenav, setSidenav, logo, userInfo, userImage, handleEditProfile, handleMyOrders, handleLogout }) => {
    const [categories, setCategories] = useState([]);
    const [showOptions, setShowOptions] = useState(false);
    const [category, setCategory] = useState(false);
    const [openCategories, setOpenCategories] = useState({
        men: false,
        women: false,
        kids: false,
    });
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

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
        setSidenav(false);
        navigate(`/products?category=${categoryName}`);
    };

    const toggleCategory = (category) => {
        setOpenCategories((prev) => ({
            ...prev,
            [category]: !prev[category],
        }));
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

    const toggleDropdown = () => {
        setShowOptions((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            {sidenav && (
                <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-60 z-50" onClick={() => setSidenav(false)} >
                    <motion.div
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-[60%] h-screen relative bg-white shadow-xl rounded-r-3xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="h-full p-6 bg-gray-100 text-primeColor overflow-y-auto scrollbar-none">
                            {/* Close Icon */}
                            <span className="absolute top-8 right-4 w-10 h-10 text-2xl flex justify-center items-center cursor-pointer text-gray-700 hover:bg-gray-300 transition duration-300" onClick={() => setSidenav(false)}>
                                <RxCross1 />
                            </span>

                            {/* Logo */}
                            <div className="flex  mb-6">
                                <Link to='/'>
                                    <img className="w-24" src={logo} alt="Main Logo" />
                                </Link>
                            </div>

                            {/* User Profile Section */}
                            {userInfo && (
                                <div className="relative mb-6 z-50" ref={dropdownRef}>
                                    <div
                                        className="flex items-center gap-2 cursor-pointer"
                                        onClick={toggleDropdown}
                                    >
                                        <img
                                            src={userImage}
                                            alt="Profile Image"
                                            className="w-10 h-10 rounded-full border border-gray-300"
                                        />
                                        <span className="text-gray-700 font-heading">{userInfo.name}</span>
                                    </div>
                                    {showOptions && (
                                        <div className="absolute left-0 mt-2 w-full bg-white shadow-md rounded-lg p-2">
                                            <button
                                                onClick={handleEditProfile}
                                                className="w-full text-center p-2 font-heading rounded-lg text-gray-700 hover:bg-gray-100"
                                            >
                                                Edit Profile
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleMyOrders();
                                                    setSidenav(false);
                                                    setShowOptions(false);
                                                }}
                                                className="w-full text-center p-2 font-heading rounded-lg text-gray-700 hover:bg-gray-100"
                                            >
                                                My Orders
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-center p-2 font-heading rounded-lg text-gray-700 hover:bg-gray-100"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Navbar Menu */}
                            <ul className="flex flex-col gap-3 text-lg">
                                <li>
                                    <Link to="/" className="relative text-gray-700 hover:text-gray-600 font-heading cursor-pointer" onClick={() => setSidenav(false)}>
                                        Home
                                    </Link>
                                </li>

                                <li>
                                    <ScrollLink
                                        to="new-arrivals"
                                        smooth={true}
                                        duration={500}
                                        offset={-50}
                                        onClick={() => {
                                            handleNavigation('new-arrivals')
                                            setSidenav(false)
                                        }}
                                        className="relative text-gray-700 hover:text-gray-600 font-heading cursor-pointer"
                                    >
                                        New Arrivals
                                    </ScrollLink>
                                </li>

                                <li>
                                    <ScrollLink
                                        to="small-banner"
                                        smooth={true}
                                        duration={500}
                                        offset={-50}
                                        onClick={() => {
                                            handleNavigation('small-banner')
                                            setSidenav(false)
                                        }}
                                        className="relative text-gray-700 hover:text-gray-600 font-heading cursor-pointer"
                                    >
                                        Top Trending
                                    </ScrollLink>
                                </li>
                            </ul>

                            {/* Category - Men */}
                            <div className="mt-3">
                                <h1
                                    className="flex text-lg justify-between text-gray-700 hover:text-gray-600 cursor-pointer items-center font-heading mb-2"
                                    onClick={() => toggleCategory("men")}
                                >
                                    Men
                                    <span className="text-xl">{openCategories.men ? "-" : "+"}</span>
                                </h1>
                                {openCategories.men && (
                                    categories.length > 0 ? (
                                        <motion.ul
                                            initial={{ y: 15, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.4 }}
                                            className="text-sm flex flex-col gap-1"
                                        >
                                            {categories.map((category) => (
                                                <li
                                                    key={category.id}
                                                    className="relative block text-gray-600 hover:text-gray-600 font-titleFont text-[14px]"
                                                >
                                                    <button
                                                        onClick={() => {
                                                            handleCategoryClick(category.id, category.name);
                                                            setSidenav(false);
                                                        }}
                                                    >
                                                        {category.name}
                                                    </button>
                                                </li>
                                            ))}
                                        </motion.ul>
                                    ) : (
                                        <div className="px-4 py-2 text-gray-700">No Categories</div>
                                    )
                                )}
                            </div>

                            {/* Category - Women */}
                            <div className="mt-3">
                                <h1
                                    className="flex text-lg justify-between text-gray-700 hover:text-gray-600 cursor-pointer items-center font-heading mb-2"
                                    onClick={() => toggleCategory("women")}
                                >
                                    Women
                                    <span className="text-xl">{openCategories.women ? "-" : "+"}</span>
                                </h1>
                                {openCategories.women && (
                                    categories.length > 0 ? (
                                        <motion.ul
                                            initial={{ y: 15, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.4 }}
                                            className="text-sm flex flex-col gap-1"
                                        >
                                            {categories.map((category) => (
                                                <li
                                                    key={category.id}
                                                    className="relative text-gray-600 hover:text-gray-600 font-titleFont text-[14px]"
                                                >
                                                    <button
                                                        onClick={() => {
                                                            handleCategoryClick(category.id, category.name);
                                                            setSidenav(false);
                                                        }}
                                                    >
                                                        {category.name}
                                                    </button>
                                                </li>
                                            ))}
                                        </motion.ul>
                                    ) : (
                                        <div className="px-4 py-2 text-gray-700">No Categories</div>
                                    )
                                )}
                            </div>

                            {/* Category - Kids */}
                            <div className="mt-3">
                                <h1
                                    className="flex text-lg justify-between text-gray-600 hover:text-gray-600 cursor-pointer items-center font-heading mb-2"
                                    onClick={() => toggleCategory("kids")}
                                >
                                    Kids
                                    <span className="text-xl">{openCategories.kids ? "-" : "+"}</span>
                                </h1>
                                {openCategories.kids && (
                                    categories.length > 0 ? (
                                        <motion.ul
                                            initial={{ y: 15, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.4 }}
                                            className="text-sm flex flex-col gap-1"
                                        >
                                            {categories.map((category) => (
                                                <li
                                                    key={category.id}
                                                    className="relative block text-gray-700 hover:text-gray-600 font-titleFont text-[14px]"
                                                >
                                                    <button
                                                        onClick={() => {
                                                            handleCategoryClick(category.id, category.name);
                                                            setSidenav(false);
                                                        }}
                                                    >
                                                        {category.name}
                                                    </button>
                                                </li>
                                            ))}
                                        </motion.ul>
                                    ) : (
                                        <div className="px-4 py-2 text-gray-700">No Categories</div>
                                    )
                                )}
                            </div>

                            {/* All Products */}
                            <ul className="flex flex-col gap-3 text-lg mt-3">
                                <li>
                                    <Link
                                        to="/products"
                                        className="relative block text-gray-700 hover:text-gray-600 font-heading"
                                        onClick={() => setSidenav(false)}
                                    >
                                        All Products
                                    </Link>
                                </li>
                            </ul>

                            {/* SignIn and SignUp */}
                            {!userInfo ? (
                                <div className="mt-3 flex flex-col gap-4">
                                    <Link
                                        to="/signin"
                                        className="flex items-center text-gray-700 font-semibold font-heading hover:text-gray-600 transition duration-300"
                                        onClick={() => setSidenav(false)}
                                    >
                                        <FaSignInAlt className="mr-2" /> SignIn
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="flex items-center text-gray-700 font-semibold font-heading hover:text-gray-600 transition duration-300"
                                        onClick={() => setSidenav(false)}
                                    >
                                        <FaUserPlus className="mr-2" /> SignUp
                                    </Link>
                                </div>
                            ) : null}

                            {/* Social Media Icons */}
                            <div className="mt-6">
                                <ul className="flex items-center gap-3 justify-center md:gap-4">
                                    {/* WhatsApp */}
                                    <a href="https://wa.me/+923093602377" target="_blank" rel="noreferrer">
                                        <li className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 text-white cursor-pointer text-xl rounded-full flex justify-center items-center hover:shadow-lg hover:scale-105 transition-transform duration-300 md:w-10 md:h-10 md:text-2xl">
                                            <FaWhatsapp />
                                        </li>
                                    </a>
                                    {/* Facebook */}
                                    <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
                                        <li className="w-8 h-8 bg-blue-600 text-white cursor-pointer text-xl rounded-full flex justify-center items-center hover:bg-blue-700 hover:shadow-lg hover:scale-105 transition-transform duration-300 md:w-10 md:h-10 md:text-2xl">
                                            <FaFacebook />
                                        </li>
                                    </a>
                                    {/* Instagram */}
                                    <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
                                        <li className="w-8 h-8 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white cursor-pointer text-xl rounded-full flex justify-center items-center hover:shadow-lg hover:scale-105 transition-transform duration-300 md:w-10 md:h-10 md:text-2xl">
                                            <FaInstagram />
                                        </li>
                                    </a>
                                    {/* TikTok */}
                                    <a href="https://www.tiktok.com" target="_blank" rel="noreferrer">
                                        <li className="w-8 h-8 bg-gradient-to-r from-gray-800 to-gray-900 text-white cursor-pointer text-xl rounded-full flex justify-center items-center hover:shadow-lg hover:scale-105 transition-transform duration-300 md:w-10 md:h-10 md:text-2xl">
                                            <FaTiktok />
                                        </li>
                                    </a>
                                    {/* YouTube */}
                                    <a href="https://youtube.com" target="_blank" rel="noreferrer">
                                        <li className="w-8 h-8 bg-red-600 text-white cursor-pointer text-xl rounded-full flex justify-center items-center hover:bg-red-700 hover:shadow-lg hover:scale-105 transition-transform duration-300 md:w-10 md:h-10 md:text-2xl">
                                            <FaYoutube />
                                        </li>
                                    </a>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
};

export default MobileSidebar;
