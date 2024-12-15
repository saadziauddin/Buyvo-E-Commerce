import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import Topbar from '../Constants/Topbar.jsx';
import Sidebar from '../Constants/Sidebar.jsx';
import api from '../../../api/api.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../redux/reduxSlice";
import Loader from "../../../components/Loader/Loader";

function UpdateProduct() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    color: [],
    size: [],
    tags: '',
    stock: '',
    category: [],
    discount: '',
    status: '',
    newPrice: '',
    oldPrice: '',
    shortDescription: '',
    longDescription: '',
    images: [],
    youtubeVideoLink: ''
  });
  const [initialFormData, setInitialFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const { productId } = useParams();
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
        console.log("Error fetching categories: ", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    const fetchProductById = async () => {
      dispatch(setLoading(true));

      // Define a timeout for 3 minutes
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out, Please try again later.")), 1 * 60 * 1000)
      );

      try {
        const response = await Promise.race([
          api.get(`/api/fetchProductById/${productId}`),
          timeoutPromise,
        ]);
        const product = response.data.product[0];
        setFormData({
          name: product.name,
          shortDescription: product.shortDescription,
          longDescription: product.longDescription,
          newPrice: product.newPrice,
          oldPrice: product.oldPrice,
          color: product.color ?? [''],
          size: product.size ?? [''],
          tags: product.tags,
          discount: product.discount,
          status: product.status,
          category: product.category,
          stock: product.stock,
          images: product.images,
          youtubeVideoLink: product.youtubeVideoLink
        });
        setError(null);
      } catch (error) {
        console.log("Error fetching product data: ", error);
        toast.error("Error fetching product data.");
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchCategories();
    fetchProductById();
  }, [productId, dispatch]);

  // const handleInputChange = (e, index, field) => {
  const handleInputChange = (e, index, field, maxCharacters = 150) => {
    const { name, value } = e.target;

    // Apply character limit only to 'shortDes' field
    if (name === 'shortDes' && value.length > maxCharacters) return;

    if (field === 'color' || field === 'size') {
      const updatedArray = formData[field] ? [...formData[field]] : [];
      updatedArray[index] = value;
      setFormData({ ...formData, [field]: updatedArray });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalImages = formData.images.length + newImages.length + selectedFiles.length;

    if (totalImages > 10) {
      toast.error('You can only upload up to 10 images!');
      return;
    }

    setNewImages([...newImages, ...selectedFiles]);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   dispatch(setLoading(true));

  //   // Define a timeout for 3 minutes
  //   const timeoutPromise = new Promise((_, reject) =>
  //     setTimeout(() => reject(new Error("Request timed out, Please try again later.")), 1 * 60 * 1000)
  //   );

  //   const formDataToSend = new FormData();

  //   // Filter and sanitize color and size data
  //   const colorData = formData.color.filter(color => typeof color === 'string' && color !== '');
  //   const sizeData = formData.size.filter(size => typeof size === 'string' && size !== '');

  //   // Append non-array fields to formDataToSend
  //   for (let key in formData) {
  //     if (key !== 'images' && key !== 'color' && key !== 'size') {
  //       let value = formData[key];

  //       // Handle empty or "null" fields
  //       if (value === '' || value === null || value === 'null') {
  //         formDataToSend.append(key, null); // Append null
  //       } else {
  //         formDataToSend.append(key, value); // Append actual value
  //       }
  //     }
  //   }

  //   // for (let [key, value] of formDataToSend.entries()) {
  //   //   console.log(key, value);
  //   // }
  //   // console.log("Form data: ", formData);

  //   // Handle color and size fields
  //   if (colorData.length > 0) {
  //     colorData.forEach(color => formDataToSend.append('color[]', color));
  //   } else {
  //     formDataToSend.append('color', ''); // Save empty string if no colors are provided
  //   }

  //   if (sizeData.length > 0) {
  //     sizeData.forEach(size => formDataToSend.append('size[]', size));
  //   } else {
  //     formDataToSend.append('size', ''); // Save empty string if no sizes are provided
  //   }

  //   // Append new and existing images
  //   (newImages || []).forEach((image) => {
  //     formDataToSend.append('images', image);
  //   });

  //   (formData.images || []).forEach((image, index) => {
  //     if (image !== initialFormData.images?.[index]) {
  //       formDataToSend.append('existingImages', image);
  //     }
  //   });

  //   try {
  //     const updateProduct = await Promise.race([
  //       api.put(`/api/updateProduct/${productId}`, formDataToSend, {
  //         headers: { 'Content-Type': 'multipart/form-data' },
  //       }),
  //       timeoutPromise,
  //     ]);

  //     if (updateProduct.data.message === "Product updated successfully!") {
  //       toast.success("Product updated successfully!");
  //       setNewImages([]);
  //       setEditing(false);
  //       setError(null);

  //       // Refetch product data to reflect changes
  //       const refetchProductsData = await Promise.race([
  //         api.get(`/api/fetchProductById/${productId}`),
  //         timeoutPromise,
  //       ]);
  //       const product = refetchProductsData.data.product[0];
  //       setFormData({
  //         ...formData,
  //         name: product.name || '',
  //         shortDescription: product.shortDescription || '',
  //         longDescription: product.longDescription || '',
  //         newPrice: product.newPrice || null,
  //         oldPrice: product.oldPrice || null,
  //         color: product.color || [''],
  //         size: product.size || [''],
  //         tags: product.tags || '',
  //         discount: product.discount || null,
  //         status: product.status || null,
  //         category: product.category || null,
  //         stock: product.stock || null,
  //         images: product.images || [],
  //         youtubeVideoLink: product.youtubeVideoLink || null,
  //       });
  //     }
  //   } catch (error) {
  //     // Check if the error has a response from the server
  //     if (error.response) {
  //       // Extract the custom error message from the server
  //       const errorMessage = error.response.data.error || "Something went wrong, Please try again later.";
  //       toast.error(errorMessage); // Display the error message to the user
  //     } else if (error.request) {
  //       // Request was made but no response was received
  //       toast.error("No response from the server. Please try again later.");
  //     } else {
  //       // Something else went wrong during the setup of the request
  //       toast.error("An unexpected error occurred!");
  //     }

  //     console.error("Error details:", error);
  //   } finally {
  //     dispatch(setLoading(false));
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    // Define a timeout for 3 minutes
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out, Please try again later.")), 1 * 60 * 1000)
    );

    const formDataToSend = new FormData();

    // Filter and sanitize color, size, and category data
    const colorData = formData.color.filter(color => typeof color === 'string' && color !== '');
    const sizeData = formData.size.filter(size => typeof size === 'string' && size !== '');
    const categoryData = formData.category.filter(cat => typeof cat === 'string' && cat !== '');

    // Append non-array fields to formDataToSend
    for (let key in formData) {
      if (key !== 'images' && key !== 'color' && key !== 'size' && key !== 'category') {
        let value = formData[key];

        // Handle empty or "null" fields
        if (value === '' || value === null || value === 'null') {
          formDataToSend.append(key, null); // Append null
        } else {
          formDataToSend.append(key, value); // Append actual value
        }
      }
    }

    // Handle color, size, and category fields
    if (colorData.length > 0) {
      colorData.forEach(color => formDataToSend.append('color[]', color));
    } else {
      formDataToSend.append('color', ''); // Save empty string if no colors are provided
    }

    if (sizeData.length > 0) {
      sizeData.forEach(size => formDataToSend.append('size[]', size));
    } else {
      formDataToSend.append('size', ''); // Save empty string if no sizes are provided
    }

    if (categoryData.length > 0) {
      categoryData.forEach(category => formDataToSend.append('category[]', category));
    } else {
      formDataToSend.append('category', ''); // Save empty string if no categories are provided
    }

    // Append new and existing images
    (newImages || []).forEach((image) => {
      formDataToSend.append('images', image);
    });

    (formData.images || []).forEach((image, index) => {
      if (image !== initialFormData.images?.[index]) {
        formDataToSend.append('existingImages', image);
      }
    });

    try {
      const updateProduct = await Promise.race([
        api.put(`/api/updateProduct/${productId}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }),
        timeoutPromise,
      ]);

      if (updateProduct.data.message === "Product updated successfully!") {
        toast.success("Product updated successfully!");
        setNewImages([]);
        setEditing(false);
        setError(null);

        // Refetch product data to reflect changes
        const refetchProductsData = await Promise.race([
          api.get(`/api/fetchProductById/${productId}`),
          timeoutPromise,
        ]);
        const product = refetchProductsData.data.product[0];
        setFormData({
          ...formData,
          name: product.name || '',
          shortDescription: product.shortDescription || '',
          longDescription: product.longDescription || '',
          newPrice: product.newPrice || null,
          oldPrice: product.oldPrice || null,
          color: product.color || [''],
          size: product.size || [''],
          tags: product.tags || '',
          discount: product.discount || null,
          status: product.status || null,
          category: product.category || [], // Update with selected categories
          stock: product.stock || null,
          images: product.images || [],
          youtubeVideoLink: product.youtubeVideoLink || null,
        });
      }
    } catch (error) {
      // Check if the error has a response from the server
      if (error.response) {
        const errorMessage = error.response.data.error || "Something went wrong, Please try again later.";
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error("No response from the server. Please try again later.");
      } else {
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
    navigate('/dashboard/products');
  };

  const removeExistingImage = async (index) => {
    dispatch(setLoading(true));

    // Define a timeout for 3 minutes
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out, Please try again later.")), 1 * 60 * 1000)
    );

    const imageToRemove = formData.images[index];

    try {
      const response = await Promise.race([
        api.delete(`/api/deleteProductImage/${productId}`, { data: { publicId: imageToRemove.imageName } }),
        timeoutPromise,
      ]);

      if (response.data.success) {
        const updatedImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: updatedImages });
        setError(null);
        toast.success("Image removed successfully!");
      } else {
        toast.error("Failed to remove image.");
      }
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Error removing image.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const removeNewImage = (index) => {
    const updatedNewImages = newImages.filter((_, i) => i !== index);
    setNewImages(updatedNewImages);
  };

  const addColor = () => {
    setFormData((prevState) => ({
      ...prevState,
      color: [...prevState.color, '']
    }));
  };

  const removeColor = (index) => {
    const updatedColors = formData.color.filter((_, i) => i !== index);
    setFormData((prevState) => ({ ...prevState, color: updatedColors }));
  };

  const addSize = () => {
    setFormData((prevState) => ({
      ...prevState,
      size: [...prevState.size, '']
    }));
  };

  const removeSize = (index) => {
    const updatedSizes = formData.size.filter((_, i) => i !== index);
    setFormData((prevState) => ({ ...prevState, size: updatedSizes }));
  };

  const handleCheckboxChange = (e, category) => {
    const isChecked = e.target.checked;
    setFormData((prevData) => {
      const updatedCategories = isChecked
        ? [...prevData.category, category] // Add category if checked
        : prevData.category.filter((cat) => cat !== category); // Remove category if unchecked
      return { ...prevData, category: updatedCategories };
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
      <main className="ease-soft-in-out xl:ml-68.5 relative h-full max-h-screen rounded-xl transition-all duration-200 bg-light flex flex-col">
        {/* Topbar */}
        <Topbar toggleSidebar={toggleSidebar} />

        {/* Update Product Form */}
        <div className="flex flex-1 justify-center mt-3 pt-5 px-2 sm:px-4 md:px-0">
          <div className="w-full max-w-full sm:max-w-lg md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto">
            <div className="border-b-2 flex flex-col bg-white shadow-lg rounded-lg overflow-hidden p-4 sm:p-5 md:p-10">
              {error && (<p className="text-red-500 text-center py-5">{error}</p>)}
              <form className="w-full grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3" onSubmit={handleSubmit} encType="multipart/form-data">
                {/* Buttons */}
                {editing ? (
                  <div className="flex justify-between md:col-span-3">
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="text-sm font-semibold text-gray-600 bg-gray-200 rounded-lg px-4 py-2 transition duration-300 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="text-sm font-semibold text-white bg-[#7b246d] rounded-lg px-4 py-2 transition duration-300 hover:bg-[#692056] focus:outline-none focus:ring-2 focus:ring-[#7b246d]"
                    >
                      Update Product
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between md:col-span-3">
                    <button
                      type="button"
                      onClick={goBack}
                      className="text-sm font-semibold text-gray-600 bg-gray-200 rounded-lg px-4 py-2 transition duration-300 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                      Go Back
                    </button>
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="text-sm font-semibold text-white bg-[#7b246d] rounded-lg px-4 py-2 transition duration-300 hover:bg-[#692056] focus:outline-none focus:ring-2 focus:ring-[#7b246d]"
                    >
                      Enable Edit
                    </button>
                  </div>
                )}

                {/* Product Name */}
                <div className="flex flex-col">
                  <label htmlFor="name" className="mb-2 pl-1 text-base font-semibold text-gray-700">Product Name:*</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white ${!editing ? 'cursor-not-allowed' : ''}`}
                    disabled={!editing}
                  />
                </div>

                {/* Colors */}
                <div className="flex flex-col">
                  <label htmlFor="color" className="mb-2 pl-1 text-base font-semibold text-gray-700">Colors:</label>
                  {/* {formData.color.map((color, index) => ( */}
                  {(formData.color || []).map((color, index) => (
                    <div key={index} className="relative flex items-center mb-2">
                      <input
                        type="text"
                        id={`color-${index}`}
                        name="color"
                        value={color}
                        onChange={(e) => handleInputChange(e, index, 'color')}
                        className={`text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white ${!editing ? 'cursor-not-allowed' : ''}`}
                        disabled={!editing}
                      />
                      {editing && (
                        <>
                          {/* Add color button */}
                          {index === formData.color.length - 1 && (
                            <button
                              type="button"
                              className="absolute top-[10px] right-9 text-gray-700 hover:text-green-500 text-xs"
                              onClick={addColor}
                            >
                              <FontAwesomeIcon icon={faPlus} />
                            </button>
                          )}
                          {/* Remove color button */}
                          <button
                            type="button"
                            className="absolute top-2 right-4 text-gray-700 hover:text-red-500 font-semibold text-sm"
                            onClick={() => removeColor(index)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>

                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Sizes */}
                <div className="flex flex-col">
                  <label htmlFor="size" className="mb-2 pl-1 text-base font-semibold text-gray-700">Sizes:</label>
                  {(formData.size || []).map((size, index) => (
                    <div key={index} className="relative flex items-center mb-2">
                      <input
                        type="text"
                        id={`size-${index}`}
                        name="size"
                        value={size}
                        onChange={(e) => handleInputChange(e, index, 'size')}
                        className={`text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white ${!editing ? 'cursor-not-allowed' : ''}`}
                        disabled={!editing}
                      />
                      {editing && (
                        <>
                          {/* Add size button */}
                          {index === formData.size.length - 1 && (
                            <button
                              type="button"
                              className="absolute top-[10px] right-9 text-gray-700 hover:text-green-500 text-xs block"
                              onClick={addSize}
                            >
                              <FontAwesomeIcon icon={faPlus} />
                            </button>
                          )}
                          {/* Remove size button */}
                          <button
                            type="button"
                            className="absolute top-2 right-4 text-gray-700 hover:text-red-500 font-semibold text-sm block"
                            onClick={() => removeSize(index)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-col">
                  <label htmlFor="status" className="mb-2 pl-1 text-base font-semibold text-gray-700">Tags:</label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className={`text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white ${!editing ? 'cursor-not-allowed' : ''}`}
                    disabled={!editing}
                  />
                </div>

                {/* Stock */}
                <div className="flex flex-col">
                  <label htmlFor="stock" className="mb-2 pl-1 text-base font-semibold text-gray-700">Stock:*</label>
                  <input
                    type="text"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className={`text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white ${!editing ? 'cursor-not-allowed' : ''}`}
                    disabled={!editing}
                  />
                </div>

                {/* Status */}
                <div className="flex flex-col">
                  <label htmlFor="status" className="mb-2 pl-1 text-base font-semibold text-gray-700">Status:*</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={`text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white ${!editing ? 'cursor-not-allowed' : ''}`}
                    disabled={!editing}
                  >
                    <option value="">Select Status</option>
                    <option value="Available">Available</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>

                {/* New Price */}
                <div className="flex flex-col">
                  <label htmlFor="newPrice" className="mb-2 pl-1 text-base font-semibold text-gray-700">New Price:*</label>
                  <input
                    type="text"
                    id="newPrice"
                    name="newPrice"
                    value={formData.newPrice}
                    onChange={handleInputChange}
                    className={`text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white ${!editing ? 'cursor-not-allowed' : ''}`}
                    disabled={!editing}
                  />
                </div>

                {/* Old Price */}
                <div className="flex flex-col">
                  <label htmlFor="oldPrice" className="mb-2 pl-1 text-base font-semibold text-gray-700">Old Price:</label>
                  <input
                    type="text"
                    id="oldPrice"
                    name="oldPrice"
                    value={formData.oldPrice}
                    onChange={handleInputChange}
                    className={`text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white ${!editing ? 'cursor-not-allowed' : ''}`}
                    disabled={!editing}
                  />
                </div>

                {/* Discount */}
                <div className="flex flex-col">
                  <label htmlFor="status" className="mb-2 pl-1 text-base font-semibold text-gray-700">Discount:</label>
                  <input
                    type="text"
                    id="discount"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    className={`text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white ${!editing ? 'cursor-not-allowed' : ''}`}
                    disabled={!editing}
                  />
                </div>

                {/* YouTube Video Link */}
                <div className="flex flex-col">
                  <label htmlFor="youtubeVideo" className="mb-2 pl-1 text-base font-semibold text-gray-700">YouTube Video (Embeded Link):</label>
                  <textarea
                    id="youtubeVideo"
                    name="youtubeVideoLink"
                    value={formData.youtubeVideoLink}
                    onChange={handleInputChange}
                    placeholder='Add (&autoplay=1&mute=1) for autoplay youtube video and also mute by default on website.'
                    className={`text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white ${!editing ? 'cursor-not-allowed' : ''}`}
                    disabled={!editing}
                  />
                </div>

                {/* Short Description */}
                <div className="flex flex-col">
                  <label htmlFor="shortDescription" className="mb-2 pl-1 text-base font-semibold text-gray-700">Short Description:*</label>
                  <textarea
                    id="shortDescription"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={(e) => handleInputChange(e, null, null, 150)} // Limit to 150 characters
                    maxLength={150} // Optional, provides additional browser-level restriction
                    className={`text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white ${!editing ? 'cursor-not-allowed' : ''}`}
                    disabled={!editing}
                  />
                  <small className="text-gray-500 mt-1">
                    {150 - formData.shortDescription.length} characters remaining
                  </small>
                </div>

                {/* Category */}
                {/* <div className="flex flex-col">
                  <label htmlFor="category" className="mb-2 pl-1 text-base font-semibold text-gray-700">Category:*</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white ${!editing ? 'cursor-not-allowed' : ''}`}
                    disabled={!editing}
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
                  <label className="mb-2 pl-1 text-base font-semibold text-gray-700">Category:*</label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => (
                      <div key={cat._id} className="flex items-center gap-2 text-gray-700 px-3 py-2 rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          id={`category-${cat._id}`}
                          name="category"
                          value={cat.name}
                          checked={formData.category.includes(cat.name)}
                          onChange={(e) => handleCheckboxChange(e, cat.name)}
                          className={`accent-white ${!editing ? 'cursor-not-allowed' : ''}`}
                          disabled={!editing}
                        />
                        <span className={`text-sm font-heading ${!editing ? 'cursor-not-allowed' : ''}`} disabled={!editing}>{cat.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Long Description */}
                <div className="flex flex-col md:col-span-3">
                  <label htmlFor="description" className="mb-2 pl-1 text-base font-semibold text-gray-700">Long Description:*</label>
                  <textarea
                    id="longDescription"
                    name="longDescription"
                    value={formData.longDescription}
                    onChange={handleInputChange}
                    className={`text-sm text-gray-500 pl-3 pr-5 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white ${!editing ? 'cursor-not-allowed' : ''}`}
                    disabled={!editing}
                  />
                </div>

                {/* New Image Upload */}
                <div className="flex flex-col md:col-span-3">
                  <label htmlFor="images" className="mb-3 pl-1 text-base font-semibold text-gray-700">New Product Images:</label>
                  <div className="relative">
                    <label className="w-full py-2 rounded-lg border border-gray-300 rounded-lg-lg flex items-center bg-white cursor-pointer pl-3 pr-5 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent">
                      <input onChange={handleImageChange} type="file" id="images" name="images" className="hidden" multiple disabled={!editing} />
                      <span className={`text-gray-400 ${!editing ? 'cursor-not-allowed' : ''}`} >{newImages.length > 0 ? `${newImages.length} images selected` : 'Select New Product Images'}</span>
                    </label>
                  </div>

                  {/* Preview New Images */}
                  <div className="mt-5 mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                    {newImages.map((image, index) => (
                      <div key={index} className="relative w-full h-full bg-gray-100 border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out">
                        <img src={URL.createObjectURL(image)} alt="New Product" className="flex object-fit w-full h-full" />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-1 right-1 bg-gray-300 text-slate-700 p-0.5 rounded-lg w-4 sm:w-5 h-4 sm:h-5 text-xs sm:text-sm hover:font-semibold flex items-center justify-center hover:bg-gray-200 ease-in-out"
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </form>

              {/* Existing Images Section */}
              <div>
                <label htmlFor="images" className="mb-3 pl-1 text-base font-bold text-gray-700">Existing Product Images:</label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                  {formData.images.length > 0 ? (
                    formData.images.map((image, index) => {

                      const imagePaths =
                        image && image.imagePath
                          ? image.imagePath
                          // ? `${apiUrl}/uploads/product_images/${image.imageName}`
                          : "https://res.cloudinary.com/dzmjsrpdp/image/upload/v1732013415/image-not-available_jrcuh6.png";

                      return (
                        <div key={index} className="relative w-full h-full mt-5 bg-gray-100 border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out">
                          <img src={imagePaths} alt="Product Image" className="flex object-fit w-full h-full" />
                          <button
                            type="button"
                            className={`absolute top-1 right-1 bg-gray-300 text-slate-700 p-0.5 rounded-lg w-4 sm:w-5 h-4 sm:h-5 text-xs sm:text-sm hover:font-semibold flex items-center justify-center hover:bg-gray-200 ease-in-out ${!editing ? 'cursor-not-allowed hover:bg-gray-300 hover:font-normal' : ''}`}
                            disabled={!editing}
                            onClick={() => removeExistingImage(index)}
                          >
                            x
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500">No images available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UpdateProduct;
