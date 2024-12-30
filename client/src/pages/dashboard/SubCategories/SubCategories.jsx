import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../Constants/Topbar.jsx';
import Sidebar from '../Constants/Sidebar.jsx';
import api from '../../../api/api.js';
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../redux/reduxSlice.jsx";
import Loader from "../../../components/Loader/Loader.jsx";

function Categories() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => { setIsSidebarOpen(!isSidebarOpen); };
  const closeSidebar = () => { setIsSidebarOpen(false); };
  const [fetchCategoriesData, setfetchCategoriesData] = useState([]);
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
        setfetchCategoriesData(response.data);
        setError(null);
      } catch (error) {
        console.log("Error fetching categories: ", error);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchCategories();
  }, [dispatch]);

  const addCategory = async () => {
    navigate('/dashboard/sub_categories/add_category');
  };

  const handleEdit = (row) => {
    const categoryId = row._id;
    navigate(`/dashboard/sub_categories/update_category/${categoryId}`);
  };

  const handleDelete = async (CategoryId) => {
    dispatch(setLoading(true));

    // Define a timeout for 3 minutes
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out, Please try again later.")), 1 * 60 * 1000)
    );

    try {
      const response = await Promise.race([
        api.delete('/api/deleteCategory', { params: { CategoryId } }),
        timeoutPromise,
      ]);
      setfetchCategoriesData(fetchCategoriesData.filter(category => category.categoryId !== CategoryId));
      toast.success(response.data.message);
      setError(null);

      const reFetchCategories = await Promise.race([
        api.get('/api/fetchCategories'),
        timeoutPromise,
      ]);
      setfetchCategoriesData(reFetchCategories.data);
      setError(null);
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Error deleting category, Please try again later.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="relative top-24 left-0 w-full h-full">
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
        theme="colored"
      />

      {loading && <Loader />}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 z-50 left-0 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
      </div>

      {/* Main */}
      <main className="ease-soft-in-out xl:ml-68.5 relative h-full transition-all duration-200 bg-light">
        {/* Topbar */}
        <Topbar toggleSidebar={toggleSidebar} />

        {/* Table Section */}
        <div className="w-full px-6 py-6 mx-auto">
          <div className="flex-none w-full max-w-full px-3">
          {!loading && !error && (
            <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 border-transparent border-solid shadow-soft-xl rounded-2xl bg-clip-border">
              <div className="flex justify-between items-center p-6 pb-0 mb-3 bg-white border-b-0 border-b-solid rounded-t-2xl border-b-transparent">
                <h6 className="text-xl font-semibold">Sub-Categories</h6>

                <button className="text-sm font-semibold text-white bg-[#2f456a] px-5 py-2 rounded-lg hover:bg-[#1d2c44] hover:shadow-lg transform hover:scale-105 transition-transform duration-300" onClick={addCategory}>
                  Add Sub-Category
                </button>
              </div>

              <div className="flex-auto px-0 pt-0 pb-2">
                <div className="p-0 overflow-x-auto">
                  <DataTable
                    columns={[
                      {
                        name: 'Image',
                        selector: row => {
                          const categoryImage = row.image && row.image[0]?.imageName && row.image[0]?.imagePath
                            ? `${row.image[0]?.imagePath}`
                            : null;
                      
                          return (
                            <div className="flex justify-center items-center">
                              {categoryImage ? (
                                <img
                                  src={categoryImage}
                                  alt="Category Image"
                                  className="h-10 w-10 rounded-full"
                                />
                              ) : (
                                <span className="text-gray-700 text-sm">No Image</span>
                              )}
                            </div>
                          );
                        },
                        sortable: false,
                        center: true,
                      },                      
                      {
                        name: 'Name',
                        selector: row => row.name,
                        sortable: true,
                        wrap: true,
                      },
                      {
                        name: 'Description',
                        selector: row => row.description && row.description.length > 0 ? row.description[0] : 'N/A',
                        sortable: true
                      },
                      {
                        name: 'Date Added',
                        // selector: row => row.dateAdded ? new Date(row.dateAdded).toLocaleDateString() : 'No Date',                      
                        selector: row => new Date(row.dateAdded).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: true, // This makes it 12-hour format (AM/PM). Set to false for 24-hour format.
                        }),
                        sortable: true,
                        wrap: true,
                      },
                      {
                        name: 'Actions',
                        cell: row => (
                          <div className="flex justify-center space-x-4">
                            <button className="hover:text-blue-800 hover:font-semibold" onClick={() => handleEdit(row)}>
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button className="hover:text-rose-800 hover:font-extrabold" onClick={() => handleDelete(row._id)}>
                              <FontAwesomeIcon icon={faTrashCan} />
                            </button>
                          </div>
                        ),
                        sortable: true,
                        center: true.toString(),
                        wrap: true,
                      }
                    ]}
                    customStyles={{
                      headCells: {
                        style: {
                          fontWeight: 'bold',
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          backgroundColor: '#e8e8e8',
                        },
                      },
                      rows: {
                        style: {
                          minHeight: '50px',
                          '&:not(:last-of-type)': {
                            borderBottomStyle: 'solid',
                            borderBottomWidth: '1px',
                            borderBottomColor: '#d1d1d1',
                          },
                          '&:hover': {
                            backgroundColor: '#f1f1f1',
                          },
                        },
                      },
                      pagination: {
                        style: {
                          borderTopStyle: 'solid',
                          borderTopWidth: '1px',
                          borderTopColor: '#d1d1d1',
                        },
                      },
                    }}
                    data={fetchCategoriesData}
                    fixedHeader
                    fixedHeaderScrollHeight="450px"
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 30, 50, 100]}
                  />
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </main>
    </div>
  )
};

export default Categories;
