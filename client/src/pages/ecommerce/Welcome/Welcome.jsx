import React, {useState, useEffect} from 'react';
import { motion } from "framer-motion";
import { Link, useNavigate } from 'react-router-dom';

const Welcome = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserInfo(storedUser);
    }
  }, []);

  const handleMyOrders = () => {
    if (userInfo.email) {
      const userEmail = userInfo.email;
      navigate(`/orderdetails/${userEmail}`);
    } else {
      console.error("User email is not defined");
    }
  };

  return (
    <div>
      <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-6 px-5 py-10 md:px:0"
        >
          <h2 className="text-3xl font-semibold text-gray-800">
            Welcome to Our Store!
          </h2>
          <p className="text-gray-600 text-center max-w-md">
            We’re excited to have you here. Discover our wide range of products and find what you’re looking for. Dive in and start exploring!
          </p>
          <Link to="/products">
            <button className="px-8 py-3 bg-[#7b246d] text-white rounded-lg hover:bg-black transition duration-300">
              Start Exploring
            </button>
          </Link>

          <p className="text-gray-500 text-center max-w-md mt-1">
            Already placed an order? You can check your order status by clicking on the user icon in the top right corner. In the dropdown menu, select <strong><span className='cursor-pointer' onClick={handleMyOrders}>Manage Orders</span></strong> to view your current and past orders.
          </p>
        </motion.div>
    </div>
  );
};

export default Welcome;
