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

// ================= Dashboard =====================
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
        <Route index element={<><PageTitle title="Nayab Fashion - Best Ecommerce Store in Pakistan" /><Home /></>} />
        <Route path="/products" element={<><PageTitle title="Nayab Fashion - Products" /><Product /></>} />
        <Route path="/about" element={<><PageTitle title="Nayab Fashion - About" /><About /></>} />
        <Route path="/contact" element={<><PageTitle title="Nayab Fashion - Contact" /><Contact /></>} />
        <Route path="/product/:id" element={<><PageTitle title="Nayab Fashion - Product Details" /><ProductDetails /></>} />
        <Route path="/cart" element={<><PageTitle title="Nayab Fashion - Cart" /><Cart /></>} />
        <Route path="/checkout" element={<><PageTitle title="Nayab Fashion - Checkout Form" /><CheckoutForm /></>} />
        <Route path="/paymentgateway" element={<><PageTitle title="Nayab Fashion - Payment" /><Payment /></>} />
        <Route path="/orderdetails/:useremail" element={<><PageTitle title="Nayab Fashion - Order Details" /><OrderDetailsForUser /></>} />
        <Route path="/thankyou" element={<><PageTitle title="Nayab Fashion - Thankyou" /><Thankyou /></>} />
        <Route path="/welcome" element={<><PageTitle title="Nayab Fashion - Welcome" /><Welcome /></>} />
      </Route>

      <Route path="/signin" element={<><PageTitle title="Nayab Fashion - Sign In" /><SignIn /></>} />
      <Route path="/signup" element={<><PageTitle title="Nayab Fashion - Sign Up" /><SignUp /></>} />
      <Route path="/reset" element={<><PageTitle title="Nayab Fashion - Reset Password" /><Reset /></>} />
      <Route path="/signup/privacy-policy" element={<><PageTitle title="Nayab Fashion - Privacy Policy" /><PrivacyPolicy /></>} />
      <Route path="/dashboard/userManagement" element={<><PageTitle title="Nayab Fashion - User Management" /><UserManagement /></>} />
      <Route path="/dashboard/userManagement/userProfile/:userId" element={<><PageTitle title="Nayab Fashion - Edit User" /><UserProfile /></>} />
      <Route path="/dashboard/userProfile/:userId" element={<><PageTitle title="Nayab Fashion - Edit Profile" /><UserProfile /></>} />
      <Route path="/editprofile/:userId" element={<><PageTitle title="Nayab Fashion - Edit Profile" /><UserProfile /></>} />
      <Route path="/dashboard/categories" element={<><PageTitle title="Nayab Fashion - Categories" /><Categories /></>} />
      <Route path="/dashboard/categories/addCategory" element={<><PageTitle title="Nayab Fashion - Add Category" /><AddCategory /></>} />
      <Route path="/dashboard/categories/updateCategory/:categoryId" element={<><PageTitle title="Nayab Fashion - Update Category" /><UpdateCategory /></>} />
      <Route path="/dashboard/products" element={<><PageTitle title="Nayab Fashion - Products" /><Products /></>} />
      <Route path="/dashboard/products/addProduct" element={<><PageTitle title="Nayab Fashion - Add Product" /><AddProduct /></>} />
      <Route path="/dashboard/products/updateProduct/:productId" element={<><PageTitle title="Nayab Fashion - Update Product" /><UpdateProduct /></>} />
      <Route path="/dashboard/orders" element={<><PageTitle title="Nayab Fashion - Orders" /><Orders /></>} />
      <Route path="/dashboard/orders/orderDetails/:orderId" element={<><PageTitle title="Nayab Fashion - Order Details" /><OrderDetails /></>} />
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
