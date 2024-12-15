import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Topbar from '../Constants/Topbar.jsx';
import Sidebar from '../Constants/Sidebar.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../api/api.js';
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../redux/reduxSlice";
import Loader from "../../../components/Loader/Loader";

function UpdateCategory() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: '', description: '', image: '' });
  const { categoryId } = useParams();
  const [editing, setEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.reduxReducer.loading);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryById = async () => {
      dispatch(setLoading(true));

      // Define a timeout for 3 minutes
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out, Please try again later.")), 1 * 60 * 1000)
      );

      try {
        const response = await Promise.race([
          api.get(`/api/fetchCategoryById/${categoryId}`),
          timeoutPromise,
        ]);
        const categoryData = response.data;
        const category = categoryData.category[0];
        setValues({
          name: category.name,
          description: category.description,
          image: category.image[0].imageName
        });
        setError(null);
      } catch (error) {
        console.log("Error fetching category data: ", error);
        toast.error("Error fetching category data, try checking browser console.");
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchCategoryById();
  }, [categoryId, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    // Define a timeout for 3 minutes
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out, Please try again later.")), 1 * 60 * 1000)
    );

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await Promise.race([
        api.put(`/api/updateCategory/${categoryId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }),
        timeoutPromise,
      ]);
      if (response.data.message === "Category updated successfully!") {
        toast.success("Category updated successfully!");
        setEditing(false);
        setError(null);
      }
    } catch (error) {
      // Check if the error has a response from the server
      if (error.response) {
        // Extract the custom error message from the server
        const errorMessage = error.response.data.error || "Something went wrong, Please try again later.";
        toast.error(errorMessage); // Display the error message to the user
      } else if (error.request) {
        // Request was made but no response was received
        toast.error("No response from the server. Please try again later.");
      } else {
        // Something else went wrong during the setup of the request
        toast.error("An unexpected error occurred!");
      }
    
      console.error("Error details:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setEditing(true);
  };

  const goBack = () => {
    navigate('/dashboard/categories');
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
      <div className={`fixed inset-y-0 z-50 left-0 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
      </div>

      {/* Main */}
      <main className="ease-soft-in-out xl:ml-68.5 relative h-full max-h-screen rounded-xl transition-all duration-200 bg-light flex flex-col">
        {/* Topbar */}
        <Topbar toggleSidebar={toggleSidebar} />

        {/* Form */}
        <div className="flex flex-1 justify-center mt-3 pt-5 px-2 sm:px-4 md:px-0">
          <div className="w-full max-w-full sm:max-w-lg md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto">
            <div className="border-b-2 flex flex-col bg-white shadow-lg rounded-lg overflow-hidden p-5">
              {error && (<p className="text-red-500 text-center py-5">{error}</p>)}
              <form className="w-full grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3" onSubmit={handleSubmit} encType="multipart/form-data">

                {/* Category Name */}
                <div className="flex flex-col">
                  <label htmlFor="name" className="mb-2 text-sm font-semibold text-gray-700">Category Name:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={values.name}
                    onChange={handleInputChange}
                    className={`text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white ${!editing ? 'cursor-not-allowed' : ''}`}
                    disabled={!editing}
                  />
                </div>

                {/* Category Image */}
                <div className="flex flex-col">
                  <label htmlFor="image" className="mb-2 text-sm font-semibold text-gray-700">Category Image:</label>
                  <label className="relative text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white">
                    <input
                      type="file"
                      id="image"
                      name="image"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={!editing}
                    />
                    <span className={`text-gray-400 ${!editing ? 'cursor-not-allowed' : ''}`}>{imageFile ? imageFile.name : values.image || "No image in database"}</span>
                  </label>
                </div>

                {/* Description */}
                <div className="flex flex-col col-span-1 md:col-span-2 lg:col-span-3">
                  <label htmlFor="description" className="mb-2 text-sm font-semibold text-gray-700">Description:</label>
                  <textarea
                    id="description"
                    name="description"
                    value={values.description}
                    onChange={handleInputChange}
                    className={`text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white ${!editing ? 'cursor-not-allowed' : ''}`}
                    disabled={!editing}
                  />
                </div>

                {/* Buttons */}
                {editing ? (
                  <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-between mt-5">
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="text-sm font-semibold text-gray-600 bg-gray-200 rounded-lg px-4 py-2 transition duration-300 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="text-sm font-semibold text-white bg-[#7b246d] rounded-lg px-4 py-2 transition duration-300 hover:bg-[#692056] focus:outline-none focus:ring-2 focus:ring-[#7b246d]">
                      Update Category
                    </button>
                  </div>
                ) : (
                  <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-between mt-5">
                    <button
                      type="button"
                      onClick={goBack}
                      className="text-sm font-semibold text-gray-600 bg-gray-200 rounded-lg px-4 py-2 transition duration-300 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">
                      Go Back
                    </button>

                    <button
                      type="button"
                      onClick={handleEdit}
                      className="text-sm font-semibold text-white bg-[#7b246d] rounded-lg px-4 py-2 transition duration-300 hover:bg-[#692056] focus:outline-none focus:ring-2 focus:ring-[#7b246d]">
                      Enable Edit
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UpdateCategory;
