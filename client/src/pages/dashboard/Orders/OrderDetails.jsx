import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Topbar from '../Constants/Topbar.jsx';
import Sidebar from '../Constants/Sidebar.jsx';
import api from '../../../api/api.js';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faEdit, faReply } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../redux/reduxSlice";
import Loader from "../../../components/Loader/Loader";

function OrderDetails() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => { setIsSidebarOpen(!isSidebarOpen); };
    const closeSidebar = () => { setIsSidebarOpen(false); };
    const [fetchOrdersData, setfetchOrdersData] = useState({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const navigate = useNavigate();
    const { orderId } = useParams();
    const dropdownRef = useRef(null);
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.reduxReducer.loading);
    const [error, setError] = useState(null);

    const statusOptions = ['Pending', 'Cancelled', 'Processing', 'Ready to Ship', 'Shipped', 'Ready to Deliver', 'Delivered'];

    useEffect(() => {
        const fetchOrderById = async () => {
            dispatch(setLoading(true));
      
            // Define a timeout for 3 minutes
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Request timed out, Please try again later.")), 1 * 60 * 1000)
            );
      
            try {
                const response = await Promise.race([
                    api.get(`/api/orders/fetchOrderById/${orderId}`),
                    timeoutPromise,
                ]);
                setfetchOrdersData(response.data);
                setSelectedStatus(response.data.orderStatus);
                setError(null);
            } catch (error) {
                console.log("Error fetching orders: ", error);
                toast.error("Error fetching orders data.");
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchOrderById();
    }, [orderId, dispatch]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleDropdownToggle = () => {
        setIsDropdownOpen(prevState => !prevState);
    };

    const handleStatusUpdate = async (newStatus, successMessage) => {
        dispatch(setLoading(true));
  
        // Define a timeout for 3 minutes
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Request timed out, Please try again later.")), 1 * 60 * 1000)
        );
  
        try {
            await Promise.race([
                api.put(`/api/orders/updateOrderStatus/${orderId}`, { orderStatus: newStatus }),
                timeoutPromise,
            ]);
            setfetchOrdersData((prevData) => ({
                ...prevData,
                orderStatus: newStatus
            }));
            setSelectedStatus(newStatus);
            setIsDropdownOpen(false);
            setError(null);
            toast.success(successMessage);
        } catch (error) {
            console.error("Error updating order status: ", error);
            toast.error("Failed to update order status.");
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleAccept = () => handleStatusUpdate('Accepted', 'Order Accepted!');
    const handleReject = () => handleStatusUpdate('Rejected', 'Order Rejected');
    const handleStatusChange = (newStatus) => handleStatusUpdate(newStatus, `Order status updated to ${newStatus}`);
    const handleBack = () => navigate('/dashboard/orders');

    const formatValue = (value) => {
        return value === null || value === undefined || value === '' ? 'N/A' : value;
    };

    return (
        <div className="relative top-24 left-0 w-full h-full">
            <ToastContainer position="top-right" autoClose={2000} theme="colored" />

            {loading && <Loader />}
      
            {/* Sidebar */}
            <div className={`fixed inset-y-0 z-50 left-0 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
                <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
            </div>

            {/* Main */}
            <main className="ease-soft-in-out xl:ml-68.5 relative h-full transition-all duration-200 bg-light">
                <Topbar toggleSidebar={toggleSidebar} />

                <div className="w-full px-6 py-6 mx-auto">
                    <div className="bg-white shadow-soft-xl rounded-2xl p-6">
                        <h6 className="text-3xl text-center font-semibold font-heading mb-6 uppercase">Order Details</h6>

                        {/* User and Order Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className='font-heading'>
                                <h4 className="text-xl font-semibold text-gray-700 mb-3">Customer Information</h4>
                                <p><strong>Name:</strong> {formatValue(fetchOrdersData.userInfo?.name)}</p>
                                <p><strong>Email:</strong> {formatValue(fetchOrdersData.userInfo?.email)}</p>
                                <p><strong>Phone:</strong> {formatValue(fetchOrdersData.userInfo?.phone)}</p>
                                <p><strong>Shipping Address:</strong> {formatValue(fetchOrdersData.userInfo?.shippingAddress)}</p>
                                <p><strong>Billing Address:</strong> {formatValue(fetchOrdersData.userInfo?.billingAddress)}</p>
                                <p><strong>City:</strong> {formatValue(fetchOrdersData.userInfo?.city)}, {formatValue(fetchOrdersData.userInfo?.country)}</p>
                                <p><strong>Postal Code:</strong> {formatValue(fetchOrdersData.userInfo?.postalCode)}</p>
                                <p><strong>Additional Notes:</strong> {formatValue(fetchOrdersData.userInfo?.additionalNotes)}</p>
                            </div>


                            <div className='font-heading'>
                                <h4 className="text-xl font-semibold text-gray-700 mb-3">Order Information</h4>
                                <p><strong>Order ID:</strong> {formatValue(fetchOrdersData.orderId)}</p>
                                <p><strong>Order Date:</strong> {fetchOrdersData.orderDate ? new Date(fetchOrdersData.orderDate).toLocaleString() : 'N/A'}</p>
                                <p><strong>Payment Method:</strong> {formatValue(fetchOrdersData.paymentInfo?.paymentMethod)}</p>
                                <p><strong>Payment Status:</strong> {formatValue(fetchOrdersData.paymentStatus)}</p>
                                <p><strong>Order Status:</strong> {formatValue(fetchOrdersData.orderStatus)}</p>
                                <p><strong>Grand Total Amount:</strong> {fetchOrdersData.grandTotal ? `Rs. ${fetchOrdersData.grandTotal}` : 'N/A'}</p>
                            </div>


                            <div className='font-heading'>
                                <h4 className="text-xl font-semibold text-gray-700 mb-3">Cancellation</h4>
                                <p><strong>Cancelled by:</strong> {formatValue(fetchOrdersData.orderCancellation?.cancelledBy)}</p>
                                <p><strong>Cancel Reason:</strong> {formatValue(fetchOrdersData.orderCancellation?.cancelReason)}</p>
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="mt-6">
                            <h4 className="text-xl font-heading font-semibold text-gray-700 mb-3">Products</h4>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-sm">
                                    <thead>
                                        <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 uppercase text-xs font-semibold">
                                            <th className="py-3 px-4 text-left">Product Name</th>
                                            <th className="py-3 px-4 text-left">Quantity</th>
                                            <th className="py-3 px-4 text-left">Color</th>
                                            <th className="py-3 px-4 text-left">Size</th>
                                            <th className="py-3 px-4 text-left">Price</th>
                                            <th className="py-3 px-4 text-left">Total Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fetchOrdersData.products?.map((product) => (
                                            <tr key={product._id} className="border-b border-gray-200 text-sm">
                                                <td className="py-3 px-4">{formatValue(product.productName)}</td>
                                                <td className="py-3 px-4">{formatValue(product.quantity)}</td>
                                                <td className="py-3 px-4">{formatValue(product.color)}</td>
                                                <td className="py-3 px-4">{formatValue(product.size)}</td>
                                                <td className="py-3 px-4">Rs. {product.price ? product.price.toLocaleString() : 'N/A'}</td>
                                                <td className="py-3 px-4">Rs. {product.totalAmount ? product.totalAmount.toLocaleString() : 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-5 flex flex-col sm:flex-row justify-between items-center gap-4 flex-wrap">
                            <div className="flex justify-start w-full sm:w-auto">
                                <button
                                    onClick={handleBack}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-600 focus:outline-none"
                                >
                                    <FontAwesomeIcon icon={faReply} /> Back To Orders
                                </button>
                            </div>

                            <div className="relative flex gap-4 flex-wrap sm:flex-nowrap justify-end w-full sm:w-auto">
                                {/* Update Status Button */}
                                <button
                                    onClick={handleDropdownToggle}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-600 focus:outline-none"
                                >
                                    <FontAwesomeIcon icon={faEdit} /> Update Status
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div ref={dropdownRef} className="absolute left-0 mt-12 mb-10 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-10">
                                        <ul className="py-1 text-gray-700">
                                            {statusOptions.map((status) => (
                                                <li
                                                    key={status}
                                                    onClick={() => handleStatusChange(status)}
                                                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${selectedStatus === status ? 'bg-gray-200 font-semibold' : ''}`}
                                                >
                                                    {status}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Accept Button */}
                                <button
                                    onClick={handleAccept}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
                                >
                                    <FontAwesomeIcon icon={faCheck} /> Accept
                                </button>

                                {/* Reject Button */}
                                <button
                                    onClick={handleReject}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
                                >
                                    <FontAwesomeIcon icon={faTimes} /> Reject
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OrderDetails;
