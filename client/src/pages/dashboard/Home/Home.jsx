import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../Constants/Topbar.jsx';
import Sidebar from '../Constants/Sidebar.jsx';
import api from '../../../api/api.js';
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashCan } from '@fortawesome/free-regular-svg-icons';
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

    // Fetch logged-in user data
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
                theme='colored'
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

                <div>Hi, {name}</div>
                <div>Welcome back to Buyvo Admin Dashboard!</div>

            </main>
        </div>
    )
}

export default Home;
