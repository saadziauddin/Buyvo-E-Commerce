import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaFacebook, FaYoutube, FaInstagram, FaWhatsapp, FaTiktok } from "react-icons/fa";
import paymentCard from "/Images/Payment.png";
import { Link, useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";

const Footer = () => {
  const [emailInfo, setEmailInfo] = useState("");
  const [subscription, setSubscription] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const emailValidation = () => {
    return String(emailInfo)
      .toLocaleLowerCase()
      .match(/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/);
  };

  const handleSubscription = () => {
    if (emailInfo === "") {
      setErrMsg("Please provide an Email !");
    } else if (!emailValidation(emailInfo)) {
      setErrMsg("Please give a valid Email!");
    } else {
      setSubscription(true);
      setErrMsg("");
      setEmailInfo("");
    }
  };

  const handleNavigation = (to) => {
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById(to);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  return (
    <div className="w-full bg-[#F5F5F3] pt-10 pb-8">
  <div className="max-w-container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 px-4 gap-y-8 gap-x-6">
        {/* About */}
        <div className="col-span-2">
          <h3 className="text-xl font-titleFont font-semibold mb-6">More about Nayab Fashion</h3>
          <div className="flex flex-col gap-6">
            <p className="text-[15px] font-heading w-full xl:w-[80%]">
              Established in 2017, Nayab Fashion has become a trusted name in providing elegant, high-quality fashion that seamlessly blends traditional craftsmanship with contemporary design.
            </p>
            <ul className="flex font-heading items-center gap-4">
              <a href="https://wa.me/+923100122349" target="_blank" rel="noreferrer">
                <li className="w-10 h-10 bg-green-500 text-white cursor-pointer text-2xl rounded-full flex justify-center items-center hover:bg-green-400 duration-300">
                  <FaWhatsapp />
                </li>
              </a>
              <a href="https://www.facebook.com/Nayabonlinestore/" target="_blank" rel="noreferrer">
                <li className="w-10 h-10 bg-blue-600 text-white cursor-pointer text-2xl rounded-full flex justify-center items-center hover:bg-blue-500 duration-300">
                  <FaFacebook />
                </li>
              </a>
              <a href="https://www.instagram.com/nayab_fashion_" target="_blank" rel="noreferrer">
                <li className="w-10 h-10 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white cursor-pointer text-2xl rounded-full flex justify-center items-center hover:bg-gradient-to-tr duration-300">
                  <FaInstagram />
                </li>
              </a>
              <a href="https://www.tiktok.com/@nayabfashion" target="_blank" rel="noreferrer">
                <li className="w-10 h-10 bg-black text-white cursor-pointer text-2xl rounded-full flex justify-center items-center hover:bg-gray-800 duration-300">
                  <FaTiktok />
                </li>
              </a>
              <a href="https://youtube.com/@nayabfashion" target="_blank" rel="noreferrer">
                <li className="w-10 h-10 bg-red-600 text-white cursor-pointer text-2xl rounded-full flex justify-center items-center hover:bg-red-500 duration-300">
                  <FaYoutube />
                </li>
              </a>
            </ul>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="col-span-1">
          <h3 className="text-xl font-titleFont font-semibold mb-6">Navigation Links</h3>
          <ul className="flex font-heading flex-col gap-2">
            <li className="text-base text-lightText hover:text-black hover:underline decoration-[1px] decoration-gray-500 underline-offset-2 cursor-pointer duration-300">
              <Link to='/'>Home</Link>
            </li>
            <li className="text-base text-lightText hover:text-black hover:underline decoration-[1px] decoration-gray-500 underline-offset-2 cursor-pointer duration-300">
              <ScrollLink
                to="new-arrivals"
                smooth={true}
                duration={500}
                offset={-50}
                onClick={() => handleNavigation('new-arrivals')}
              >
                New Arrivals
              </ScrollLink>
            </li>
            <li className="text-base text-lightText hover:text-black hover:underline decoration-[1px] decoration-gray-500 underline-offset-2 cursor-pointer duration-300">
              <ScrollLink
                to="nayab-exclusive"
                smooth={true}
                duration={500}
                offset={-50}
                onClick={() => handleNavigation('nayab-exclusive')}
              >
                Nayab Exclusives
              </ScrollLink>
            </li>
            <li className="text-base text-lightText hover:text-black hover:underline decoration-[1px] decoration-gray-500 underline-offset-2 cursor-pointer duration-300">

              <ScrollLink
                to="special-offers"
                smooth={true}
                duration={500}
                offset={-50}
                onClick={() => handleNavigation('special-offers')}
              >
                Special Offers
              </ScrollLink>
            </li>
            <li className="text-base text-lightText hover:text-black hover:underline decoration-[1px] decoration-gray-500 underline-offset-2 cursor-pointer duration-300">
              <Link to='/products'>Explore Shop</Link>
            </li>
            <li className="text-base text-lightText hover:text-black hover:underline decoration-[1px] decoration-gray-500 underline-offset-2 cursor-pointer duration-300">
              <Link to='/about'>About us</Link>
            </li>
            <li className="text-base text-lightText hover:text-black hover:underline decoration-[1px] decoration-gray-500 underline-offset-2 cursor-pointer duration-300">
              <Link to='/contact'>Contact us</Link>
            </li>
          </ul>
        </div>

        {/* Get In Touch */}
        <div className="col-span-1">
          {/* <h3 className="text-xl font-titleFont font-semibold mb-6">Contact Info</h3>
          <ul className="flex font-heading flex-col gap-2">
            <li className="text-base text-lightText hover:text-black hover:underline decoration-[1px] decoration-gray-500 underline-offset-2 cursor-pointer duration-300">
              <Link to='/about'>About us</Link>
            </li>
            <li className="text-base text-lightText hover:text-black hover:underline decoration-[1px] decoration-gray-500 underline-offset-2 cursor-pointer duration-300">
              <Link to='/contact'>Contact us</Link>
            </li>
          </ul> */}

          <h2 className="text-xl font-titleFont font-semibold mb-6">Get in Touch</h2>
          <p className="text-lightText font-heading mb-2">
            <strong>Address:</strong> Shop no M-28, Iqbal Cloth Market, Near New Memon Masjid, M.A Jinnah Road, Karachi, Pakistan
          </p>
          <p className="text-lightText font-heading mb-2">
            <strong>Phone 1:</strong>
            <a href="tel:+923361810286" className="text-base text-lightText hover:text-black hover:underline decoration-[1px] decoration-gray-500 underline-offset-2 duration-300">
              &nbsp;+92 336 1810286
            </a>
          </p>
          <p className="text-lightText font-heading mb-2">
            <strong>Phone 2:</strong>
            <a href="tel:+923149527139" className="text-base text-lightText hover:text-black hover:underline decoration-[1px] decoration-gray-500 underline-offset-2 duration-300">
              &nbsp;+92 314 9527139
            </a>
          </p>
          <p className="text-lightText font-heading">
            <strong>Email:</strong>
            <a href="mailto:info@nayabfashion.com.pk" className="text-base break-all text-lightText hover:text-black hover:underline decoration-[1px] decoration-gray-500 underline-offset-2 duration-300">
              &nbsp;info@nayabfashion.com.pk
            </a>
          </p>
        </div>

        {/* Subscription */}
        <div className="col-span-2 flex flex-col font-heading items-center w-full px-4">
          <h3 className="text-xl font-titleFont font-semibold mb-6">Subscribe our Store</h3>
          <div className="w-full font-heading">
            <p className="text-sm text-center mb-4">
              Nayab Fashion - Best Ecommerce Store in Pakistan.
            </p>
            {subscription ? (
              <motion.p
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full text-center text-base font-semibold text-green-600"
              >
                Subscribed Successfully!
              </motion.p>
            ) : (
              <div className="w-full flex-col xl:flex-row flex justify-between items-center gap-4">
                <div className="flex flex-col w-full">
                  <input
                    onChange={(e) => setEmailInfo(e.target.value)}
                    value={emailInfo}
                    className="w-full h-12 border-b border-gray-400 bg-transparent px-4 font-heading text-primeColor text-sm placeholder:text-sm outline-none"
                    type="text"
                    placeholder="Enter your email here"
                  />
                  {errMsg && (
                    <p className="text-red-600 text-sm font-semibold text-center animate-bounce mt-2">
                      {errMsg}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleSubscription}
                  className="w-[40%] h-10 text base tracking-wide xs:text-sm sm:text-sm md:text-sm bg-[#7b246d] text-white hover:bg-gray-700 rounded-lg font-semibold font-heading transition-all duration-300 uppercase"
                >
                  Subscribe!
                </button>
              </div>
            )}
            <img className={`w-[80%] lg:w-[60%] mx-auto ${subscription ? "mt-2" : "mt-6"}`} src={paymentCard} alt="Payment Image" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
