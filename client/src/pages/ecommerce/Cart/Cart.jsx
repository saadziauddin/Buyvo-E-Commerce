import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import { deleteItem, decreaseQuantity, increaseQuantity, setShippingCharge } from "../../../redux/reduxSlice";
import emptyCart from "/Images/EmptyCart.png";
import { ImCross } from "react-icons/im";
import FormatPrice from "../../../helpers/FormatPrice";

function Cart() {
  const { selectedCurrency } = useOutletContext();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.reduxReducer.products);

  const shippingCharge = useSelector((state) => state.reduxReducer.shippingCharge);

  useEffect(() => {
    dispatch(setShippingCharge(0));
  }, [dispatch]);

  const totalAmt = products.reduce((total, item) => total + item.price * item.quantity, 0);

  // useEffect(() => {
  //   if (totalAmt > 0 && totalAmt < 50) {
  //     // Example: Apply shipping charge only for total amount below $50
  //     dispatch(setShippingCharge(10)); // Or any logic for dynamic calculation
  //   } else {
  //     dispatch(setShippingCharge(0)); // Free shipping for larger orders
  //   }
  // }, [totalAmt, dispatch]);

  return (
    <div className="max-w-container mx-auto px-4 py-8">
      <Breadcrumbs title="Shopping Cart" />

      {products.length > 0 ? (
        <div className="pb-20">
          {/* Cart Items - Mobile */}
          <div className="lg:hidden flex flex-col gap-6 font-heading">
            {products.map((item) => (
              <div key={item._id} className="border border-gray-200 rounded-md shadow-md p-6 transition-transform transform">
                <div className="flex items-center gap-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-32 object-cover rounded-md cursor-pointer"
                  />
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold text-gray-800">{item.name || "N/A"}</h2>
                    <p className="text-md text-gray-500 mt-2">Size: {item.size || "N/A"}</p>
                    <p className="text-md text-gray-500 mt-2">Color: {item.color || "N/A"}</p>
                    <p className="text-lg font-bold text-gray-800 mt-2">
                      <FormatPrice price={item.price * item.quantity} currency={selectedCurrency} />
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => dispatch(decreaseQuantity({ id: item.id }))}
                      className="px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-300 transition duration-200"
                    >
                      -
                    </button>
                    <span className="font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => dispatch(increaseQuantity({ id: item.id }))}
                      className="px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-300 transition duration-200"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => dispatch(deleteItem({ id: item.id }))}
                    className="text-red-400 hover:text-red-600 transition duration-200"
                  >
                    <ImCross />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Items - Desktop */}
          <div className="hidden lg:block font-heading">
            <table className="min-w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="px-6 py-4 font-semibold text-gray-600 text-center">Image</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">Product Name</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">Size</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">Color</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">Price</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 text-center">Quantity</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">Subtotal</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 text-center">Remove</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => (
                  <tr key={item._id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-center">
                      <img src={item.image} alt={item.name} className="w-24 h-32 object-cover rounded-md cursor-pointer" />
                    </td>
                    <td className="px-6 py-4">{item.name || "N/A"}</td>
                    <td className="px-6 py-4">{item.size || "N/A"}</td>
                    <td className="px-6 py-4">{item.color || "N/A"}</td>
                    <td className="px-6 py-4"><FormatPrice price={item.price} currency={selectedCurrency} /></td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center space-x-2">
                        <button
                          onClick={() => dispatch(decreaseQuantity({ id: item.id }))}
                          className="px-2 py-1 bg-gray-100 rounded-md hover:bg-gray-300 transition"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => dispatch(increaseQuantity({ id: item.id }))}
                          className="px-2 py-1 bg-gray-100 rounded-md hover:bg-gray-300 transition"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4"><FormatPrice price={item.price * item.quantity} currency={selectedCurrency} /></td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => dispatch(deleteItem({ id: item.id }))}
                        className="text-red-400 hover:text-red-600 transition"
                      >
                        <ImCross />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cart Totals */}
          <div className="flex justify-end mt-8">
            <div className="w-full md:w-96 p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-md">
              <h2 className="text-2xl font-heading font-semibold text-gray-800 mb-4">Cart Totals</h2>
              <div className="space-y-3 font-heading">
                <p className="flex justify-between items-center text-gray-700">
                  <span className="font-medium">Subtotal</span>
                  <FormatPrice price={totalAmt} currency={selectedCurrency} />
                </p>
                <p className="flex justify-between items-center text-gray-700">
                  <span className="font-medium">Delivery Charges</span>
                  {shippingCharge === 0 ? (
                    <span className="text-[17px] text-green-600">FREE</span>
                  ) : (
                    <FormatPrice price={shippingCharge} currency={selectedCurrency} />
                  )}
                </p>
                <p className="flex justify-between items-center text-gray-900 text-lg font-bold">
                  <span>Total</span>
                  <FormatPrice price={totalAmt + shippingCharge} currency={selectedCurrency} />
                </p>
              </div>
              <Link to="/checkout" className="mt-6 block">
                <button className="w-full py-3 bg-[#7b246d] text-white text-[16px] font-titleFont font-semibold rounded-lg hover:bg-black uppercase transition duration-300">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-6 py-16"
        >
          <img src={emptyCart} alt="emptyCart" className="w-80" />
          <h2 className="text-2xl font-semibold font-heading text-gray-800">
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 font-heading">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link to="/products">
            <button className="px-8 py-3 bg-[#7b246d] text-white rounded-lg hover:bg-black uppercase transition duration-300">
              Start Shopping
            </button>
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default Cart;
