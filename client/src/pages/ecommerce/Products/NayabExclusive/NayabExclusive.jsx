import React from "react";
import { Link } from "react-router-dom";
import NayabExclusiveImage from "/Images/NayabExclusive.png";

const NayabExclusive = () => {
  return (
    // <Link to="/products">
    //   <div className="w-full h-96 py-10 md:bg-transparent relative font-titleFont">
    //     <img className="w-full h-96 object-fit" src={NayabExclusiveImage} alt={NayabExclusiveImage} />
    //     <div className="w-full md:w-2/3 xl:w-1/2 h-80 absolute px-4 md:px-0 top-0 right-0 flex flex-col items-start gap-6 justify-center">
    //       <h1 className="text-3xl font-semibold text-primeColor">
    //         Nayab Exclusive
    //       </h1>
    //       <p className="text-base font-normal text-primeColor max-w-[600px] mr-4">
    //         Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellat
    //         cupiditate modi amet! Facilis, aperiam quaerat.
    //       </p>
    //       <button className="border-2 border-gray-900 text-gray-900 text-md rounded-sm bg-transparent hover:bg-[#7b246d] hover:text-white transition-colors duration-300 w-[185px] h-[50px] uppercase">
    //         Shop Now
    //       </button>
    //     </div>
    //   </div>
    //   <img className="w-full h-80 object-fit" src={NayabExclusiveImage2} alt="Nayab Exclusive Image" />
    // </Link>
    <Link to="/products" className="z-10">
      <img className="w-full h-[120px] md:h-[250px] lg:h-[350px] object-center cursor-pointer" src={NayabExclusiveImage} alt="Nayab Exclusive" />
    </Link>
  );
};

export default NayabExclusive;
