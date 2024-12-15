import React, { useEffect, useState } from 'react';
import { Link, useOutletContext, useParams } from "react-router-dom";
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTruck, FaBox, FaBan, FaShippingFast, FaTimesCircle } from 'react-icons/fa';
import FormatPrice from '../../../helpers/FormatPrice';
import api from '../../../api/api';
import { toast } from 'react-toastify';
import { setLoading } from "../../../redux/reduxSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/Loader/Loader";

const OrderDetails = () => {
  const { selectedCurrency } = useOutletContext();
  const [orders, setOrders] = useState([]);
  const { useremail } = useParams();
  const [showCancelReason, setShowCancelReason] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.reduxReducer.loading);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      dispatch(setLoading(true));

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out. Please try again later.")), 1 * 60 * 1000)
      );

      try {
        const response = await Promise.race([
          api.get(`/api/orders/fetchOrdersByEmail/${useremail}`),
          timeoutPromise,
        ])

        if (response.data && Array.isArray(response.data)) {
          setOrders(response.data);
          setError(null);
        } else {
          console.error('Fetched data is not in the expected format');
        }
      } catch (error) {
        console.error("Order submission error:",);
        toast.error("Error fetching orders, Please try again later.");
        setError(error.message || "Error fetching orders, Please try again later.");
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchOrders();
  }, [useremail, dispatch]);

  const getOrderStatus = (status) => {
    const orderStatuses = [
      { label: 'Pending', icon: <FaBox />, color: 'bg-gray-300', activeColor: 'bg-blue-500' },
      { label: 'Accepted', icon: <FaCheckCircle />, color: 'bg-gray-300', activeColor: 'bg-green-500', condition: 'accepted' },
      { label: 'Rejected', icon: <FaTimesCircle />, color: 'bg-gray-300', activeColor: 'bg-red-500', condition: 'rejected' },
      { label: 'Cancelled', icon: <FaBan />, color: 'bg-gray-300', activeColor: 'bg-gray-500', condition: 'cancelled' },
      { label: 'Processing', icon: <FaBox />, color: 'bg-gray-300', activeColor: 'bg-purple-500' },
      { label: 'Ready to Ship', icon: <FaShippingFast />, color: 'bg-gray-300', activeColor: 'bg-yellow-500' },
      { label: 'Shipped', icon: <FaTruck />, color: 'bg-gray-300', activeColor: 'bg-blue-500' },
      { label: 'Ready to Deliver', icon: <FaTruck />, color: 'bg-gray-300', activeColor: 'bg-teal-500' },
      { label: 'Delivered', icon: <FaCheckCircle />, color: 'bg-gray-300', activeColor: 'bg-green-500' },
    ];

    // Filter statuses based on current status
    if (status === 'accepted') {
      return orderStatuses.filter((stage) => !['Rejected', 'Cancelled'].includes(stage.label));
    } else if (status === 'rejected' || status === 'cancelled') {
      return [];
    } else {
      return orderStatuses.filter((stage) => !['Rejected', 'Cancelled'].includes(stage.label));
    }
  };

  const handleCancelOrderClick = (orderId) => {
    // Toggle selectedOrderId to show/hide the cancellation options for a specific order
    setSelectedOrderId((prevOrderId) => (prevOrderId === orderId ? null : orderId));
    setCancelReason(''); // Clear the reason when opening a new order's cancellation
  };

  const handleCancelOrder = async (orderId) => {
    if (!cancelReason) return;

    dispatch(setLoading(true));

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out. Please try again later.")), 1 * 60 * 1000)
    );

    try {
      await Promise.race([
        api.put(`/api/orders/updateOrderStatus/${orderId}`, {
          orderStatus: 'Cancelled',
          cancelledBy: 'Client',
          cancelReason: cancelReason
        }),
        timeoutPromise,
      ])
      setOrders((prevOrders) =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, orderStatus: 'Cancelled', cancelledBy: 'Client', cancelReason: cancelReason } : order
        )
      );
      // console.log(`Canceling order with ID: ${orderId} for reason: ${cancelReason}`);
      toast.success('Order has been Cancelled!');

      setShowCancelReason(false);

      setSelectedOrderId(null);

      setCancelReason('');

      setError(null);

    } catch (error) {
      console.error("Error updating order status: ", error.message || error);
      toast.error("Error cancelling orders, Please try again later.");
      setError(error.message || "Error cancelling orders, Please try again later.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-3xl font-heading font-semibold text-gray-800 mb-5">
        My Orders
      </h2>

      {loading && <Loader />}

      {error && <p className="text-red-500 text-center py-5">{error}</p>}

      {!loading && !error && (
        <>
        {orders.length === 0 ? (
            <p className="text-base md:text-lg font-heading font-medium text-center text-gray-600 py-3">No orders yet. Start shopping!</p>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <motion.div
                  key={order.orderId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
                >
                  {/* Order Info */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold font-heading text-gray-800 mb-2">
                        Order No. #{order.orderId}
                      </h3>
                      <p className="text-gray-600">
                        <span className="font-semibold">Placed on:</span> {new Date(order.orderDate).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          second: 'numeric',
                          hour12: true
                        })}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 font-heading">
                      <span className="text-base md:text-lg font-semibold text-gray-800">Grand Total: </span>
                      <FormatPrice price={order.grandTotal} currency={selectedCurrency} />
                    </div>
                  </div>

                  {/* Order Status Tracker */}
                  <div className="mt-4 p-4 bg-white">
                    <h4 className="text-lg md:text-xl font-semibold font-heading text-gray-700 mb-4">Order Status</h4>

                    {order.orderStatus === 'Rejected' ? (
                      <div className="flex justify-center text-center items-center space-x-2 text-red-600 py-3">
                        <FaTimesCircle className="text-base md:text-2xl" />
                        <span className="text-base md:text-lg font-heading font-semibold">Your order has been Rejected</span>
                      </div>
                    ) : order.orderStatus === 'Cancelled' ? (
                      <div className="flex justify-center text-center items-center space-x-2 text-gray-600 py-3">
                        <FaBan className="text-base md:text-2xl" />
                        <span className="text-base md:text-lg font-heading font-semibold">You cancelled this order!</span>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center space-x-2 font-heading">
                        <div className="flex overflow-x-auto pt-2 pb-4">
                          {getOrderStatus(order.orderStatus || 0).map((stage, index) => {
                            const isActive = index <= getOrderStatus(order.orderStatus).findIndex(s => s.label === order.orderStatus);
                            return (
                              <div key={index} className="flex items-center space-x-2 w-full">
                                <div className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full ${isActive ? stage.activeColor : stage.color} text-white text-lg md:text-xl shadow-md`}>
                                  {stage.icon}
                                </div>
                                <span className={`text-xs md:text-sm ${isActive ? 'text-gray-800 font-semibold' : 'text-gray-400'}`}>
                                  {stage.label}
                                </span>
                                {index < getOrderStatus(order.orderStatus).length - 1 && (
                                  <div className={`h-1 w-8 md:w-10 rounded-full ${isActive ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gray-300'}`} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Details */}
                  <div className="mt-6 space-y-4">
                    {(order.products || []).map((item) => (
                      <div key={item.productId} className="flex flex-col md:flex-row items-center md:justify-between bg-white p-4 border-b">

                        {/* Product Image and Details */}
                        <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4">

                          {/* Display Product Image */}
                          <img src={item.productImg} alt={item.productName} className="w-24 h-24 object-cover rounded-md border border-gray-200 mb-4 md:mb-0" />

                          {/* Product Details */}
                          <div className="text-center md:text-left">
                            <h4 className="font-heading font-semibold text-gray-800">{item.productName}</h4>

                            {/* Display Color, Size, and Quantity on mobile below the image */}
                            <div className="flex flex-col md:flex-row font-heading items-center md:items-center md:space-x-4 text-gray-700 text-sm mt-2 md:p-3 bg-gray-100 rounded-lg shadow-sm space-y-2 md:space-y-0">

                              {/* Color */}
                              <div className="flex items-center space-x-1 pt-2 md:pt-0">
                                <span className="font-semibold text-gray-800">Color:</span>
                                <span className="text-gray-600 px-2 py-1 rounded-lg bg-gray-200">
                                  {item.color ? item.color : "N/A"}
                                </span>
                              </div>

                              {/* Size */}
                              <div className="flex items-center space-x-1">
                                <span className="font-semibold text-gray-800">Size:</span>
                                <span className="text-gray-600 px-2 py-1 rounded-lg bg-gray-200">
                                  {item.size ? item.size : "N/A"}
                                </span>
                              </div>

                              {/* Quantity */}
                              <div className="flex items-center space-x-1 pb-2 md:pb-0">
                                <span className="font-semibold text-gray-800">Quantity:</span>
                                <span className="text-gray-600 px-2 py-1 rounded-lg bg-gray-200">
                                  {item.quantity}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Product Pricing */}
                        <div className="text-right mt-4 md:mt-0">
                          <span className="block font-heading text-gray-800">
                            <span className='font-semibold'>Price: </span><FormatPrice price={item.price} currency={selectedCurrency} />
                          </span>
                          <span className="block font-heading text-gray-800">
                            <span className='font-semibold'>Total: </span><FormatPrice price={item.totalAmount} currency={selectedCurrency} />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cancel Button */}
                  <div className="mt-6 flex flex-col md:flex-row justify-end items-center">
                    <button
                      className={`px-6 py-2 font-semibold rounded-md uppercase transition duration-300 mt-4 md:mt-0
                    ${(order.paymentInfo.paymentMethod === 'Cash On Delivery' && order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Rejected')
                          ? 'text-white bg-red-500 hover:bg-red-600'
                          : 'text-gray-400 bg-gray-300 cursor-not-allowed'
                        }`}
                      onClick={() => handleCancelOrderClick(order._id)}
                      disabled={order.paymentInfo.paymentMethod !== 'Cash On Delivery' || order.orderStatus === 'Cancelled'}
                    >
                      Cancel Order
                    </button>
                  </div>
                  {/* Confirm Cancellation */}
                  {selectedOrderId === order._id && (
                    <div className="mt-4 ml-3 w-full md:w-auto flex flex-col items-end">
                      <textarea
                        className="w-full p-2 border border-gray-300 focus:border-gray-500 rounded-md"
                        placeholder="Please provide a valid reason for cancellation"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        required
                      />
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className={`mt-2 w-full px-6 py-2 font-semibold rounded-md uppercase transition duration-300 ${cancelReason
                          ? 'text-white bg-red-500 hover:bg-red-600'
                          : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                          }`}
                        disabled={!cancelReason}
                      >
                        Confirm Cancellation
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )
        }
        </>
      )}
    </div>
  );
};

export default OrderDetails;
