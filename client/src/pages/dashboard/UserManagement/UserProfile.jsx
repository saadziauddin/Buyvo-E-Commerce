import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Topbar from '../Constants/Topbar.jsx';
import Sidebar from '../Constants/Sidebar.jsx';
import api from '../../../api/api.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../redux/reduxSlice";
import Loader from "../../../components/Loader/Loader";

function UserProfile() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const { userId } = useParams();
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNo: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: '',
    profileImage: ''
  });
  const [roles, setRoles] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.reduxReducer.loading);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoggedUser = async () => {
      dispatch(setLoading(true));

      // Define a timeout for 3 minutes
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out, Please try again later.")), 1 * 60 * 1000)
      );

      try {
        const result = await Promise.race([
          api.get('/api/signin'),
          timeoutPromise,
        ]);

        if (result.data.Status === "Success") {
          setUserRole(result.data.role);
          setError(null);
        }
      } catch (error) {
        console.log("Error fetching logged-in user data: ", error.message || error);
        setError("Error fetching logged-in user data, Please try again later.");
        navigate('/signin');
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchLoggedUser();
  }, [navigate, dispatch]);

  useEffect(() => {
    const fetchUserData = async () => {
      dispatch(setLoading(true));

      // Define a timeout for 3 minutes
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out, Please try again later.")), 1 * 60 * 1000)
      );

      try {
        const response = await Promise.race([
          api.get(`/api/getUserById/${userId}`),
          timeoutPromise,
        ]);
        const userData = response.data[0];
        setValues({
          ...userData,
          password: '',
          confirmPassword: '',
          fullName: `${userData.firstName} ${userData.lastName}`
        });
        setError(null);

        const fetchRolesResponse = await Promise.race([
          api.get('/api/roles'),
          timeoutPromise,
        ]);
        setAllRoles(fetchRolesResponse.data);
        setRoles(filterRoles(userData.role, fetchRolesResponse.data));
        setError(null);
      } catch (error) {
        console.log("Error fetching user data: ", error.message || error);
        setError("Error fetching logged-in user data, Please try again later.");
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUserData();
  }, [userId, dispatch]);

  const filterRoles = (currentRole, allRoles) => {
    return currentRole === 'Admin'
      ? allRoles.filter(role => role.RoleName !== 'Admin')
      : allRoles.filter(role => role.RoleName !== 'User');
  };

  const handleEdit = () => setEditing(true);

  const goBack = () => {
    if (userRole === 'Admin') {
      navigate('/dashboard/user_management');
    } else if (userRole === 'SubAdmin') {
      navigate('/dashboard/user_management');
    } else if (userRole === 'Client') {
      navigate('/welcome');
    } else {
      navigate('/');
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });

    if (name === 'role') {
      setRoles(filterRoles(value, allRoles));
    }
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleRemoveImage = async (index) => {
    if (window.confirm('Are you sure you want to remove your profile image?')) {

      dispatch(setLoading(true));

      // Define a timeout for 3 minutes
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out, Please try again later.")), 1 * 60 * 1000)
      );

      try {
        const response = await Promise.race([
          api.delete(`/api/deleteProfileImage/${userId}`),
          timeoutPromise,
        ]);

        if (response.data.success) {
          toast.success("Image removed successfully!");
          setEditing(false);
          setValues({ profileImage: values.profileImage });
          setError(null);
          window.location.reload();
        } else {
          toast.error("Failed to remove image.");
        }
      } catch (error) {
        console.log("Error removing image: ", error.message || error);
        setError("Error removing image, Please try again later.");
        toast.error("Error removing image, Please try again later.");
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const isValid = validate();

    if (!isValid) return;

    dispatch(setLoading(true));

    // Define a timeout for 3 minutes
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out, Please try again later.")), 1 * 60 * 1000)
    );

    const formData = new FormData();

    // Append the image file only if it's updated
    if (imageFile) {
      formData.append('image', imageFile);
    }

    // Append other values except password fields if they are empty
    for (let key in values) {
      if (key !== 'password' && key !== 'confirmPassword') {
        formData.append(key, values[key]);
      }
    }

    if (values.password && values.confirmPassword) {
      if (values.password !== values.confirmPassword) {
        toast.error("Passwords do not match!");
        dispatch(setLoading(false));
        return;
      } else {
        formData.append('password', values.password);
        formData.append('confirmPassword', values.confirmPassword);
      }
    }

    try {
      await Promise.race([
        api.put(`/api/updateUser/${userId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }),
        timeoutPromise,
      ]);

      toast.success("User Updated Successfully!");
      setEditing(false);
      setValues({
        ...values,
        password: '',
        confirmPassword: '',
      });
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Error updating user!";
      toast.error(errorMessage);
      console.error("Error:", errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const profileImageUrl = values.profileImage && values.profileImage[0] && values.profileImage[0].imagePath
    ? `${values.profileImage[0]?.imagePath}`
    : `https://res.cloudinary.com/dzmjsrpdp/image/upload/v1732013415/default_profile_jlmahy.png`;

  const validate = () => {
    let errors = {};
    let isValid = true;

    // First Name validation
    if (!values.firstName || values.firstName.length < 3) {
      errors.firstName = "First name must be at least 3 characters";
      isValid = false;
    }

    // Last Name validation
    if (!values.lastName) {
      isValid = false;
    }

    // Email validation
    if (!values.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Invalid email format (Format: abcd@example.com)";
      isValid = false;
    }

    // Password validation
    if (!values.password) {
      // errors.password = "Password is required";
      isValid = true;
    } else if (values.password.length < 8 || !/(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}/.test(values.password)) {
      errors.password = "Password must be at least 8 characters long and include at least one uppercase letter and one number";
      isValid = false;
    }

    // Confirm Password validation
    if (!values.confirmPassword) {
      // errors.confirmPassword = "Confirm password is required";
      isValid = true;
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    // Contact No validation (Format: +92XXXXXXXXXX)
    if (!values.contactNo) {
      errors.contactNo = "Phone number is required";
      isValid = false;
    } else if (!/^\+92\d{3}\d{7}$/.test(values.contactNo)) {
      errors.contactNo = "Invalid phone number (Format: +92XXXXXXXXXX)";
      isValid = false;
    }

    // Address validation
    if (!values.address) {
      errors.address = "Address is required";
      isValid = false;
    }

    // City validation
    if (!values.city) {
      errors.city = "City is required";
      isValid = false;
    }

    // Country validation
    if (!values.country) {
      errors.country = "Country is required";
      isValid = false;
    }

    // Postal Code validation (if applicable)
    if (!values.postalCode) {
      // errors.postalCode = "Postal code is required";
      isValid = true;
    } else if (!/^\d{5}$/.test(values.postalCode)) {  // Example: 5-digit postal code
      errors.postalCode = "Invalid postal code";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  return (
    <div className="relative top-28 left-0 w-full h-full">
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

      {/* Sidebar */}
      {userRole !== 'Client' ? (
        <div className={`fixed inset-y-0 z-50 left-0 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
          <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
        </div>
      ) : null}

      <main className="ease-soft-in-out xl:ml-68.5 relative h-full transition-all duration-200 bg-light flex flex-col">
        {userRole !== 'Client' ? (
          <Topbar toggleSidebar={toggleSidebar} />
        ) : null}

        <div className="flex flex-1 justify-center mt-3 pt-5 px-0">
          <div className="w-full max-w-6xl">
            <div className="border-b-2 flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden">
              {/* Left Side */}
              <div className="w-full md:w-2/5 p-6 bg-white border-r sm:border-b xs:border-b">
                <div className="flex justify-between items-center mb-4">
                  <span className="w-full flex justify-center text-2xl font-semibold uppercase">{values.fullName}</span>
                </div>

                <span className="w-full flex justify-center text-gray-600">This information is secret so be careful</span>

                {/* <div className="w-full flex justify-center items-center py-3 mt-[75px] flex-grow-0">
                  <img src={profileImageUrl} alt="Profile" className="h-44 w-44 rounded-lg object-cover" />
                </div> */}

                <div className="relative group w-full flex justify-center items-center py-3 mt-[75px] flex-grow-0">
                  <img src={profileImageUrl} alt="Profile" className="h-44 w-44 rounded-lg object-cover" />

                  {editing && (
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-600 text-white rounded-lg p-1 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out hover:bg-red-700  w-8 h-8"
                      title="Remove Image"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                </div>

                <div className="w-full flex justify-center mt-32">
                  {editing ? (
                    <div className="flex space-x-4">
                      <button onClick={handleSave} className="text-sm font-semibold text-white bg-[#7b246d] rounded-lg px-4 py-2 transition duration-300 hover:bg-[#692056] focus:outline-none focus:ring-2 focus:ring-[#7b246d]">Save Changes</button>
                      <button onClick={() => setEditing(false)} className="text-sm font-semibold text-gray-600 bg-gray-200 rounded-lg px-4 py-2 transition duration-300 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex space-x-4">
                      <button onClick={handleEdit} className="text-sm font-semibold text-white bg-[#7b246d] rounded-lg px-4 py-2 transition duration-300 hover:bg-[#692056] focus:outline-none focus:ring-2 focus:ring-[#7b246d]">Enable Editing</button>
                      <button onClick={goBack} className="text-sm font-semibold text-gray-600 bg-gray-200 rounded-lg px-4 py-2 transition duration-300 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">Go Back</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side */}
              <form className="w-full md:w-4/5 p-5 space-y-4" onSubmit={handleSave} encType="multipart/form-data">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label htmlFor="firstName" className="mb-2 text-sm font-medium text-gray-700">First Name:</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={values.firstName}
                      onChange={handleInputChange}
                      className={`text-sm text-gray-500 pl-3 pr-5 rounded-lg border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white ${!editing ? 'cursor-not-allowed' : ''}`}
                      disabled={!editing}
                    />
                    {errors.firstName && <span className="text-red-500 text-xs">{errors.firstName}</span>}
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="lastName" className="mb-2 text-sm font-medium text-gray-700">Last Name:</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={values.lastName}
                      onChange={handleInputChange}
                      className={`text-sm text-gray-500 pl-3 pr-5 rounded-lg border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white ${!editing ? 'cursor-not-allowed' : ''}`}
                      disabled={!editing}
                    />
                    {errors.lastName && <span className="text-red-500 text-xs">{errors.lastName}</span>}
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="email" className="mb-2 text-sm font-medium text-gray-700">Email:</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={values.email}
                      onChange={handleInputChange}
                      className={`text-sm text-gray-500 pl-3 pr-5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white ${!editing ? 'cursor-not-allowed' : ''}`}
                      disabled={!editing}
                    />
                    {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="contactNo" className="mb-2 text-sm font-medium text-gray-700">Contact No:</label>
                    <input
                      type="text"
                      id="contactNo"
                      name="contactNo"
                      value={values.contactNo}
                      onChange={handleInputChange}
                      className={`text-sm text-gray-500 pl-3 pr-5 rounded-lg border ${errors.contactNo ? 'border-red-500' : 'border-gray-300'} w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white ${!editing ? 'cursor-not-allowed' : ''}`}
                      disabled={!editing}
                    />
                    {errors.contactNo && <span className="text-red-500 text-xs">{errors.contactNo}</span>}
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="address" className="mb-2 text-sm font-medium text-gray-700">Address:</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={values.address}
                      onChange={handleInputChange}
                      className={`text-sm text-gray-500 pl-3 pr-5 rounded-lg border ${errors.address ? 'border-red-500' : 'border-gray-300'} w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white ${!editing ? 'cursor-not-allowed' : ''}`}
                      disabled={!editing}
                    />
                    {errors.address && <span className="text-red-500 text-xs">{errors.address}</span>}
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="city" className="mb-2 text-sm font-medium text-gray-700">City:</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={values.city}
                      onChange={handleInputChange}
                      className={`text-sm text-gray-500 pl-3 pr-5 rounded-lg border ${errors.city ? 'border-red-500' : 'border-gray-300'} w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white ${!editing ? 'cursor-not-allowed' : ''}`}
                      disabled={!editing}
                    />
                    {errors.city && <span className="text-red-500 text-xs">{errors.city}</span>}
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="country" className="mb-2 text-sm font-medium text-gray-700">Country:</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={values.country}
                      onChange={handleInputChange}
                      className={`text-sm text-gray-500 pl-3 pr-5 rounded-lg border ${errors.country ? 'border-red-500' : 'border-gray-300'} w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white ${!editing ? 'cursor-not-allowed' : ''}`}
                      disabled={!editing}
                    />
                    {errors.country && <span className="text-red-500 text-xs">{errors.country}</span>}
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="postalCode" className="mb-2 text-sm font-medium text-gray-700">Postal Code:</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={values.postalCode}
                      onChange={handleInputChange}
                      className={`text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white ${!editing ? 'cursor-not-allowed' : ''}`}
                      disabled={!editing}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="password" className="mb-2 text-sm font-medium text-gray-700">Password:</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={values.password}
                      onChange={handleInputChange}
                      className={`text-sm text-gray-500 pl-3 pr-5 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white ${!editing ? 'cursor-not-allowed' : ''}`}
                      disabled={!editing}
                    />
                    {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="confirmPassword" className="mb-2 text-sm font-medium text-gray-700">Confirm Password:</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={values.confirmPassword}
                      onChange={handleInputChange}
                      className={`text-sm text-gray-500 pl-3 pr-5 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white ${!editing ? 'cursor-not-allowed' : ''}`}
                      disabled={!editing}
                    />
                    {errors.confirmPassword && <span className="text-red-500 text-xs">{errors.confirmPassword}</span>}
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="image" className="mb-2 text-sm font-medium text-gray-700">Profile Image:</label>
                    <label className={`text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white ${!editing ? 'cursor-not-allowed' : ''}`}>
                      <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={!editing}
                      />
                      <span className="text-gray-400">{imageFile ? imageFile.name : 'Select profile Image'}</span>
                    </label>
                  </div>

                  {/* User Role (Only for Admin) */}
                  {userRole === "Admin" && (
                    <div className="flex flex-col">
                      <label htmlFor="role" className="mb-2 text-sm font-medium text-gray-700">User Role:</label>
                      <select
                        id="role"
                        name="role"
                        value={values.role}
                        onChange={handleInputChange}
                        className={`text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white ${!editing ? 'cursor-not-allowed' : ''}`}
                        disabled={!editing}
                      >
                        {roles.map((role, idx) => (
                          <option key={idx} value={role.name}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
