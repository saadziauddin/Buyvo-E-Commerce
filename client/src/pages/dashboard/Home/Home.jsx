import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../Constants/Topbar.jsx';
import Sidebar from '../Constants/Sidebar.jsx';
import api from '../../../api/api.js';
import LottieAnimation from "../../../animations/LottieAnimation.jsx";
// import animationData from "../../../animations/DashboardAnimation2.json";
import animationData from "../../../animations/DashboardAnimationGoogle.json";
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../redux/reduxSlice";
import Loader from "../../../components/Loader/Loader";

const Home = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(prevState => !prevState);
    };
    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.reduxReducer.loading);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLoggedUser = async () => {
            dispatch(setLoading(true));

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Request timed out, Please try again later.")), 1 * 60 * 1000)
            );

            try {
                const result = await Promise.race([
                    api.get('/api/signin'),
                    timeoutPromise,
                ]);

                if (result.data.Status === "Success") {
                    setName(result.data.name);
                    setError(null);
                }
            } catch (error) {
                console.log("Error fetching logged-in user data:", error.message || error);
                setError("Error fetching logged-in user data, Please try again later.");
                navigate('/signin');
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchLoggedUser();
    }, [navigate, dispatch]);

    return (
        <div className="relative top-20 w-full h-screen bg-light ">
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
            <main className="relative flex flex-col items-center justify-center w-full h-full">
                {/* Topbar */}
                <Topbar toggleSidebar={toggleSidebar} />

                {/* Welcome Text */}
                <div className="absolute top-8 w-full text-center px-6 animate-fade-in">
                    <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 via-red-500 to-orange-500 bg-clip-text text-transparent tracking-tighter leading-tight drop-shadow-xl gradient-scroll animate-glow">
                        Welcome, {name}!
                    </h2>
                    <p className="mt-4 text-2xl font-light bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-md gradient-scroll">
                        Let's make today amazing.
                    </p>
                </div>

                {/* Lottie Animation */}
                <div className="flex items-center justify-center h-3/4 mt-16">
                    <LottieAnimation animationData={animationData} loop={true} autoplay={true} />
                </div>
            </main>
        </div>
    );
};

export default Home;
