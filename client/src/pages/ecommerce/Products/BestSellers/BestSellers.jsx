import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Product from "../ProductCard";
import api from '../../../../api/api.js';
import { TfiAngleRight, TfiAngleLeft } from "react-icons/tfi";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../../redux/reduxSlice";
import Loader from "../../../../components/Loader/Loader";

function BestSellers({ selectedCurrency }) {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.reduxReducer.loading);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(setLoading(true));

      // Define a timeout for 3 minutes
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out, Please try again later.")), 1 * 60 * 1000)
      );

      try {
        const response = await Promise.race([
          api.get("/api/fetchProductsByCategory/bestSellers"),
          timeoutPromise,
        ]);
        const data = await response.data;

        setProducts(data.products);
        setError(null);
      } catch (error) {
        console.error("Error fetching best sellers:", error.message || error);
        setError(error.message || "Failed to load best sellers. Please try again later.");
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchProducts();
  }, [dispatch]);

  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <div
        className="w-10 h-10 text-black hover:text-[#4a1341] text-3xl duration-300 cursor-pointer flex justify-center items-center z-10 absolute top-[35%] right-2 lg:right-4"
        onClick={onClick}
      >
        <TfiAngleRight />
      </div>
    );
  };

  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <div
        className="w-10 h-10 text-black hover:text-[#4a1341] text-3xl duration-300 cursor-pointer flex justify-center items-center z-10 absolute top-[35%] left-2 lg:left-4"
        onClick={onClick}
      >
        <TfiAngleLeft />
      </div>
    );
  };

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };

  return (
    <>
      {/* <div className="text-lg md:text-xl lg:text-2xl xl:text-2xl text-center font-semibold pt-5 uppercase relative">
        <p className="bg-[#7b246d] text-white">Our Best Sellers</p>
      </div> */}

      <div className="relative text-center pt-10 pb-0">
        {/* Horizontal lines and text */}
        <div className="flex items-center justify-center">
          <div className="flex-grow border-t-4 border-black mx-5 md:mx-10"></div>
          <span className="text-xl md:text-2xl lg:text-3xl font-semibold uppercase">Our Best Sellers</span>
          <div className="flex-grow border-t-4 border-black mx-5 md:mx-10"></div>
        </div>
      </div>
      
      {loading && <Loader />}

      {error && (
        <p className="text-red-500 text-center py-5">{error}</p>
      )}

      {!loading && !error && products.length > 0 && (
        <Slider {...settings}>
          {products.length > 0 ? (
            products.map((product) => {
              const imagePaths =
                Array.isArray(product.images) && product.images.length > 0
                  ? product.images.map((img) => `${img.imagePath}`)
                  : [
                    `https://res.cloudinary.com/dzmjsrpdp/image/upload/v1732013415/image-not-available_jrcuh6.png`,
                  ];

              return (
                <div className="px-2 py-10" key={product._id}>
                  <Product
                    _id={product._id}
                    img={imagePaths}
                    productName={product.name || "Product Name Not Available"}
                    newPrice={product.newPrice || "Price Not Available"}
                    oldPrice={product.oldPrice}
                    color={
                      Array.isArray(product.color) && product.color.length > 0
                        ? product.color.join(", ")
                        : null
                    }
                    size={
                      Array.isArray(product.size) && product.size.length > 0
                        ? product.size.join(", ")
                        : null
                    }
                    tags={
                      Array.isArray(product.tags) && product.tags.length > 0
                        ? product.tags
                        : null
                    }
                    shortDescription={product.shortDescription || null}
                    longDescription={product.longDescription || null}
                    status={product.status || null}
                    selectedCurrency={selectedCurrency}
                  />
                </div>
              );
            })
          ) : (
            <p>No products found.</p>
          )}
        </Slider>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="text-center">No products found.</p>
      )}
    </>
  );
};

export default BestSellers;
