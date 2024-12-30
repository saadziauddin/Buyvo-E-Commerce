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

// ================= Privacy Policy =====================
import PrivacyPolicy from "./pages/ecommerce/PrivacyPolicy/PrivacyPolicy";

// ================= Dashboard ===================== //
// ================= Home =====================
import DashboardHome from "./pages/dashboard/Home/Home";

// ================= User Management =====================
import UserManagement from "./pages/dashboard/UserManagement/UserManagement";
import UserProfile from './pages/dashboard/UserManagement/UserProfile';

// ================= Categories =====================
import Categories from './pages/dashboard/Categories/Categories';
import AddCategory from "./pages/dashboard/Categories/AddCategory";
import UpdateCategory from './pages/dashboard/Categories/UpdateCategory';

// ================= Sub-Categories =====================
import SubCategories from './pages/dashboard/SubCategories/SubCategories';
import AddSubCategory from "./pages/dashboard/SubCategories/AddSubCategory";
import UpdateSubCategory from './pages/dashboard/SubCategories/UpdateSubCategory';

// ================= Products =====================
import Products from './pages/dashboard/Products/Products';
import AddProduct from "./pages/dashboard/Products/AddProduct";
import UpdateProduct from './pages/dashboard/Products/UpdateProduct';

// ================= Orders =====================
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
        <Route path="/payment_gateway" element={<><PageTitle title="Payment - Latest Fashion in Pakistan" /><Payment /></>} />
        <Route path="/order_details/:useremail" element={<><PageTitle title="Order Details - Latest Fashion in Pakistan" /><OrderDetailsForUser /></>} />
        <Route path="/thankyou" element={<><PageTitle title="Thankyou - Latest Fashion in Pakistan" /><Thankyou /></>} />
        <Route path="/welcome" element={<><PageTitle title="Welcome - Latest Fashion in Pakistan" /><Welcome /></>} />
      </Route>

      <Route path="/signin" element={<><PageTitle title="Sign In - Latest Fashion in Pakistan" /><SignIn /></>} />
      <Route path="/signup" element={<><PageTitle title="Sign Up - Latest Fashion in Pakistan" /><SignUp /></>} />
      <Route path="/reset" element={<><PageTitle title="Reset Password - Latest Fashion in Pakistan" /><Reset /></>} />
      <Route path="/signup/privacy_policy" element={<><PageTitle title="Privacy Policy - Latest Fashion in Pakistan" /><PrivacyPolicy /></>} />

      {/* Home */}
      <Route path="/dashboard/home" element={<><PageTitle title="Admin Dashboard - Buyvo" /><DashboardHome /></>} />

      {/* User Management */}
      <Route path="/dashboard/user_management" element={<><PageTitle title="User Management - Latest Fashion in Pakistan" /><UserManagement /></>} />
      <Route path="/dashboard/user_management/user_profile/:userId" element={<><PageTitle title="Edit User - Latest Fashion in Pakistan" /><UserProfile /></>} />
      <Route path="/dashboard/user_profile/:userId" element={<><PageTitle title="Edit Profile - Latest Fashion in Pakistan" /><UserProfile /></>} />
      <Route path="/edit_profile/:userId" element={<><PageTitle title="Edit Profile - Latest Fashion in Pakistan" /><UserProfile /></>} />

      {/* Categories */}
      <Route path="/dashboard/categories" element={<><PageTitle title="Categories - Latest Fashion in Pakistan" /><Categories /></>} />
      <Route path="/dashboard/categories/add_category" element={<><PageTitle title="Add Category - Latest Fashion in Pakistan" /><AddCategory /></>} />
      <Route path="/dashboard/categories/update_category/:categoryId" element={<><PageTitle title="Update Category - Latest Fashion in Pakistan" /><UpdateCategory /></>} />

      {/* Sub-Categories */}
      <Route path="/dashboard/sub_categories" element={<><PageTitle title="Sub-Categories - Latest Fashion in Pakistan" /><SubCategories /></>} />
      <Route path="/dashboard/sub_categories/add_category" element={<><PageTitle title="Add Sub-Category - Latest Fashion in Pakistan" /><AddSubCategory /></>} />
      <Route path="/dashboard/sub_categories/update_category/:categoryId" element={<><PageTitle title="Update Sub-Category - Latest Fashion in Pakistan" /><UpdateSubCategory /></>} />

      {/* Products */}
      <Route path="/dashboard/products" element={<><PageTitle title="Products" /><Products /></>} />
      <Route path="/dashboard/products/add_product" element={<><PageTitle title="Add Product - Latest Fashion in Pakistan" /><AddProduct /></>} />
      <Route path="/dashboard/products/update_product/:productId" element={<><PageTitle title="Update Product - Latest Fashion in Pakistan" /><UpdateProduct /></>} />

      {/* Orders */}
      <Route path="/dashboard/orders" element={<><PageTitle title="Orders - Latest Fashion in Pakistan" /><Orders /></>} />
      <Route path="/dashboard/orders/order_details/:orderId" element={<><PageTitle title="Order Details - Latest Fashion in Pakistan" /><OrderDetails /></>} />
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
