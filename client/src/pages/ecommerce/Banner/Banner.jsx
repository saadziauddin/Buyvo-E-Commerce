import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import BannerImgOne from "/Images/Slider/Nayab Exclusive (Slider 1).png";
import BannerImgThree from "/Images/Slider/Nikkah Outfit (Slider 2).png";
import BannerImgFour from "/Images/Slider/Saree Outfit (Slider 3).png";
import BannerImgFive from "/Images/Slider/Mehndi Outfit (Slider 4).png";
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
    <img className="w-full h-[190px] md:h-[500px] object-center cursor-pointer" src={imgSrc} alt="Main Banner" />
  </Link>
);

const Banner = () => {
  const [dotActive, setDotActive] = useState(0);

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

  const slides = [
    { imgSrc: BannerImgOne },
    { imgSrc: BannerImgThree },
    { imgSrc: BannerImgFour },
    { imgSrc: BannerImgFive },
  ]

  return (
    <div className="mt-1 md:mt-5">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <CustomSlide key={index} imgSrc={slide.imgSrc} />
        ))}
      </Slider>
    </div>
  );
};

export default Banner;
