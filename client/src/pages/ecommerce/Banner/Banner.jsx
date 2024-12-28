import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import DesktopSliderImg from "/Images/DesktopSliders/slider.png";
import MobileSlidersImg from "/Images/MobileSliders/slider.png";
import { TfiAngleRight, TfiAngleLeft } from "react-icons/tfi";

const NextArrow = ({ onClick }) => (
  <div onClick={onClick} >
    {/* className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10 cursor-pointer text-black p-1 transition-transform duration-300 hover:scale-110" */}
    <TfiAngleRight className="text-3xl md:text-4xl lg:text-4xl xl:text-4xl" />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div onClick={onClick} >
    {/* className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10 cursor-pointer text-black p-1 transition-transform duration-300 hover:scale-110" */}
    <TfiAngleLeft className="text-3xl md:text-4xl lg:text-4xl xl:text-4xl" />
  </div>
);

const CustomSlide = ({ imgSrc }) => (
  <Link to='/products'>
    <img className="w-full h-[356px] md:h-[500px] object-center cursor-pointer" src={imgSrc} alt="Main Banner" />
  </Link>
);

const Banner = () => {
  const [dotActive, setDotActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size and update the state
  useEffect(() => {
    const updateScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // Mobile screens are below 768px
    };

    updateScreenSize(); // Check initial screen size
    window.addEventListener("resize", updateScreenSize);

    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    arrows: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (prev, next) => setDotActive(next),
    customPaging: (i) => (
      <div className={`w-4 h-1 px-4 mx-1 cursor-pointer ${i === dotActive ? "bg-white" : "bg-gray-400"}`}/>
    ),
    appendDots: (dots) => (
      <div
        style={{
          position: "absolute",
          bottom: "5px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <ul className="flex">{dots}</ul>
      </div>
    ),
    dotsClass: "slick-dots",
    responsive: [
      {
        breakpoint: 768, // Tablet and mobile screens
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          customPaging: (i) => (
            <div
              className={`w-1 h-0.5 px-2 mx-1 cursor-pointer ${i === dotActive ? "bg-white" : "bg-gray-400"
                }`}
            />
          ),
        },
      },
      {
        breakpoint: 576, // Very small screens
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          customPaging: (i) => (
            <div
              className={`w-1 h-0.5 px-2 mx-1 cursor-pointer ${i === dotActive ? "bg-white" : "bg-gray-400"
                }`}
            />
          ),
        },
      },
    ],
  };

  const slides = isMobile
  ? [
      { imgSrc: MobileSlidersImg },
      { imgSrc: MobileSlidersImg },
      { imgSrc: MobileSlidersImg },
    ]
  : [
      { imgSrc: DesktopSliderImg },
      { imgSrc: DesktopSliderImg },
      { imgSrc: DesktopSliderImg },
    ];

  return (
    <div className="mt-3">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <CustomSlide key={index} imgSrc={slide.imgSrc} />
        ))}
      </Slider>
    </div>
  );
};

export default Banner;
