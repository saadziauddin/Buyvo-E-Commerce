import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import FormatPrice from "../../../helpers/FormatPrice";
import MasterCardImg from "/Images/MasterCard.svg";
import VisaCardImg from "/Images/VisaCard.svg";
import UnionPayImg from "/Images/UnionPay.svg";
import OnlinePayGif from "/Images/payment.gif";
import api from '../../../api/api.js';
import { resetCart, setShippingCharge, setLoading } from "../../../redux/reduxSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/Loader/Loader";

function CheckoutForm() {
    const { selectedCurrency } = useOutletContext();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contactNo: "",
        shippingAddress: "",
        billingAddress: "",
        city: "",
        postalCode: "",
        country: "",
        notes: "",
    });
    const dispatch = useDispatch();
    const products = useSelector((state) => state.reduxReducer.products);
    const shippingCharge = useSelector((state) => state.reduxReducer.shippingCharge);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const loading = useSelector((state) => state.reduxReducer.loading);
    const [error, setError] = useState(null);

    useEffect(() => {
        dispatch(setShippingCharge(0));
    }, [dispatch]);

    // useEffect(() => {
    //   if (totalAmt > 0 && totalAmt < 50) {
    //     // Example: Apply shipping charge only for total amount below $50
    //     dispatch(setShippingCharge(10)); // Or any logic for dynamic calculation
    //   } else {
    //     dispatch(setShippingCharge(0)); // Free shipping for larger orders
    //   }
    // }, [totalAmt, dispatch]);

    const totalAmt = products.reduce((total, item) => total + item.price * item.quantity, 0);
    const grandTotal = totalAmt + shippingCharge;

    const [paymentMethod, setPaymentMethod] = useState("onlinePayment");
    const [isCODAllowed, setIsCODAllowed] = useState(true);
    const [isOnlinePaymentAllowed, setIsOnlinePaymentAllowed] = useState(true);

    useEffect(() => {
        const hasStitched = products.some(item => item.category === "Stitched");
        const hasUnstitched = products.some(item => item.category === "Unstitched");
        const hasOtherCategories = products.some(item => item.category !== "Unstitched" && item.category !== "Stitched");

        if (!hasUnstitched && hasStitched && !hasOtherCategories) {
            // Only Unstitched products are present
            setIsCODAllowed(false);
            setIsOnlinePaymentAllowed(true);
            setPaymentMethod("onlinePayment");
        } else {
            // COD is allowed when there are Stitched, or Other, or a mix of categories
            setIsCODAllowed(true);
            setIsOnlinePaymentAllowed(true);
            setPaymentMethod("onlinePayment");
        }
    }, [products]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.name) newErrors.name = "Name is required.";
        if (!formData.email || !emailRegex.test(formData.email)) newErrors.email = "Valid email is required.";
        if (!formData.contactNo) newErrors.contactNo = "Contact number is required.";
        if (!formData.shippingAddress) newErrors.shippingAddress = "Shipping address is required.";
        if (!formData.billingAddress) newErrors.billingAddress = "Billing address is required.";
        if (!formData.city) newErrors.city = "City is required.";
        if (!formData.country) newErrors.country = "Country is required.";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length === 0) {
            setErrors({});
            dispatch(setLoading(true));

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Request timed out. Please try again later.")), 1 * 60 * 1000)
            );
            
            const paymentMethodForDB = paymentMethod === "onlinePayment" ? "Online Payment" : "Cash On Delivery";

            const orderData = {
                user: formData.email,
                products: products.map(item => ({
                    productId: item.id.split('-')[0],
                    productImg: item.image,
                    productName: item.name,
                    quantity: item.quantity,
                    color: item.color,
                    size: item.size,
                    price: item.price * item.quantity,
                    totalAmount: totalAmt
                })),
                grandTotal: grandTotal,
                userInfo: {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.contactNo,
                    shippingAddress: formData.shippingAddress,
                    billingAddress: formData.billingAddress,
                    city: formData.city,
                    country: formData.country,
                    postalCode: formData.postalCode,
                    additionalNotes: formData.notes
                },
                paymentInfo: {
                    transactionId: '',
                    paymentMethod: paymentMethodForDB
                },
                paymentStatus: 'Pending',
                orderStatus: 'Pending'
            };

            try {
                const response = await Promise.race([
                    api.post('/api/orders/newOrder', orderData, {
                        headers: { 'Content-Type': 'application/json' }
                    }),
                    timeoutPromise,
                ])
                const orderId = response.data.orderId;

                if (response.status === 201) {
                    toast.success('Order successfully placed!');
                    dispatch(resetCart());
                    setError(null);

                    if (paymentMethod === "onlinePayment") {
                        navigate('/paymentgateway');
                    } else {
                        navigate('/thankyou', { state: { orderId } });
                    }
                } else {
                    throw new Error("Failed to submit order.");
                }
            } catch (error) {
                console.error("Order submission error:", error.message || error);
                toast.error("Failed to place the order, Please try again later.");
                setError(error.message || "Failed to place the order, Please try again later.");
            } finally {
                dispatch(setLoading(false));
            }
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <div className="max-w-container mx-auto px-4 py-6 lg:px-6 lg:py-10">
            <Breadcrumbs title="Checkout Form" />
            {loading && <Loader />}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side: Checkout Form */}
                <div className="lg:col-span-2 bg-white p-6 rounded-md shadow-md">
                    <h2 className="text-2xl font-bold mb-5 text-gray-700">Order Information</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Input Fields */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="sr-only">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`border w-full p-3 rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-[#7b246d]`}
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label htmlFor="email" className="sr-only">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`border w-full p-3 rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-[#7b246d]`}
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label htmlFor="contactNo" className="sr-only">Contact Number</label>
                                <input
                                    type="tel"
                                    id="contactNo"
                                    name="contactNo"
                                    placeholder="Contact Number"
                                    value={formData.contactNo}
                                    onChange={handleChange}
                                    className={`border w-full p-3 rounded-lg ${errors.contactNo ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-[#7b246d]`}
                                />
                                {errors.contactNo && <p className="text-red-500 text-sm mt-1">{errors.contactNo}</p>}
                            </div>
                            <div>
                                <label htmlFor="shippingAddress" className="sr-only">Shipping Address</label>
                                <input
                                    type="text"
                                    id="shippingAddress"
                                    name="shippingAddress"
                                    placeholder="Shipping Address"
                                    value={formData.shippingAddress}
                                    onChange={handleChange}
                                    className={`border w-full p-3 rounded-lg ${errors.shippingAddress ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-[#7b246d]`}
                                />
                                {errors.shippingAddress && <p className="text-red-500 text-sm mt-1">{errors.shippingAddress}</p>}
                            </div>
                            <div>
                                <label htmlFor="billingAddress" className="sr-only">Billing Address</label>
                                <input
                                    type="text"
                                    id="billingAddress"
                                    name="billingAddress"
                                    placeholder="Billing Address"
                                    value={formData.billingAddress}
                                    onChange={handleChange}
                                    className={`border w-full p-3 rounded-lg ${errors.billingAddress ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-[#7b246d]`}
                                />
                                {errors.billingAddress && <p className="text-red-500 text-sm mt-1">{errors.billingAddress}</p>}
                            </div>
                            <div>
                                <label htmlFor="city" className="sr-only">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className={`border w-full p-3 rounded-lg ${errors.city ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-[#7b246d]`}
                                />
                                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                            </div>
                            <div>
                                <label htmlFor="country" className="sr-only">Country</label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    placeholder="Country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className={`border w-full p-3 rounded-lg ${errors.country ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-[#7b246d]`}
                                />
                                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                            </div>
                            <div>
                                <label htmlFor="postalCode" className="sr-only">Postal Code (Optional)</label>
                                <input
                                    type="text"
                                    id="postalCode"
                                    name="postalCode"
                                    placeholder="Postal Code (Optional)"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    className={`border w-full p-3 rounded-lg ${errors.postalCode ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-[#7b246d]`}
                                />
                                {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                            </div>
                        </div>

                        {/* Payment Options */}
                        <div className="space-y-4 mt-6">
                            <h3 className="text-xl font-semibold text-gray-700">Payment Method</h3>
                            <p className="text-gray-500 text-sm mb-2">Choose a payment option below:</p>

                            {/* Online Payment */}
                            <div className={`border p-4 rounded-md cursor-pointer ${paymentMethod === "onlinePayment" ? "border-[#7b246d]" : "border-gray-300"}`}>
                                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                                    <div className="flex items-center mb-4 lg:mb-0">
                                        <input
                                            type="radio"
                                            id="onlinePayment"
                                            name="paymentMethod"
                                            value="onlinePayment"
                                            checked={paymentMethod === "onlinePayment"}
                                            disabled={!isOnlinePaymentAllowed}
                                            onChange={() => setPaymentMethod("onlinePayment")}
                                            className="form-radio h-5 w-5 text-[#7b246d] accent-[#b63aa2] border-gray-300 mr-2"
                                        />
                                        <label htmlFor="onlinePayment" className="font-heading text-xs lg:text-[15px] text-gray-700 cursor-pointer">
                                            Pay via Debit/Credit/Wallet
                                        </label>
                                    </div>
                                    <div className="flex  lg:gap-3 items-center mb-4 lg:mb-0">
                                        <img src={VisaCardImg} alt="Visa" className="w-8 lg:w-10" />
                                        <img src={MasterCardImg} alt="MasterCard" className="w-8 lg:w-10" />
                                        <img src={UnionPayImg} alt="UnionPay" className="w-8 lg:w-10" />
                                    </div>
                                </div>
                                {paymentMethod === "onlinePayment" && (
                                    <div className="text-gray-500 text-sm">
                                        <div className="flex justify-center">
                                            <img src={OnlinePayGif} alt="Online Payment" className="h-28 md:h-40" />
                                        </div>
                                        <p className="text-center text-xs sm:text-[13px] md:text-[14.5px] px-4 sm:px-10 md:px-20 lg:px-52">
                                            After clicking <b>“PROCEED TO PAYMENT”</b>, you will be redirected to our payment gateway (Pay via Debit/Credit/Wallet/Bank Account) to complete your purchase securely.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Cash on Delivery (if allowed) */}
                            {isCODAllowed && (
                                <div className={`border p-4 rounded-md cursor-pointer ${paymentMethod === "cod" ? "border-[#7b246d]" : "border-gray-300"}`}>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="cod"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={paymentMethod === "cod"}
                                            onChange={() => setPaymentMethod("cod")}
                                            className="form-radio h-5 w-5 text-[#7b246d] accent-[#b63aa2] border-gray-300 mr-2"
                                        />
                                        <label htmlFor="cod" className="font-heading text-xs lg:text-[15px] text-gray-700 cursor-pointer">
                                            Cash on Delivery
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Additional Notes */}
                        <div>
                            <label htmlFor="notes" className="sr-only">Additional Notes (Optional)</label>
                            <textarea
                                id="notes"
                                name="notes"
                                placeholder="Additional Notes (Optional)"
                                value={formData.notes}
                                onChange={handleChange}
                                className={`border w-full p-3 rounded-lg ${errors.notes ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-[#7b246d]`}
                                rows={4}
                            />
                        </div>

                        <button type="submit" className="w-full bg-[#7b246d] text-white font-heading py-3 rounded-lg hover:bg-[#5a1a52] transition duration-300 uppercase shadow-md hover:shadow-lg">
                            Proceed to Payment
                        </button>
                    </form>
                </div>

                {/* Right Side: Order Summary */}
                <div className="lg:col-span-1 bg-white p-6 rounded-md shadow-md">
                    <h2 className="text-2xl font-bold font-heading mb-6 text-gray-700">Order Summary</h2>
                    <div className="space-y-4">
                        {products.map((item, index) => (
                            <div key={item._id} className="flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                                    <div>
                                        <h4 className="font-medium font-heading">{item.name}</h4>
                                        <p className="text-sm text-gray-500">
                                            {(item.size && item.size !== 'null') || (item.color && item.color !== 'null')
                                                ? `${item.size && item.size !== 'null' ? item.size : 'N/A'} / ${item.color && item.color !== 'null' ? item.color : 'N/A'}`
                                                : 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="font-medium font-heading"><FormatPrice price={item.price * item.quantity} currency={selectedCurrency} /></p>
                            </div>
                        ))}
                        <hr className="my-4" />
                        <div className="flex justify-between">
                            <p className="font-semibold font-heading">Total:</p>
                            <p className="font-medium font-heading"><FormatPrice price={totalAmt} currency={selectedCurrency} /></p>
                        </div>
                        <div className="flex justify-between">
                            <p className="font-semibold font-heading">Shipping:</p>
                            {shippingCharge === 0 ? (
                                <span className="text-[17px] text-green-600">FREE</span>
                            ) : (
                                <p className="font-medium font-heading"><FormatPrice price={shippingCharge} currency={selectedCurrency} /></p>
                            )}
                        </div>
                        <div className="flex justify-between text-xl">
                            <p className="font-semibold font-heading">Grand Total:</p>
                            <p className="font-medium font-heading"><FormatPrice price={grandTotal} currency={selectedCurrency} /></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutForm;
