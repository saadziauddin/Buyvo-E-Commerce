import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../Constants/Topbar.jsx';
import Sidebar from '../Constants/Sidebar.jsx';
import api from '../../../api/api.js';
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../redux/reduxSlice";
import Loader from "../../../components/Loader/Loader";

function Orders() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => { setIsSidebarOpen(!isSidebarOpen); };
  const closeSidebar = () => { setIsSidebarOpen(false); };
  const [fetchOrdersData, setfetchOrdersData] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.reduxReducer.loading);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      dispatch(setLoading(true));

      // Define a timeout for 3 minutes
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out, Please try again later.")), 1 * 60 * 1000)
      );

      try {
        const response = await Promise.race([
          api.get('/api/orders/fetchOrders'),
          timeoutPromise,
        ]);
        setfetchOrdersData(response.data);
        setError(null);
      } catch (error) {
        console.log("Error fetching orders: ", error);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchOrders();
  }, [dispatch]);

  const handleDetails = (row) => {
    const orderId = row._id;
    navigate(`/dashboard/orders/order_details/${orderId}`);
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
            <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 border-transparent border-solid shadow-soft-xl rounded-2xl bg-clip-border">
              <div className="flex justify-between items-center p-6 pb-0 mb-3 bg-white border-b-0 border-b-solid rounded-t-2xl border-b-transparent">
                <h6 className="text-xl font-semibold">Orders</h6>
              </div>

              <div className="flex-auto px-0 pt-0 pb-2">
                <div className="p-0 overflow-x-auto">
                  <DataTable
                    columns={[
                      {
                        name: 'Order ID',
                        selector: row => row.orderId,
                        sortable: true,
                        wrap: true
                      },
                      {
                        name: 'User Email',
                        selector: row => row.user,
                        sortable: true,
                        wrap: true
                      },
                      {
                        name: 'User Exists',
                        selector: row => row.userExists ? 'Yes' : 'No',
                        sortable: true,
                        center: true
                      },
                      {
                        name: 'Products Ordered',
                        selector: row => row.products.reduce((total, product) => total + product.quantity, 0),
                        sortable: true,
                        center: true
                      },
                      {
                        name: 'Payment Method',
                        selector: row => row.paymentInfo?.paymentMethod || "No Payment Method",
                        sortable: true,
                        center: true
                      },
                      {
                        name: 'Payment Status',
                        selector: row => row.paymentStatus,
                        sortable: true,
                        center: true
                      },
                      {
                        name: 'Order Status',
                        selector: row => row.orderStatus,
                        sortable: true,
                        center: true
                      },
                      {
                        name: 'Order Created',
                        selector: row => new Intl.DateTimeFormat('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          second: 'numeric',
                        }).format(new Date(row.orderDate)),
                        sortable: true,
                        wrap: true
                      },
                      {
                        name: 'Actions',
                        cell: row => (
                          <div className="flex justify-center space-x-4">
                            <button className="hover:text-blue-800 hover:font-semibold" onClick={() => handleDetails(row)}>
                              <FontAwesomeIcon icon={faEye} /> View Details
                            </button>
                          </div>
                        ),
                        sortable: true,
                        center: true.toString(),
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
                    data={fetchOrdersData}
                    fixedHeader
                    fixedHeaderScrollHeight="450px"
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 30, 50, 100]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Orders;
