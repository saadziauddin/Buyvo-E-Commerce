import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faPhone, faImage, faExclamationCircle, faAddressCard, faCity, faEarth } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../../api/api.js';
import LottieAnimation from "../../../animations/LottieAnimation.jsx";
import animationData from "../../../animations/SignUpAnimation2.json";
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../redux/reduxSlice";
import Loader from "../../../components/Loader/Loader";

function SignUp() {
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    password: '',
    confirmPassword: '',
    contactNo: '',
    userRole: '',
    profileImage: ''
  });
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [checked, setChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.reduxReducer.loading);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get('/api/roles');
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles in register form: " + error);
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleFileChange = (e) => {
    setValues({ ...values, profileImage: e.target.files[0] });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(setLoading(true));

    // Define a timeout for 3 minutes
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out, Please try again later.")), 1 * 60 * 1000)
    );

    const isValid = validate();

    if (!isValid) {
      dispatch(setLoading(false));
      return;
    }
  
    const formData = new FormData();
    for (let key in values) {
      formData.append(key, values[key]);
    }

    try {
      await Promise.race([
        api.post('/api/signup', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
        timeoutPromise,
      ]);
      toast.success("Registration successful!");
      setError(null);
      setValues({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        contactNo: '',
        address: '',
        city: '',
        country: '',
        postalCode: '',
        userRole: '',
        profileImage: ''
      });  
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(err.response.data.error);
      } else {
        console.log(err);
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const validate = () => {
    let errors = {};
    let isValid = true;
    if (!values.firstName || values.firstName.length < 3) {
      errors.firstName = "First name must be at least 3 characters";
      isValid = false;
    }
    if (!values.lastName) {
      isValid = false;
    }
    if (!values.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Invalid email";
      isValid = false;
    }
    if (!values.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (values.password.length < 8 || !/(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}/.test(values.password)) {
      errors.password = "Password must be at least 8 characters long and include at least one uppercase letter and one number";
      isValid = false;
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = "Confirm password is required";
      isValid = false;
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }
    if (!values.contactNo) {
      errors.contactNo = "Phone number is required";
      isValid = false;
    } else if (!/^\+92\d{3}\d{7}$/.test(values.contactNo)) {
      errors.contactNo = "Invalid phone number (Format: +92XXXXXXXXXX)";
      isValid = false;
    }
    if (!values.address) {
      errors.address = "Address is required";
      isValid = false;
    }
    if (!values.city) {
      errors.city = "City is required";
      isValid = false;
    }
    if (!values.country) {
      errors.country = "Country is required";
      isValid = false;
    }
    setErrors(errors);
    return isValid;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center lgl:flex-row mt-10">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {loading && <Loader />}

      <div className="w-full sm:w-[90%] md:w-[80%] lgl:w-[50%] px-6 lg:px-36 py-10 lgl:py-0 flex flex-col justify-center">
        <h1 className="font-titleFont font-medium text-2xl sm:text-3xl md:text-4xl mb-6 text-center">
          Create Your Account
        </h1>
        <form onSubmit={handleSubmit} className="max-w-[500px] mx-auto">

          {/* First Name */}
          <div className="relative mb-3">
            <label className="text-gray-600 ml-2 mb-1 font-titleFont font-medium">First Name*</label>
            <div className="relative">
              <FontAwesomeIcon icon={faUser} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                className="w-full lg:w-3/4 xl:w-3/4 md:w-3/4 rounded-xl pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:border-primeColor"
                placeholder="Enter your first name"
              />
            </div>
            {errors.firstName && <p className="text-red-500 text-sm mt-1"><FontAwesomeIcon icon={faExclamationCircle} /> {errors.firstName}</p>}
          </div>

          {/* Last Name */}
          <div className="relative mb-3">
            <label className="text-gray-600 ml-2 mb-1 font-titleFont font-medium">Last Name*</label>
            <div className="relative">
              <FontAwesomeIcon icon={faUser} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                className="w-full lg:w-3/4 xl:w-3/4 md:w-3/4 rounded-xl pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:border-primeColor"
                placeholder="Enter your last name"
              />
            </div>
            {errors.lastName && <p className="text-red-500 text-sm mt-1"><FontAwesomeIcon icon={faExclamationCircle} /> {errors.lastName}</p>}
          </div>

          {/* Email */}
          <div className="relative mb-3">
            <label className="text-gray-600 ml-2 mb-1 font-titleFont font-medium">Email*</label>
            <div className="relative">
              <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                className="w-full lg:w-3/4 xl:w-3/4 md:w-3/4 rounded-xl pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:border-primeColor"
                placeholder="Enter your email"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1"><FontAwesomeIcon icon={faExclamationCircle} /> {errors.email}</p>}
          </div>

          {/* Phone Number */}
          <div className="relative mb-3">
            <label className="text-gray-600 ml-2 mb-1 font-titleFont font-medium">Phone Number*</label>
            <div className="relative">
              <FontAwesomeIcon icon={faPhone} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="tel"
                name="contactNo"
                value={values.contactNo}
                onChange={handleChange}
                className="pl-10 pr-3 py-2 border border-gray-300 w-full lg:w-3/4 xl:w-3/4 md:w-3/4 rounded-xl  focus:outline-none focus:border-primeColor"
                placeholder="+92XXXXXXXXXXX"
              />
            </div>
            {errors.contactNo && <p className="text-red-500 text-sm mt-1"><FontAwesomeIcon icon={faExclamationCircle} /> {errors.contactNo}</p>}
          </div>

          {/* Address */}
          <div className="relative mb-3">
            <label className="text-gray-600 ml-2 mb-1 font-titleFont font-medium">Address*</label>
            <div className="relative">
              <FontAwesomeIcon icon={faAddressCard} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                name="address"
                value={values.address}
                onChange={handleChange}
                className="w-full lg:w-3/4 xl:w-3/4 md:w-3/4 rounded-xl pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:border-primeColor "
                placeholder="Enter your address"
              />
            </div>
            {errors.address && <p className="text-red-500 text-sm mt-1"><FontAwesomeIcon icon={faExclamationCircle} /> {errors.address}</p>}
          </div>

          {/* City */}
          <div className="relative mb-3">
            <label className="text-gray-600 ml-2 mb-1 font-titleFont font-medium">City*</label>
            <div className="relative">
              <FontAwesomeIcon icon={faCity} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                name="city"
                value={values.city}
                onChange={handleChange}
                className="w-full lg:w-3/4 xl:w-3/4 md:w-3/4 rounded-xl pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:border-primeColor "
                placeholder="Enter your city"
              />
            </div>
            {errors.city && <p className="text-red-500 text-sm mt-1"><FontAwesomeIcon icon={faExclamationCircle} /> {errors.city}</p>}
          </div>

          {/* Country */}
          <div className="relative mb-3">
            <label className="text-gray-600 ml-2 mb-1 font-titleFont font-medium">Country*</label>
            <div className="relative">
              <FontAwesomeIcon icon={faEarth} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                name="country"
                value={values.country}
                onChange={handleChange}
                className="w-full lg:w-3/4 xl:w-3/4 md:w-3/4 rounded-xl pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:border-primeColor "
                placeholder="Enter your country"
              />
            </div>
            {errors.country && <p className="text-red-500 text-sm mt-1"><FontAwesomeIcon icon={faExclamationCircle} /> {errors.country}</p>}
          </div>

          {/* Zip/Postal Code */}
          <div className="relative mb-3">
            <label className="text-gray-600 ml-2 mb-1 font-titleFont font-medium">Zip/Postal Code (Optional)</label>
            <div className="relative">
              <FontAwesomeIcon icon={faAddressCard} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                name="postalCode"
                value={values.postalCode}
                onChange={handleChange}
                className="w-full lg:w-3/4 xl:w-3/4 md:w-3/4 rounded-xl pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:border-primeColor "
                placeholder="Enter your Zip/Postal Code"
              />
            </div>
            {errors.postalCode && <p className="text-red-500 text-sm mt-1"><FontAwesomeIcon icon={faExclamationCircle} /> {errors.postalCode}</p>}
          </div>

          {/* Password */}
          <div className="relative mb-3">
            <label className="text-gray-600 ml-2 mb-1 font-titleFont font-medium">Password*</label>
            <div className="relative">
              <FontAwesomeIcon icon={faLock} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                onChange={handleChange}
                value={values.password}
                className="pl-10 pr-3 py-2 border border-gray-300 w-full lg:w-3/4 xl:w-3/4 md:w-3/4 rounded-xl  focus:outline-none focus:border-primeColor"
                type="password"
                name="password"
                placeholder="Enter password"
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1"><FontAwesomeIcon icon={faExclamationCircle} /> {errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="relative mb-3">
            <label className="text-gray-600 ml-2 mb-1 font-titleFont font-medium">Confirm Password*</label>
            <div className="relative">
              <FontAwesomeIcon icon={faLock} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                onChange={handleChange}
                value={values.confirmPassword}
                className="pl-10 pr-3 py-2 border border-gray-300 w-full lg:w-3/4 xl:w-3/4 md:w-3/4 rounded-xl  focus:outline-none focus:border-primeColor"
                type="password"
                name="confirmPassword"
                placeholder="Re-enter password"
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1"><FontAwesomeIcon icon={faExclamationCircle} /> {errors.confirmPassword}</p>}
          </div>

          {/* Profile Image */}
          <div className="relative mb-3">
            <label className="text-gray-600 ml-2 mb-1 font-titleFont font-medium">Profile Image (Optional)</label>
            <div className="relative">
              <FontAwesomeIcon icon={faImage} className="absolute left-3 top-3.5 text-gray-400" />
              <label className="w-full lg:w-3/4 xl:w-3/4 md:w-3/4 py-2 border border-gray-300 rounded-xl flex items-center bg-white cursor-pointer pl-10 pr-3 focus:outline-none focus:border-primeColor">
                <input
                  onChange={handleFileChange}
                  type="file"
                  id="profileImage"
                  name="profileImage"
                  className="hidden"
                />
                <span className="text-gray-500">{values.profileImage ? values.profileImage.name : 'Select Profile Image'}</span>
              </label>
            </div>
            {errors.profileImage && (
              <p className="text-red-500 text-sm mt-1">
                <FontAwesomeIcon icon={faExclamationCircle} /> {errors.profileImage}
              </p>
            )}
          </div>

          {/* Checkbox */}
          <div className="flex flex-col sm:flex-row items-start gap-2 relative mb-3">
            <input
              onChange={() => setChecked(!checked)}
              className="w-2 h-2 sm:w-4 sm:h-4 mt-1 text-md cursor-pointer rounded-3xl"
              type="checkbox"
            />
            <p className="text-sm text-primeColor text-wrap">
              I agree to the Nayab Fashion{" "}
              <a onClick={() => setIsModalOpen(true)} className="text-blue-800 hover:text-blue-500 cursor-pointer">
                <Link to='/signup/privacy-policy'>Terms of Service and Privacy Policy.</Link>
              </a>
            </p>
          </div>

          {/* Modal Component */}
          {/* <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Terms of Service & Privacy Policy">
              <PrivacyPolicy />
          </Modal> */}

          <button
            onClick={handleSubmit}
            className={`${checked ? "bg-[#7b246d] hover:bg-[#5b184d]" : "bg-gray-300"
              } w-full lg:w-3/4 xl:w-3/4 md:w-3/4 px-6 py-2 text-white rounded-md transition-all`}
            disabled={!checked}
          >
            Create Account
          </button>

          <p className="text-gray-600 text-sm text-center w-3/4 mt-5">
            Already have an account?{" "}
            <Link to="/signin" className="text-primeColor font-medium hover:text-blue-600 duration-300">
              Sign in
            </Link>
          </p>
        </form>
      </div>

      <div className="hidden lgl:block w-0 lgl:w-[50%] h-full  items-center justify-center mb-[25%]">
        <LottieAnimation animationData={animationData} loop={true} autoplay={true} />
      </div>
    </div>
  );
}

export default SignUp;
