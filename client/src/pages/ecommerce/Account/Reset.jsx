import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faExclamationCircle, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import api from "../../../api/api.js";
import LottieAnimation from "../../../animations/LottieAnimation.jsx";
import animationData from "../../../animations/LoginAnimation.json";
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../redux/reduxSlice";
import Loader from "../../../components/Loader/Loader";

function Reset() {
    const [values, setValues] = useState({ email: '', newPassword: '', confirmNewPassword: '' });
    const [errors, setErrors] = useState({});
    const [filled, setFilled] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.reduxReducer.loading);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkFilled = () => {
            const { email, newPassword, confirmNewPassword } = values;
            setFilled(email && (emailVerified ? (newPassword && confirmNewPassword) : email));
        };
        checkFilled();
    }, [values, emailVerified]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const handleEmailVerification = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));

        // Define a timeout for 3 minutes
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timed out, Please try again later.")), 1 * 60 * 1000)
        );

        const isValid = validateEmail();

        if (!isValid) return;

        try {
            const result = await Promise.race([
                api.post("/api/verifyEmail", { email: values.email }),
                timeoutPromise,
            ]);
            if (result.data.message === "Email verified successfully!") {
                setError(null);
                setEmailVerified(true);
            } else {
                toast.error(result.data.error);
            }
        } catch (err) {
            toast.error("Failed to verify email!");
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
    
        // Validate the passwords first
        const isValid = validatePassword();
    
        if (!isValid) {
            // Do not proceed if passwords are invalid
            return;
        }
    
        dispatch(setLoading(true)); // Show loader only after validation passes
    
        // Define a timeout for 3 minutes
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timed out, Please try again later.")), 1 * 60 * 1000)
        );
    
        try {
            const result = await Promise.race([
                api.post("/api/resetPassword", values),
                timeoutPromise,
            ]);
            if (result.data.message === "Password reset successfully!") {
                toast.success("Password reset successfully, Sign in now!");
                setError(null);
                setValues({
                    email: '',
                    newPassword: '',
                    confirmNewPassword: ''
                });
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                console.error("Request failed during reset password:", error);
                toast.error("Request failed during password reset!");
            }
        } finally {
            dispatch(setLoading(false));
        }
    };
    
    const validateEmail = () => {
        let errors = {};
        let isValid = true;

        if (!values.email) {
            errors.email = "Email is required";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = "Invalid email";
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const validatePassword = () => {
        let errors = {};
        let isValid = true;

        if (!values.newPassword) {
            errors.newPassword = "New Password is required";
            isValid = false;
        }
        else if (values.newPassword.length < 8 || !/(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}/.test(values.newPassword)) {
            errors.newPassword = "Password must be at least 8 characters long and include at least one uppercase letter and one number";
            isValid = false;
        }

        if (!values.confirmNewPassword) {
            errors.confirmNewPassword = "Confirm new password is required";
            isValid = false;
        } else if (values.confirmNewPassword !== values.newPassword) {
            errors.confirmNewPassword = "Passwords do not match";
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            {loading && <Loader />}

            <div className="hidden lgl:flex w-0 lgl:w-[50%] h-full items-center justify-center p-10">
                <LottieAnimation animationData={animationData} loop={true} autoplay={true} />
            </div>

            <div className="w-full lgl:w-1/2 h-full flex items-center justify-center">
                <form
                    onSubmit={emailVerified ? handlePasswordReset : handleEmailVerification}
                    className="w-full lgl:w-[450px] h-full flex items-center justify-center"
                >
                    <div className="px-6 py-4 w-full h-[90%] flex flex-col justify-center overflow-hidden scrollbar-thin scrollbar-thumb-primeColor">
                        <h1 className="font-titleFont font-semibold text-3xl mdl:text-4xl mb-4 text-center lgl:text-left">
                            {emailVerified ? "Reset Password" : "Verify Email"}
                        </h1>

                        <div className="flex flex-col gap-3">
                            {/* Email Input */}
                            <div className="mb-0">
                                <label className="text-gray-600 font-titleFont ml-2 mb-1 font-semibold">Email*</label>
                                <div className="relative">
                                    <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-3.5 text-gray-400" />
                                    <input
                                        onChange={handleChange}
                                        value={values.email}
                                        className={`pl-10 pr-3 py-2 border border-gray-300 w-full rounded-xl focus:outline-none focus:border-primeColor ${emailVerified ? 'cursor-not-allowed bg-gray-200' : ''}`}
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        disabled={emailVerified}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                                        <FontAwesomeIcon icon={faExclamationCircle} /> {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Show password fields only after email is verified */}
                            {emailVerified && (
                                <>
                                    {/* New Password */}
                                    <div className="mb-0">
                                        <label className="text-gray-600 font-titleFont ml-2 mb-1 font-semibold">New Password*</label>
                                        <div className="relative">
                                            <FontAwesomeIcon icon={faLock} className="absolute left-3 top-3.5 text-gray-400" />
                                            <input
                                                onChange={handleChange}
                                                value={values.newPassword}
                                                className="pl-10 pr-3 py-2 border border-gray-300 w-full rounded-xl focus:outline-none focus:border-primeColor"
                                                type="password"
                                                name="newPassword"
                                                placeholder="********"
                                            />
                                        </div>
                                        {errors.newPassword && (
                                            <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                                                <FontAwesomeIcon icon={faExclamationCircle} /> {errors.newPassword}
                                            </p>
                                        )}
                                    </div>

                                    {/* Confirm New Password */}
                                    <div className="mb-0">
                                        <label className="text-gray-600 font-titleFont ml-2 mb-1 font-semibold">Confirm New Password*</label>
                                        <div className="relative">
                                            <FontAwesomeIcon icon={faLock} className="absolute left-3 top-3.5 text-gray-400" />
                                            <input
                                                onChange={handleChange}
                                                value={values.confirmNewPassword}
                                                className="pl-10 pr-3 py-2 border border-gray-300 w-full rounded-xl focus:outline-none focus:border-primeColor"
                                                type="password"
                                                name="confirmNewPassword"
                                                placeholder="********"
                                            />
                                        </div>
                                        {errors.confirmNewPassword && (
                                            <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                                                <FontAwesomeIcon icon={faExclamationCircle} /> {errors.confirmNewPassword}
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}

                            <button
                                type="submit"
                                className={`${filled ? "bg-[#7b246d] hover:bg-slate-500 cursor-pointer" : "bg-gray-500 cursor-not-allowed"
                                    } text-white py-2 w-full rounded-xl text-base font-medium duration-300`}
                                disabled={!filled}
                            >
                                {emailVerified ? "Reset Password" : "Verify Email"}
                            </button>

                            <p className="text-gray-700 text-sm text-center w-full">
                                Back to sign in?{' '}
                                <Link to="/signin" className="text-primeColor font-medium hover:text-blue-600 duration-300">
                                    Click here
                                </Link>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Reset;
