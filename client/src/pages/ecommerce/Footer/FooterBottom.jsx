import React from "react";
import { AiOutlineCopyright } from "react-icons/ai";

const FooterBottom = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="w-full bg-[#F5F5F3] group">
      <div className="max-w-container mx-auto border-t-[1px] pt-8 pb-8">
        <p className="font-normal font-heading text-center flex md:items-center justify-center text-lightText duration-200 text-sm">
          <span className="text-md mr-[1px] mt-[2px] md:mt-0 text-center hidden md:inline-flex">
            <AiOutlineCopyright />
          </span>
          Copyright {currentYear} | Nayab Fashion | All Rights Reserved |
          <a href="https://madigiworld.com">
            <span className="ml-1 font-medium group-hover:text-primeColor">
              Designed & Developed by MA DigiWorld
            </span>
          </a>
        </p>
      </div>
    </div>
  );
};

export default FooterBottom;
