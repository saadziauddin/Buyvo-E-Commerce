import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";

const Contact = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");

  useEffect(() => {
    if (location.state && location.state.data) {
      setPrevLocation(location.state.data);
    } else {
      setPrevLocation("Home");
    }
  }, [location]);

  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [messages, setMessages] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [errClientName, setErrClientName] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errMessages, setErrMessages] = useState("");

  const handleName = (e) => {
    setClientName(e.target.value);
    setErrClientName("");
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail("");
  };

  const handleMessages = (e) => {
    setMessages(e.target.value);
    setErrMessages("");
  };

  const EmailValidation = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  };

  const handlePost = (e) => {
    e.preventDefault();
    if (!clientName) {
      setErrClientName("Enter your Name");
    }
    if (!email) {
      setErrEmail("Enter your Email");
    } else if (!EmailValidation(email)) {
      setErrEmail("Enter a Valid Email");
    }
    if (!messages) {
      setErrMessages("Enter your Message");
    }

    if (clientName && email && EmailValidation(email) && messages) {
      setSuccessMsg(
        `Thank you dear ${clientName}, your message has been received successfully. Further details will be sent to ${email}.`
      );
    }
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Contact Us" prevLocation={prevLocation} />

      <div className="flex flex-col lg:flex-row gap-10 py-10 px-7">
        {/* Contact Form */}
        <div className="w-full lg:w-1/2">
          {successMsg ? (
            <p className="md:pb-20 w-80 md:w-96 font-medium text-green-500">{successMsg}</p>
          ) : (
            <form className="pb-20">
              <h1 className="font-titleFont font-semibold text-2xl md:text-3xl mb-6">
                Get in Touch
              </h1>
              <div className="flex flex-col gap-6">
                <div>
                  <label className="font-semibold font-heading text-gray-800 px-2">Name:</label>
                  <input
                    onChange={handleName}
                    value={clientName}
                    className="w-full py-2 border-b-2 px-2 text-base font-medium placeholder-gray-500 outline-none focus:border-primeColor"
                    type="text"
                    placeholder="Enter your name"
                  />
                  {errClientName && (
                    <p className="text-red-500 text-sm font-semibold mt-1 px-2">
                      {errClientName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="font-semibold font-heading text-gray-800 px-2">Email:</label>
                  <input
                    onChange={handleEmail}
                    value={email}
                    className="w-full py-2 border-b-2 px-2 text-base font-medium placeholder-gray-500 outline-none focus:border-primeColor"
                    type="email"
                    placeholder="Enter your email"
                  />
                  {errEmail && (
                    <p className="text-red-500 text-sm font-semibold mt-1 px-2">
                      {errEmail}
                    </p>
                  )}
                </div>
                <div>
                  <label className="font-semibold font-heading text-gray-800 px-2">Write Message:</label>
                  <textarea
                    onChange={handleMessages}
                    value={messages}
                    className="w-full py-2 border-b-2 px-2 text-base font-medium placeholder-gray-500 outline-none focus:border-primeColor resize-none"
                    placeholder="Type your message for us"
                    rows="4"
                  />
                  {errMessages && (
                    <p className="text-red-500 text-sm font-semibold mt-1 px-2">
                      {errMessages}
                    </p>
                  )}
                </div>
                <button
                  onClick={handlePost}
                  className="w-44 bg-[#7b246d] text-white hover:bg-gray-700 rounded-lg font-semibold font-heading transition-all duration-300 uppercase xs:text-sm py-2 px-4"
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Map Section */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Find Us Here</h2>
          <iframe
            className="w-full h-96 rounded-lg shadow-lg"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7240.679134138611!2d66.99673088053011!3d24.852249488712353!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e02355f48b9%3A0x2a63c5b04c3ad13d!2sBolton%20Market!5e0!3m2!1sen!2sus!4v1729150180861!5m2!1sen!2sus"
            allowFullScreen=""
            loading="lazy"
            title="Karachi Location Map"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
