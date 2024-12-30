import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsStaggered } from '@fortawesome/free-solid-svg-icons';
import api from '../../../api/api.js';
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../redux/reduxSlice";
import Loader from "../../../components/Loader/Loader";

function Navbar({ toggleSidebar }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => { setIsDropdownOpen(!isDropdownOpen); };
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [userImage, setUserImage] = useState('');
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.reduxReducer.loading);
  const [error, setError] = useState(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    // Show loader when the API call starts
    dispatch(setLoading(true));
    api.get('/api/signin')
      .then(res => {
        if (res.data.Status === "Success") {
          setUserId(res.data.id);
          setName(res.data.name);
          const userImage = res.data.image 
            ? `${res.data.image}`
            : `https://res.cloudinary.com/dzmjsrpdp/image/upload/v1732013415/default_profile_jlmahy.png`;   
          setUserImage(userImage);
          setRole(res.data.role);
          setEmail(res.data.email);
        } else {
          navigate('/');
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        // Hide loader once the API call is finished
        dispatch(setLoading(false));
      });
  }, [navigate, dispatch]);

  const handleEditProfile = () => {
    if (userId) {
      navigate(`/dashboard/user_profile/${userId}`);
    } else {
      console.error("User ID is not defined");
    }
  };

  const logout = () => {
    api.get('/api/logout')
      .then(res => {
        navigate('/');
      })
      .catch(err => console.log(err));
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-1 mx-6 my-3 shadow-lg rounded-lg bg-transparent bg-white">
      {loading && <Loader />}
      <div className="flex justify-between w-full items-center mx-auto">
        {/* Left: Sidebar toggle */}
        <button onClick={toggleSidebar} className="text-base lg:text-lg xl:text-lg text-gray-800 hover:text-slate-500">
          <FontAwesomeIcon icon={faBarsStaggered} />
        </button>

        {/* Center: Dashboard text */}
        <h1 className="flex-grow text-center text-base lg:text-xl xl:text-xl text-gray-800 font-medium font-titleFont uppercase">
          <Link to='/dashboard/home'>Buyvo - Admin Dashboard</Link>
        </h1>

        {/* Right: User Dropdown */}
        <div className="flex items-center">
          <div className="relative" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="py-1" >
              <img src={userImage} alt="User profile" className="w-8 h-8 lg:w-10 lg:h-10 xl:w-10 xl:h-10 rounded-full object-cover" />
            </button>
            <div className={`${isDropdownOpen ? 'block' : 'hidden'} absolute right-0 mt-2 w-40 bg-white font-titleFont shadow-lg rounded-md z-10`} >
              <ul className="py-1">
                <li className="px-2 py-2 hover:bg-gray-100 border-b">
                  <p className='text-gray-800 cursor-pointer'>Hi, {name}!</p>
                </li>
                <li className="px-2 py-2 hover:bg-gray-100 border-b">
                  <button className='text-gray-800' onClick={handleEditProfile}>Edit Profile</button>
                </li>
                <li className="px-2 py-2 hover:bg-gray-100">
                  <button className='text-gray-800' onClick={logout}>Logout</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
