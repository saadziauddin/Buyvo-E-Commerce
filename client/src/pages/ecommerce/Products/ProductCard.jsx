import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/reduxSlice";
import FormatPrice from "../../../helpers/FormatPrice";
import { PiShoppingCartLight, PiHeartStraightLight } from "react-icons/pi";
import { TfiSearch } from "react-icons/tfi";

function ProductCard(props) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const _id = props.productName;
  const idString = (_id) => String(_id).toLowerCase().split(" ").join("");
  const rootId = idString(_id);
  const navigate = useNavigate();

  const selectedCurrency = props.selectedCurrency || "PKR";

  const images = Array.isArray(props.img) ? props.img : [props.img];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [isHovered, setIsHovered] = useState(false);

  const handleProductDetails = () => {
    navigate(`/product/${props._id}`, {
      state: {
        item: props,
      },
    });
  };

  const handleMouseEnter = () => {
    const nextImageIndex = currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
    setCurrentImageIndex(nextImageIndex);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setCurrentImageIndex(0);
    setIsHovered(false);
  };

  // const formatDescription = (description) => {
  //   const keywords = ["FABRIC:", "DUPPATA:", "LENGTH:", "WIDTH:", "TROUSER:", "WORK:", "STITCHING FACILITY:"];
  //   const regex = new RegExp(`(${keywords.join('|')})`, 'gi');

  //   // Add a comma if not already present at the end of each matched section, and remove unnecessary spaces
  //   let formattedDescription = description
  //     .replace(regex, '<strong>$1</strong>')
  //     .replace(/\s*,\s*/g, ', ') // Replace multiple spaces around commas with a single space
  //     .replace(/(\w)(?=\s*<strong>|$)/g, '$1,') // Add a comma if not already there before the next keyword or at the end
  //     .trim(); // Remove any extra spaces at the beginning or end

  //   return formattedDescription;
  // };

  // Function to format description with bold labels and line breaks
  const formatDescription = (description) => {
    const keywords = ["FABRIC:", "DUPPATA:", "LENGTH:", "WIDTH:", "TROUSER:", "WORK:", "STITCHING FACILITY:"];
    const regex = new RegExp(`(${keywords.join('|')})`, 'gi');

    // First, replace keywords with bold text
    let formattedDescription = description.replace(regex, '<strong>$1</strong>').trim();

    // Then, replace newlines with <br> tags
    formattedDescription = formattedDescription.replace(/\n/g, '<br />');

    return formattedDescription;
  };

  return (
    <div className={`max-w-container relative group transition-all duration-300 ease-in-out z-30 overflow-hidden ${isHovered ? "hover:shadow-lg rounded-md" : ""}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {/* Product Image */}
      <div className="relative w-full h-[350px] sm:h-[350px] md:h-[450px] overflow-hidden cursor-pointer" onClick={handleProductDetails}>
        {images.map((image, index) => (
          <img
            key={index}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${currentImageIndex === index ? "opacity-100" : "opacity-0"}`}
            src={image}
            alt={props.productName}
            onError={(e) => {
              console.error('Image failed to load, using default image.');
              e.target.src = [`https://res.cloudinary.com/dzmjsrpdp/image/upload/v1732013415/image-not-available_jrcuh6.png`];
            }}
          />
        ))}

        {/* Add to Cart button on hover */}
        {isHovered && (
          <button
            className="absolute bottom-0 w-full left-[50%] uppercase transform -translate-x-1/2 px-4 py-2 bg-gray-800 text-gray-100 xs:text-xs sm:text-xs md:text-sm font-semibold hover:bg-[#7b246d] hover:text-white transition-colors duration-300"
            // onClick={() => dispatch(addToCart(props))}
            onClick={handleProductDetails}
          >
            Add to Cart
          </button>
        )}
      </div>

      {/* Product Info */}
      <div className={`mt-1 p-2 px-2 bg-white transition-all duration-300 hover:scale-100 ${isHovered ? "h-auto" : "h-[100px]"}`}>
        <div className="flex justify-center items-center">
          <div>
            <h3 className="text-md lg:text-lg text-center font-semibold uppercase text-gray-800">
              {props.productName || "Product Name"}
            </h3>

            {props.status && (
              <p className={`font-mono text-[15px] text-center uppercase ${props.status === "Available" ? "text-green-500" : "text-red-600"}`}>
                {props.status === "Available" ? `${props.status}✔️` : `${props.status}❌`}
              </p>
            )}

            <p className={`text-gray-800 font-[550] text-sm md:text-lg ${!props.oldPrice ? 'text-center' : ''}`}>
              <span>
                <FormatPrice price={props.newPrice} currency={selectedCurrency} />
              </span>
              {props.oldPrice && (
                <span className="line-through ml-2 text-gray-500">
                  <FormatPrice price={props.oldPrice} currency={selectedCurrency} />
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Description */}
        {/* {isHovered && (
          <p
            className="relative w-full h-full text-sm text-center text-gray-800 bg-white px-4"
            dangerouslySetInnerHTML={{ __html: formatDescription(props.shortDescription) }}
          />
        )} */}
      </div>
    </div>
  );
};

export default ProductCard;
