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
import UserDefaultImage from '/Images/DefaultImages/default_profile.png';

function UserManagement() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    // setIsSidebarOpen(!isSidebarOpen);
    setIsSidebarOpen(prevState => !prevState);
  };
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  const [fetchUsersData, setFetchUsersData] = useState([]);
  const [userRole, setUserRole] = useState('');
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
          setUserRole(result.data.role);
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

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      dispatch(setLoading(true));

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out, Please try again later.")), 1 * 60 * 1000)
      );

      try {
        const result = await Promise.race([
          api.get('/api/getUser'),
          timeoutPromise,
        ]);

        setError(null);
        setFetchUsersData(result.data);
      } catch (error) {
        console.log("Error fetching users:", error.message || error);
        setError("Error fetching users, Please try again later.");
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUsers();
  }, [dispatch]);

  const filteredUsersData = fetchUsersData.filter(user => {
    // If the logged-in user is SubAdmin, exclude administrators from the list
    if (userRole === 'SubAdmin') {
      return user.role !== 'Admin';
    }
    return true; // Otherwise, return all users
  });

  const addUser = async () => {
    navigate('/signup');
  };

  const handleEdit = (row) => {
    const userId = row._id;
    navigate(`/dashboard/user_management/user_profile/${userId}`);
  };

  const handleDelete = async (UserId) => {
    dispatch(setLoading(true));

    // Define a timeout for 3 minutes
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out, Please try again later.")), 1 * 60 * 1000)
    );

    try {
      const response = await Promise.race([
        api.delete('/api/deleteUser', { params: { UserId } }),
        timeoutPromise,
      ]);

      setError(null);
      setFetchUsersData(fetchUsersData.filter(user => user.UserId !== UserId));
      toast.success(response.data.message);

      const result = await Promise.race([
        api.get('/api/getUser'),
        timeoutPromise,
      ]);
      setError(null);
      setFetchUsersData(result.data);

    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

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

        {/* Table */}
        <div className="w-full px-6 py-6 mx-auto">
          <div className="flex-none w-full max-w-full px-3">
            {!loading && !error && (
              <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 border-transparent border-solid shadow-soft-xl rounded-2xl bg-clip-border">
                <div className="flex justify-between items-center p-6 pb-0 mb-3 bg-white border-b-0 border-b-solid rounded-t-2xl border-b-transparent">
                  <h6 className="text-xl font-semibold">User Management</h6>

                  <button className="text-sm font-semibold text-white bg-[#2f456a] px-5 py-2 rounded-lg hover:bg-[#1d2c44] hover:shadow-lg transform hover:scale-105 transition-transform duration-300" onClick={addUser}>
                    Add User
                  </button>
                </div>
                <div className="flex-auto px-0 pt-0 pb-2">
                  <div className="p-0 overflow-x-auto">
                    <DataTable
                      columns={[
                        {
                          name: 'Profile Image',
                          cell: row => {
                            const profileImage =
                              row.profileImage && row.profileImage[0] && row.profileImage[0].imagePath
                                ? `${row.profileImage[0]?.imagePath}`
                                : `${UserDefaultImage}`;

                            return (
                              <div>
                                <img
                                  src={profileImage}
                                  alt="User Image"
                                  className="h-10 w-10 rounded-full"
                                />
                              </div>
                            );
                          },
                          sortable: false,
                          center: true,
                          wrap: true,
                        },
                        {
                          name: 'Full name',
                          selector: row => row.fullName,
                          sortable: true,
                          wrap: true,
                        },
                        {
                          name: 'Email',
                          selector: row => row.email,
                          sortable: true,
                          wrap: true,
                        },
                        {
                          name: 'Contact No',
                          selector: row => row.contactNo,
                          sortable: true,
                          wrap: true,
                        },
                        {
                          name: 'Address',
                          selector: row => row.address,
                          sortable: true,
                          wrap: true,
                        },
                        {
                          name: 'City',
                          selector: row => row.city,
                          sortable: true,
                          wrap: true,
                        },
                        {
                          name: 'Country',
                          selector: row => row.country,
                          sortable: true,
                          wrap: true,
                        },
                        {
                          name: 'Zip/Postal Code',
                          selector: row => row.postalCode && row.postalCode.length > 0 && row.postalCode.toLowerCase() !== 'null' ? row.postalCode : 'N/A',
                          sortable: true,
                          wrap: true,
                        },
                        ...(userRole !== 'SubAdmin' ? [
                          {
                            name: 'Role',
                            selector: row => row.role,
                            sortable: true,
                            wrap: true,
                          }
                        ] : []),
                        ...(userRole !== 'SubAdmin' ? [
                          {
                            name: 'Date Created',
                            selector: row => new Date(row.dateOfCreation).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: true, // This makes it 12-hour format (AM/PM). Set to false for 24-hour format.
                            }),
                            sortable: true,
                            wrap: true,
                          },
                        ] : []),
                        {
                          name: 'Actions',
                          cell: row => (
                            <div className='flex justify-center space-x-4'>
                              <button className='hover:text-blue-800 hover:font-semibold' onClick={() => handleEdit(row)}><FontAwesomeIcon icon={faEdit} /></button>
                              <button className='hover:text-rose-800 hover:font-extrabold' onClick={() => handleDelete(row._id)}><FontAwesomeIcon icon={faTrashCan} /></button>
                            </div>
                          ),
                          sortable: false,
                          center: true,
                          wrap: true,
                        }
                      ]}
                      customStyles={{
                        headCells: {
                          style: {
                            fontWeight: 'bold',
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            backgroundColor: '#e8e8e8',
                          },
                        },
                        rows: {
                          style: {
                            minHeight: '50px',
                            '&:not(:last-of-type)': {
                              borderBottomStyle: 'solid',
                              borderBottomWidth: '1px',
                              borderBottomColor: '#d1d1d1',
                            },
                            '&:hover': {
                              backgroundColor: '#f1f1f1',
                            },
                          },
                        },
                        pagination: {
                          style: {
                            borderTopStyle: 'solid',
                            borderTopWidth: '1px',
                            borderTopColor: '#d1d1d1',
                          },
                        },
                      }}
                      data={filteredUsersData}
                      fixedHeader
                      fixedHeaderScrollHeight="400px"
                      pagination
                      paginationPerPage={10}
                      paginationRowsPerPageOptions={[10, 20, 50, 100]}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserManagement;
