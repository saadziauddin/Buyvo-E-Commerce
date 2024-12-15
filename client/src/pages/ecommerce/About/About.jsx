import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";

const About = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");

  useEffect(() => {
    if (location.state && location.state.data) {
      setPrevLocation(location.state.data);
    } else {
      setPrevLocation("Home");
    }
  }, [location]);

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="About Us" prevLocation={prevLocation} />
      <div className="pb-10">
        <h1 className="max-w-[1000px] text-base font-heading text-gray-800">
          Established in 2017, <b>Nayab Fashion</b> has become a trusted name in providing elegant, high-quality fashion that seamlessly blends traditional craftsmanship with contemporary design. Based in Pakistan, we pride ourselves on curating a diverse range of clothing that caters to discerning tastes both <b>locally</b> and <b>internationally</b>. Our commitment is to deliver exceptional pieces that embody style, comfort, and individuality. With a seamless online shopping experience and reliable courier partners like DHL, M&P, and FedEx, we ensure timely delivery and customer satisfaction, whether you’re in Pakistan, the UK, USA, or Europe. Discover fashion that speaks to your unique style at <b>Nayab Fashion</b>.
        </h1>
        <Link to="/products">
          <button className="w-48 h-11 xs:text-sm mt-6 bg-[#7b246d] text-white hover:bg-gray-700 rounded-lg font-semibold font-heading transition-all duration-300 uppercase">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
};

export default About;
