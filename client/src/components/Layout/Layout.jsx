import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
// ================= Navbar =====================
import Navbar from "../../pages/ecommerce/Navbar/Navbar";
import NavbarBottom from "../../pages/ecommerce/Navbar/NavbarBottom";
// ================= Footer =====================
import Footer from "../../pages/ecommerce/Footer/Footer";
import FooterBottom from "../../pages/ecommerce/Footer/FooterBottom";
import './WhatsAppIcon.css';

const Layout = () => {
    const [currency, setCurrency] = useState("PKR");

    const handleCurrencyChange = (newCurrency) => {
        setCurrency(newCurrency);
    };

    return (
        <div>
            <ToastContainer
                position="top-right"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <Navbar onCurrencyChange={handleCurrencyChange} />
            <NavbarBottom />
            <Outlet context={{ selectedCurrency: currency }} />
            <Footer />
            <FooterBottom />
            {/* WhatsApp Floating Button */}
            <a href="https://wa.me/+923100122349" target="_blank" rel="noopener noreferrer" className="whatsapp-icon">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" />
            </a>
        </div>
    );
};

export default Layout;
