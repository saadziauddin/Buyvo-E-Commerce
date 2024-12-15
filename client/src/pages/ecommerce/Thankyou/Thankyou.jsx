import React from 'react';
import { motion } from "framer-motion";
import { Link, useLocation } from 'react-router-dom';
import { FaShoppingBag } from 'react-icons/fa';

const ThankYou = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="relative flex items-center justify-center py-16">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-6 p-6 sm:p-10 md:p-12 lg:p-16 text-center rounded-lg bg-white bg-opacity-90 shadow-lg w-full max-w-md mx-4"
      >
        <h2 className="text-3xl md:text-4xl font-semibold font-heading text-gray-800">Thank You for Your Purchase!</h2>
        
        {orderId && (
          <p className="text-[15px] md:text-[17px] font-heading text-gray-700">
            Your Order ID is <span className="font-semibold text-gray-800">{orderId}</span>.
          </p>
        )}
        
        <p className="text-[15px] md:text-[17px] font-heading text-gray-700">
          We appreciate your trust in us. Your order has been received and is being processed. 
        </p>
        
        <p className="text-[15px] md:text-[17px] font-heading text-gray-700">
          Delivery will take approximately <span className="font-semibold text-gray-800">2 to 3 working days</span>.
          You’ll receive an email confirmation soon. Meanwhile, check out more items or get inspired!
        </p>
        
        <p className="text-[15px] md:text-[17px] font-heading text-gray-700">
          To view your order status or manage your orders, {" "}
          <Link to="/signin" className="text-[#7b246d] font-medium hover:underline">
            Sign in
          </Link> with the same email which you entered while ordering.
        </p>

        <Link to="/products">
          <button className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-[#7b246d] text-white rounded-lg hover:bg-[#5a1a52] transition duration-300 shadow-md hover:shadow-lg">
            <FaShoppingBag />
            Continue Shopping
          </button>
        </Link>
      </motion.div>
    </div>
  );
};

export default ThankYou;
