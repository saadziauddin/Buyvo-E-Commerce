import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route, Routes, useLocation } from "react-router-dom";
import { useDispatch, Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import { setLoading } from "./redux/reduxSlice";
import Layout from "./components/Layout/Layout";
import Loader from "./components/Loader/Loader";
import "react-toastify/dist/ReactToastify.css";

// ================= Website Home =====================
import Home from "./pages/ecommerce/Home/Home";
// ================= About =====================
import About from "./pages/ecommerce/About/About";
// ================= Contact =====================
import Contact from "./pages/ecommerce/Contact/Contact";
// ================= Cart =====================
import Cart from "./pages/ecommerce/Cart/Cart";
// ================= Checkout Form =====================
import CheckoutForm from "./pages/ecommerce/CheckoutForm/CheckoutForm";
// ================= Order Details (For Client) =====================
import OrderDetailsForUser from "./pages/ecommerce/OrderDetails/OrderDetails";
// ================= Payment =====================
import Payment from "./pages/ecommerce/payment/Payment";
// ================= Thankyou =====================
import Thankyou from "./pages/ecommerce/Thankyou/Thankyou";
// ================= Welcome =====================
import Welcome from "./pages/ecommerce/Welcome/Welcome";
// ================= Products =====================
import Product from "./pages/ecommerce/Products/Products";
import ProductDetails from "./pages/ecommerce/Products/ProductDetails";
// ================= Account =====================
import SignIn from "./pages/ecommerce/Account/SignIn";
import SignUp from "./pages/ecommerce/Account/SignUp";
import Reset from "./pages/ecommerce/Account/Reset";
import PrivacyPolicy from "./pages/ecommerce/PrivacyPolicy/PrivacyPolicy";

// ================= Dashboard 
// ================= Home =====================
import DashboardHome from "./pages/dashboard/Home/Home";
// ================= User management =====================
import UserManagement from "./pages/dashboard/UserManagement/UserManagement";
import UserProfile from './pages/dashboard/UserManagement/UserProfile';
// ================= Categories management =====================
import Categories from './pages/dashboard/Categories/Categories';
import AddCategory from "./pages/dashboard/Categories/AddCategory";
import UpdateCategory from './pages/dashboard/Categories/UpdateCategory';
// ================= Products management =====================
import Products from './pages/dashboard/Products/Products';
import AddProduct from "./pages/dashboard/Products/AddProduct";
import UpdateProduct from './pages/dashboard/Products/UpdateProduct';
// ================= Orders management (For Admins) =====================
import Orders from "./pages/dashboard/Orders/Orders";
import OrderDetails from "./pages/dashboard/Orders/OrderDetails";

// Handle page title dynamically
const PageTitle = ({ title }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return null;
};

// Routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* Website Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<><PageTitle title="Online Shopping Pakistan | Shoes and Clothing | Latest Fashion in Pakistan | Buyvo.com" /><Home /></>} />
        <Route path="/products" element={<><PageTitle title="Products - Latest Fashion in Pakistan" /><Product /></>} />
        <Route path="/about" element={<><PageTitle title="About - Latest Fashion in Pakistan" /><About /></>} />
        <Route path="/contact" element={<><PageTitle title="Contact - Latest Fashion in Pakistan" /><Contact /></>} />
        <Route path="/product/:id" element={<><PageTitle title="Product Details - Latest Fashion in Pakistan" /><ProductDetails /></>} />
        <Route path="/cart" element={<><PageTitle title="Cart - Latest Fashion in Pakistan" /><Cart /></>} />
        <Route path="/checkout" element={<><PageTitle title="Checkout Form - Latest Fashion in Pakistan" /><CheckoutForm /></>} />
        <Route path="/paymentgateway" element={<><PageTitle title="Payment - Latest Fashion in Pakistan" /><Payment /></>} />
        <Route path="/orderdetails/:useremail" element={<><PageTitle title="Order Details - Latest Fashion in Pakistan" /><OrderDetailsForUser /></>} />
        <Route path="/thankyou" element={<><PageTitle title="Thankyou - Latest Fashion in Pakistan" /><Thankyou /></>} />
        <Route path="/welcome" element={<><PageTitle title="Welcome - Latest Fashion in Pakistan" /><Welcome /></>} />
      </Route>

      <Route path="/signin" element={<><PageTitle title="Sign In - Latest Fashion in Pakistan" /><SignIn /></>} />
      <Route path="/signup" element={<><PageTitle title="Sign Up - Latest Fashion in Pakistan" /><SignUp /></>} />
      <Route path="/reset" element={<><PageTitle title="Reset Password - Latest Fashion in Pakistan" /><Reset /></>} />
      <Route path="/signup/privacy-policy" element={<><PageTitle title="Privacy Policy - Latest Fashion in Pakistan" /><PrivacyPolicy /></>} />

      
      <Route path="/dashboard/home" element={<><PageTitle title="Admin Dashboard - Buyvo" /><DashboardHome /></>} />
      <Route path="/dashboard/userManagement" element={<><PageTitle title="User Management - Latest Fashion in Pakistan" /><UserManagement /></>} />
      <Route path="/dashboard/userManagement/userProfile/:userId" element={<><PageTitle title="Edit User - Latest Fashion in Pakistan" /><UserProfile /></>} />
      <Route path="/dashboard/userProfile/:userId" element={<><PageTitle title="Edit Profile - Latest Fashion in Pakistan" /><UserProfile /></>} />
      <Route path="/editprofile/:userId" element={<><PageTitle title="Edit Profile - Latest Fashion in Pakistan" /><UserProfile /></>} />
      <Route path="/dashboard/categories" element={<><PageTitle title="Categories - Latest Fashion in Pakistan" /><Categories /></>} />
      <Route path="/dashboard/categories/addCategory" element={<><PageTitle title="Add Category - Latest Fashion in Pakistan" /><AddCategory /></>} />
      <Route path="/dashboard/categories/updateCategory/:categoryId" element={<><PageTitle title="Update Category - Latest Fashion in Pakistan" /><UpdateCategory /></>} />
      <Route path="/dashboard/products" element={<><PageTitle title="Products" /><Products /></>} />
      <Route path="/dashboard/products/addProduct" element={<><PageTitle title="Add Product - Latest Fashion in Pakistan" /><AddProduct /></>} />
      <Route path="/dashboard/products/updateProduct/:productId" element={<><PageTitle title="Update Product - Latest Fashion in Pakistan" /><UpdateProduct /></>} />
      <Route path="/dashboard/orders" element={<><PageTitle title="Orders - Latest Fashion in Pakistan" /><Orders /></>} />
      <Route path="/dashboard/orders/orderDetails/:orderId" element={<><PageTitle title="Order Details - Latest Fashion in Pakistan" /><OrderDetails /></>} />
    </Route>
  )
);

const AppWrapper = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    // Show loader during route changes
    dispatch(setLoading(true));
    const timeout = setTimeout(() => {
      dispatch(setLoading(false));
    }, 500); // Reduce delay for better UX

    return () => clearTimeout(timeout); // Cleanup timeout
  }, [location.pathname, dispatch]);

  return null;
};

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* Wrap AppWrapper inside RouterProvider */}
        <RouterProvider router={router}>
          <Loader />
          <AppWrapper />
        </RouterProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
