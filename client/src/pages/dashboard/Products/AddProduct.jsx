import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Topbar from '../Constants/Topbar.jsx';
import Sidebar from '../Constants/Sidebar.jsx';
import api from '../../../api/api.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../redux/reduxSlice";
import Loader from "../../../components/Loader/Loader";

function AddProduct() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    longDescription: '',
    newPrice: '',
    oldPrice: '',
    color: [''],
    size: [''],
    tags: '',
    category: [],
    stock: '',
    status: '',
    discount: '',
    images: [],
    youtubeVideoLink: ''
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.reduxReducer.loading);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      dispatch(setLoading(true));

      // Define a timeout for 3 minutes
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out, Please try again later.")), 1 * 60 * 1000)
      );

      try {
        const response = await Promise.race([
          api.get('/api/fetchCategories'),
          timeoutPromise,
        ]);
        setCategories(response.data);
        setError(null);
      } catch (error) {
        console.log('Error fetching categories:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchCategories();
  }, [dispatch]);

  const handleInputChange = (e, index, field, maxCharacters = 150) => {
    const { name, value } = e.target;

    // Apply character limit only to 'shortDes' field
    if (name === 'shortDes' && value.length > maxCharacters) return;

    if (field === 'color' || field === 'size') {
      const updatedArray = [...formData[field]];
      updatedArray[index] = value;
      setFormData((prevState) => ({ ...prevState, [field]: updatedArray }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFormData({ ...formData, images: [...formData.images, ...selectedFiles] });
  };

  const removeImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    // Define a timeout for 3 minutes
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out, Please try again later.")), 1 * 60 * 1000)
    );

    const formDataToSend = new FormData();

    const colorData = formData.color.filter(color => color.trim() !== '');
    const sizeData = formData.size.filter(size => size.trim() !== '');

    for (let key in formData) {
      if (key === 'images') {
        formData.images.forEach((image) => {
          formDataToSend.append('images', image);
        });
      } else if (Array.isArray(formData[key])) {
        formData[key].forEach((item) => formDataToSend.append(key, item));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }

    // Append `color` only if it contains values
    if (colorData.length > 0) {
      colorData.forEach(color => formDataToSend.append('color[]', color));
    }

    // Append `size` only if it contains values
    if (sizeData.length > 0) {
      sizeData.forEach(size => formDataToSend.append('size[]', size));
    }

    try {
      const uploadProduct = await Promise.race([
        api.post('/api/products/addProduct', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }),
        timeoutPromise,
      ]);

      if (uploadProduct.data.message === 'Product added successfully!') {
        toast.success('Product added successfully!');
        setError(null);
        setFormData({
          name: '',
          shortDescription: '',
          longDescription: '',
          newPrice: '',
          oldPrice: '',
          discount: '',
          status: '',
          color: [''],
          size: [''],
          tags: '',
          category: '',
          stock: '',
          images: [],
          youtubeVideoLink: ''
        });
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

  const addColorField = () => {
    setFormData(prevState => ({
      ...prevState,
      color: [...prevState.color, '']
    }));
  };

  const addSizeField = () => {
    setFormData(prevState => ({
      ...prevState,
      size: [...prevState.size, '']
    }));
  };

  const goBack = () => {
    navigate('/dashboard/products');
  };

  const removeColor = (index) => {
    const updatedColors = formData.color.filter((_, i) => i !== index);
    setFormData((prevState) => ({ ...prevState, color: updatedColors }));
  };

  const removeSize = (index) => {
    const updatedSizes = formData.size.filter((_, i) => i !== index);
    setFormData((prevState) => ({ ...prevState, size: updatedSizes }));
  };

  // Checkbox Change Handler
  const handleCheckboxChange = (e, categoryName) => {
    const isChecked = e.target.checked;

    setFormData((prevState) => {
      const updatedCategories = isChecked
        ? [...prevState.category, categoryName] // Add category if checked
        : prevState.category.filter((cat) => cat !== categoryName); // Remove category if unchecked

      return {
        ...prevState,
        category: updatedCategories,
      };
    });
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
      <main className="relative h-full max-h-screen rounded-xl transition-all duration-200 bg-white flex flex-col">
        {/* Topbar */}
        <Topbar toggleSidebar={toggleSidebar} />

        {/* Add Product Form */}
        <div className="flex flex-1 justify-center mt-3 pt-5 px-2 sm:px-4 md:px-0">
          <div className="w-full max-w-full sm:max-w-lg md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto">
            <div className="border-b-2 flex flex-col bg-white shadow-lg rounded-lg overflow-hidden p-4 sm:p-5 md:p-10">
              {error && (<p className="text-red-500 text-center py-5">{error}</p>)}
              <form className="w-full grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3" onSubmit={handleSubmit} encType="multipart/form-data">
                {/* Buttons */}
                <div className="flex justify-between md:col-span-3">
                  <button
                    type="button"
                    onClick={goBack}
                    className="text-sm w-full max-w-[120px] font-semibold text-gray-600 bg-gray-200 rounded-lg px-4 py-2 transition duration-300 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    Go Back
                  </button>
                  <button
                    type="submit"
                    className="text-sm w-full max-w-[120px] font-semibold text-white bg-[#7b246d] rounded-lg px-4 py-2 transition duration-300 hover:bg-[#692056] focus:outline-none focus:ring-2 focus:ring-[#7b246d]"
                  >
                    Add Product
                  </button>
                </div>

                {/* Product Name */}
                <div className="flex flex-col">
                  <label htmlFor="name" className="mb-2 text-sm font-semibold text-gray-700">Product Name:*</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white"
                  />
                </div>

                {/* Colors */}
                <div className="flex flex-col">
                  <label className="mb-2 text-sm font-semibold text-gray-700">Colors:</label>
                  {formData.color.map((color, index) => (
                    <div key={index} className="relative flex items-center mb-2">
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => handleInputChange(e, index, 'color')}
                        className="text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white"
                      />
                      {index === formData.color.length - 1 && (
                        <button
                          type="button"
                          onClick={addColorField}
                          className="absolute top-[10px] right-9 text-gray-700 hover:text-green-500 text-xs"
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>

                      )}
                      <button
                        type="button"
                        onClick={() => removeColor(index)}
                        className="absolute top-2 right-4 text-gray-700 hover:text-red-500 font-semibold text-sm"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Sizes */}
                <div className="flex flex-col">
                  <label className="mb-2 text-sm font-semibold text-gray-700">Sizes:</label>
                  {formData.size.map((size, index) => (
                    <div key={index} className="relative flex items-center mb-2">
                      <input
                        type="text"
                        value={size}
                        onChange={(e) => handleInputChange(e, index, 'size')}
                        className="text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white"
                      />
                      {index === formData.size.length - 1 && (
                        <button
                          type="button"
                          onClick={addSizeField}
                          className="absolute top-[10px] right-9 text-gray-700 hover:text-green-500 text-xs"
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeSize(index)}
                        className="absolute top-2 right-4 text-gray-700 hover:text-red-500 font-semibold text-sm"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-col">
                  <label htmlFor="status" className="mb-2 text-sm font-semibold text-gray-700">Tags:</label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white"
                  />
                </div>

                {/* Stock */}
                <div className="flex flex-col">
                  <label htmlFor="stock" className="mb-2 text-sm font-semibold text-gray-700">Stock:*</label>
                  <input
                    type="text"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white"
                  />
                </div>

                {/* Status */}
                <div className="flex flex-col">
                  <label htmlFor="status" className="mb-2 text-sm font-semibold text-gray-700">Status:*</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white"
                  >
                    <option value="">Select Status</option>
                    <option value="Available">Available</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>

                {/* New Price */}
                <div className="flex flex-col">
                  <label htmlFor="newPrice" className="mb-2 text-sm font-semibold text-gray-700">New Price:*</label>
                  <input
                    type="text"
                    id="newPrice"
                    name="newPrice"
                    value={formData.newPrice}
                    onChange={handleInputChange}
                    className="text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white"
                  />
                </div>

                {/* Old Price */}
                <div className="flex flex-col">
                  <label htmlFor="oldPrice" className="mb-2 text-sm font-semibold text-gray-700">Old Price:</label>
                  <input
                    type="text"
                    id="oldPrice"
                    name="oldPrice"
                    value={formData.oldPrice}
                    onChange={handleInputChange}
                    className="text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white"
                  />
                </div>

                {/* Discount */}
                <div className="flex flex-col">
                  <label htmlFor="status" className="mb-2 text-sm font-semibold text-gray-700">Discount:</label>
                  <input
                    type="text"
                    id="discount"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    className="text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white"
                  />
                </div>

                {/* YouTube Video Link */}
                <div className="flex flex-col">
                  <label htmlFor="youtubeVideo" className="mb-2 text-sm font-semibold text-gray-700">YouTube Video Link:</label>
                  <textarea
                    id="youtubeVideo"
                    name="youtubeVideoLink"
                    value={formData.youtubeVideoLink}
                    onChange={handleInputChange}
                    placeholder='Add (&autoplay=1&mute=1) for autoplay youtube video and also mute by default on website.'
                    className="text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white"
                  />
                </div>

                {/* Short Description */}
                <div className="flex flex-col">
                  <label htmlFor="shortDescription" className="mb-2 text-sm font-semibold text-gray-700">
                    Short Description:*
                  </label>
                  <textarea
                    id="shortDescription"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={(e) => handleInputChange(e, null, null, 150)} // Limit to 150 characters
                    maxLength={150} // Optional, provides additional browser-level restriction
                    className="text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white"
                  />
                  <small className="text-gray-500 mt-1">
                    {150 - formData.shortDescription.length} characters remaining
                  </small>
                </div>

                {/* Category */}
                {/* <div className="flex flex-col">
                  <label htmlFor="category" className="mb-2 text-sm font-semibold text-gray-700">Category:*</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div> */}

                {/* Category */}
                <div className="flex flex-col">
                  <label className="mb-2 text-sm font-semibold text-gray-700">
                    Category:*
                  </label>
                  <div className="grid grid-cols-2 gap-2"> {/* Adjust grid columns as needed */}
                    {categories.map((cat) => (
                      <label
                        key={cat._id}
                        className="flex items-center gap-2 text-gray-700 px-3 py-2 rounded-lg cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          value={cat.name}
                          checked={formData.category.includes(cat.name)} // Check if already selected
                          onChange={(e) => handleCheckboxChange(e, cat.name)}
                          className="accent-white" // Optional: Add custom styles for the checkbox
                        />
                        {cat.name}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Long Description */}
                <div className="flex flex-col md:col-span-3">
                  <label htmlFor="longDescription" className="mb-2 text-sm font-semibold text-gray-700">Long Description:*</label>
                  <textarea
                    id="longDescription"
                    name="longDescription"
                    value={formData.longDescription}
                    onChange={handleInputChange}
                    className="text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white"
                  />
                </div>

                {/* Multiple Image Upload */}
                <div className="flex flex-col md:col-span-3">
                  <label htmlFor="images" className="mb-1 sm:mb-2 text-xs sm:text-sm font-semibold text-gray-700">Product Images:*</label>
                  <div className="relative">
                    <label className="w-full py-2 rounded-lg border border-gray-300 rounded-lg-lg flex items-center bg-white cursor-pointer pl-3 pr-5 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent">
                      <input onChange={handleImageChange} type="file" id="images" name="images" className="hidden" multiple />
                      <span className="text-gray-400">{formData.images.length > 0 ? `${formData.images.length} images selected` : 'Select Product Images'}</span>
                    </label>
                  </div>

                  {/* Preview Images */}
                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative w-full h-full bg-gray-100 border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out">
                        <img src={URL.createObjectURL(image)} alt="Product Preview" className="flex object-fit w-full h-full" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-gray-300 text-slate-700 p-0.5 rounded-lg w-4 sm:w-5 h-4 sm:h-5 text-xs sm:text-sm hover:font-semibold flex items-center justify-center hover:bg-gray-200 ease-in-out"
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddProduct;
