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

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [filled, setFilled] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.reduxReducer.loading);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFilled(email !== "" && password !== "");
  }, [email, password]);

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail("");
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(setLoading(true));

    // Define a timeout for 3 minutes
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out, Please try again later.")), 1 * 60 * 1000)
    );

    if (!email) {
      setErrEmail("Enter your email");
    }

    if (!password) {
      setErrPassword("Enter your password");
    }

    if (email && password) {
      try {
        const response = await Promise.race([
          api.post("/api/signin", { email, password }),
          timeoutPromise,
        ]);

        if (response.data.message === "Login Successfull!") {
          setEmail("");
          setPassword("");
          setError(null);

          const role = response.data.role;
          const userData = {
            userId: response.data.id,
            name: response.data.name,
            email: response.data.email,
            image: response.data.image,
            role: role
          };

          if (role === "Admin") {
            navigate("/dashboard/userManagement");
          }
          else if (role === "SubAdmin") {
            navigate("/dashboard/userManagement");
          }
          else if (role === "Client") {
            localStorage.setItem("user", JSON.stringify(userData));
            navigate("/welcome");
          }
          else {
            toast.error("Invalid Role!");
          }

        } else {
          toast.error(response.data.message);
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.error) {
          toast.error(err.response.data.error);
        } else {
          console.log("Internal server error: ", err.message || err);
          toast.error("Request failed during login, Please try again later.");
        }
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center overflow-hidden">
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

      <div className="hidden lgl:flex w-1/2 h-full items-center justify-center p-10">
        <LottieAnimation animationData={animationData} loop={true} autoplay={true} />
      </div>

      <div className="w-full lgl:w-1/2 h-full flex items-center justify-center px-4 overflow-y-auto">
        <form onSubmit={handleSubmit} className="w-full lgl:w-[450px] flex items-center justify-center">
          <div className="px-6 py-4 w-full flex flex-col justify-center">
            <h1 className="font-titleFont font-semibold text-3xl mdl:text-4xl mb-4">
              Sign in
            </h1>
            <div className="flex flex-col gap-3">
              {/* Email */}
              <div className="mb-0">
                <label className="text-gray-600 font-titleFont ml-2 mb-1 font-semibold">Email*</label>
                <div className="relative">
                  <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    onChange={handleEmail}
                    value={email}
                    className="pl-10 pr-3 py-2 border border-gray-300 w-full rounded-xl focus:outline-none focus:border-primeColor"
                    type="email"
                    name="email"
                    placeholder="abc@example.com"
                  />
                </div>
                {errEmail && (
                  <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                    <FontAwesomeIcon icon={faExclamationCircle} />
                    {errEmail}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="mb-0">
                <label className="text-gray-600 font-titleFont ml-2 mb-1 font-semibold">Password*</label>
                <div className="relative">
                  <FontAwesomeIcon icon={faLock} className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    onChange={handlePassword}
                    value={password}
                    className="pl-10 pr-3 py-2 border border-gray-300 w-full rounded-xl focus:outline-none focus:border-primeColor"
                    type="password"
                    name="password"
                    placeholder="********"
                  />
                </div>
                {errPassword && (
                  <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                    <FontAwesomeIcon icon={faExclamationCircle} />
                    {errPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className={`${filled
                  ? "bg-[#7b246d] hover:bg-slate-500 hover:text-white hover:border-none cursor-pointer"
                  : "bg-gray-500 hover:bg-gray-500 hover:text-white cursor-not-allowed"
                  } text-white py-2 w-full rounded-xl text-base font-medium duration-300`}
                disabled={!filled}
              >
                Sign in
              </button>

              <p className="text-gray-700 text-sm text-center w-full">
                <Link to="/reset" className="text-primeColor font-medium hover:text-blue-600 duration-300">
                  Forget password?
                </Link>
              </p>

              <p className="text-gray-700 text-sm text-center w-full">
                Don't have an Account?{' '}
                <Link to="/signup" className="text-primeColor font-medium hover:text-blue-600 duration-300">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
