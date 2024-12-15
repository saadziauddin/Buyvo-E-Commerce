import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs.jsx";
import { FaTimes } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import api from '../../../api/api.js';
import { toast } from "react-toastify";
import Lightbox from "yet-another-react-lightbox";
import { Counter, Fullscreen, Slideshow, Thumbnails, Zoom } from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import FormatPrice from "../../../helpers/FormatPrice.js";
import SizeGuideIcon from "/Images/SizeGuideScaleIcon.png";
import SizeGuideImage from "/Images/SizeGuideImage.jpg";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, setLoading } from "../../../redux/reduxSlice";
import Loader from "../../../components/Loader/Loader";
import Slider from "react-slick";
import Product from "./ProductCard";
import { TfiAngleRight, TfiAngleLeft } from "react-icons/tfi";

function ProductDetails() {
    const { selectedCurrency } = useOutletContext();
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [productInfo, setProductInfo] = useState(null);
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("description");
    const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
    const loading = useSelector((state) => state.reduxReducer.loading);
    const [error, setError] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);


    const defaultImage = 'https://res.cloudinary.com/dzmjsrpdp/image/upload/v1732013415/image-not-available_jrcuh6.png';

    const [productImages, setProductImages] = useState([defaultImage]);

    useEffect(() => {
        if (productInfo?.images?.length > 0) {
            const initialProductImages = Array.isArray(productInfo.images) && productInfo.images.length > 0
                ? productInfo.images.map((image) => {
                    return image.imagePath ? image.imagePath : defaultImage;
                })
                : [defaultImage];
            setProductImages(initialProductImages); // Update state with actual image paths
        } else {
            setProductImages([defaultImage]); // Ensure fallback if no product images
        }
    }, [productInfo]);

    const handleImageError = (index) => {
        setProductImages((prevImages) => {
            // Ensure prevImages is always an array
            if (Array.isArray(prevImages)) {
                const updatedImages = [...prevImages];
                updatedImages[index] = defaultImage; // Set fallback image if error occurs
                return updatedImages;
            }
            // If somehow prevImages is not an array, return a new array with fallback image
            return [defaultImage];
        });
    };

    // Utility function to check if the array is valid (no null or "null" values)
    const isValidArray = (arr) => Array.isArray(arr) && arr.length > 0 && arr.some(item => item !== null && item !== 'null');

    // Filter out null or "null" values from arrays
    const availableColors = isValidArray(productInfo?.color) ? productInfo.color.filter(color => color !== null && color !== 'null') : [];
    const availableSizes = isValidArray(productInfo?.size) ? productInfo.size.filter(size => size !== null && size !== 'null') : [];

    // Fetch product details by ID
    useEffect(() => {
        const fetchProductById = async () => {
            dispatch(setLoading(true)); // Start the loader

            // Define a timeout for 1 minute
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Request timed out, please try again later.")), 1 * 60 * 1000)
            );

            try {
                const response = await Promise.race([
                    api.get(`/api/fetchProductById/${id}`),
                    timeoutPromise,
                ]);

                setProductInfo(response.data.product[0]);
                setError(null); // Clear any previous error
            } catch (error) {
                console.error("Error fetching product data:", error.message || error);
                toast.error("Error fetching product data.");
                setError(error.message || "Failed to load product details. Please try again later.");
            } finally {
                dispatch(setLoading(false)); // Stop the loader
            }
        };

        fetchProductById();
    }, [id, dispatch]);

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setSelectedImageIndex((prevIndex) => (prevIndex + 1) % productImages.length);
        }, 3000);

        return () => clearInterval(slideInterval);
    }, [productImages.length]);

    const handleQuantityChange = (event) => {
        const value = parseInt(event.target.value, 10);
        setQuantity(value > 0 ? value : 1);
    };

    // Set default color and size if only one option exists and it's not null
    useEffect(() => {
        if (availableColors.length === 1) {
            setSelectedColor(availableColors[0]);
        }
        if (availableSizes.length === 1) {
            setSelectedSize(availableSizes[0]);
        }
    }, [availableColors, availableSizes]);

    const handleAddCart = () => {
        if (availableColors.length > 1 && !selectedColor) {
            alert("Please select a color before adding to cart.");
            return;
        }
        if (availableSizes.length > 1 && !selectedSize) {
            alert("Please select a size before adding to cart.");
            return;
        }

        const cartItem = {
            id: `${productInfo._id}-${selectedColor}-${selectedSize}-${productInfo.category}`, // Unique ID
            name: productInfo.name,
            image: productImages[selectedImageIndex],
            color: selectedColor,
            size: selectedSize,
            category: productInfo.category,
            price: productInfo.newPrice,
            quantity: quantity,
        };

        dispatch(addToCart(cartItem));
        setIsModalOpen(true);
    };

    const handleBuyNow = () => {
        if (availableColors.length > 1 && !selectedColor) {
            alert("Please select a color before proceeding to checkout.");
            return;
        }
        if (availableSizes.length > 1 && !selectedSize) {
            alert("Please select a size before proceeding to checkout.");
            return;
        }

        const cartItem = {
            id: `${productInfo._id}-${selectedColor}-${selectedSize}-${productInfo.category}`, // Unique ID
            name: productInfo.name,
            image: productImages[selectedImageIndex],
            color: selectedColor,
            size: selectedSize,
            category: productInfo.category,
            price: productInfo.newPrice,
            quantity: quantity,
        };

        dispatch(addToCart(cartItem));
        navigate('/cart');
    };

    const handleNavigate = () => {
        navigate('/cart');
    }

    const formatDescription = (description) => {
        const keywords = ["FABRIC:", "DUPPATA:", "LENGTH:", "WIDTH:", "TROUSER:", "WORK:", "STITCHING FACILITY:"];
        const regex = new RegExp(`(${keywords.join('|')})`, 'gi');

        // First, replace keywords with bold text
        let formattedDescription = description.replace(regex, '<strong>$1</strong>').trim();

        // Then, replace newlines with <br> tags
        formattedDescription = formattedDescription.replace(/\n/g, '<br />');

        return formattedDescription;
    };

    // useEffect(() => {
    //     const fetchRelatedProducts = async () => {
    //         if (!productInfo?.category) return;

    //         dispatch(setLoading(true));

    //         try {
    //             const timeoutPromise = new Promise((_, reject) =>
    //                 setTimeout(() => reject(new Error("Request timed out. Please try again later.")), 60 * 1000)
    //             );

    //             const response = await Promise.race([
    //                 api.get(`/api/fetchProductByCategory/${productInfo.category}`),
    //                 timeoutPromise,
    //             ]);

    //             const data = response.data;
                
    //             // Check if `fetchCategory` exists and is an array
    //             if (Array.isArray(data.fetchCategory)) {
    //                 const categoryProducts = data.fetchCategory;

    //                 if (categoryProducts.length === 1) {
    //                     console.warn("Only one product found in category. Fetching all products...");

    //                     // Fetch all products (fallback)
    //                     const fallbackResponse = await Promise.race([
    //                         api.get("/api/fetchProducts"),
    //                         timeoutPromise,
    //                     ]);

    //                     // Correctly extract fallback products
    //                     const fallbackProducts = Array.isArray(fallbackResponse.data)
    //                         ? fallbackResponse.data
    //                         : [];

    //                     // Combine the single category product with fallback products
    //                     const combinedProducts = [
    //                         ...categoryProducts,
    //                         ...fallbackProducts.filter(
    //                             (fallbackProduct) =>
    //                                 !categoryProducts.some(
    //                                     (categoryProduct) => categoryProduct._id === fallbackProduct._id
    //                                 )
    //                         ),
    //                     ];

    //                     setRelatedProducts(combinedProducts);
    //                 } else {
    //                     console.log("Multiple products found. Displaying category products only.");
    //                     // Display only category products
    //                     setRelatedProducts(categoryProducts);
    //                 }
    //             } else {
    //                 console.error("fetchCategory is not an array or does not exist.");
    //                 setRelatedProducts([]);
    //             }

    //             setError(null);


    //         } catch (error) {
    //             console.error("Error fetching related products:", error.message || error);
    //             toast.error("Error fetching related products.");
    //             setError(error.message || "Failed to load related products. Please try again later.");
    //         } finally {
    //             dispatch(setLoading(false));
    //         }
    //     };

    //     fetchRelatedProducts();
    // }, [productInfo?.category, dispatch]);

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            if (!Array.isArray(productInfo?.category) || productInfo.category.length === 0) return;
    
            dispatch(setLoading(true));
    
            try {
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Request timed out. Please try again later.")), 60 * 1000)
                );
    
                const categoryPromises = productInfo.category.map((category) =>
                    Promise.race([
                        api.get(`/api/fetchProductByCategory/${category}`),
                        timeoutPromise,
                    ])
                );
    
                const responses = await Promise.allSettled(categoryPromises);
    
                const categoryProducts = responses
                    .filter((result) => result.status === "fulfilled")
                    .flatMap((result) =>
                        Array.isArray(result.value.data?.fetchCategory) ? result.value.data.fetchCategory : []
                    );
    
                // Remove duplicates based on product `_id`
                const uniqueProducts = Array.from(
                    new Map(categoryProducts.map((product) => [product._id, product])).values()
                );
    
                if (uniqueProducts.length === 0) {
                    console.warn("No products found in categories. Fetching all products...");
    
                    const fallbackResponse = await Promise.race([
                        api.get("/api/fetchProducts"),
                        timeoutPromise,
                    ]);
    
                    const fallbackProducts = Array.isArray(fallbackResponse.data)
                        ? fallbackResponse.data
                        : [];
    
                    setRelatedProducts(fallbackProducts);
                } else {
                    console.log("Related products fetched successfully.");
                    setRelatedProducts(uniqueProducts);
                }
    
                setError(null);
            } catch (error) {
                console.error("Error fetching related products:", error.message || error);
                toast.error("Error fetching related products.");
                setError(error.message || "Failed to load related products. Please try again later.");
                setRelatedProducts([]);
            } finally {
                dispatch(setLoading(false));
            }
        };
    
        fetchRelatedProducts();
    }, [productInfo?.category, dispatch]);
    
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
        infinite: relatedProducts && relatedProducts.length > 1, // Prevent infinite scroll for single products
        speed: 500,
        slidesToShow: relatedProducts && relatedProducts.length < 4 ? relatedProducts.length : 4, // Adjust slidesToShow
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        autoplay: relatedProducts && relatedProducts.length > 1, // Avoid autoplay for single products
        autoplaySpeed: 2000,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 1025,
                settings: {
                    slidesToShow: relatedProducts && relatedProducts.length < 3 ? relatedProducts.length : 3,
                    slidesToScroll: 1,
                    infinite: true,
                },
            },
            {
                breakpoint: 769,
                settings: {
                    slidesToShow: relatedProducts && relatedProducts.length < 2 ? relatedProducts.length : 2,
                    slidesToScroll: 1,
                    infinite: true,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: relatedProducts && relatedProducts.length < 2 ? relatedProducts.length : 2,
                    slidesToScroll: 1,
                    infinite: true,
                },
            },
        ],
    };

    return (
        <div className="max-w-container px-4">
            {loading && <Loader />}

            {/* Breadcrumb */}
            <div className="xl:mt-0 mt-4 pl-5">
                <Breadcrumbs title="Product Details" />
            </div>

            {error && (
                <p className="text-red-500 text-center py-5">{error}</p>
            )}

            {!loading && !error && productInfo && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
                        {/* Image Section */}
                        {productImages.length > 0 && (
                            <div className="grid grid-cols-1 lg:grid-cols-[1fr,6fr] gap-4 lg:gap-3">
                                {/* Thumbnails */}
                                <div className="flex flex-row-reverse sm:flex-row sm:justify-center lg:flex-col lg:max-h-[350px] overflow-y-auto scrollbar-none lg:gap-3">
                                    {productImages.map((image, index) => {
                                        return (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`Thumbnail ${index + 1}`}
                                                className={`w-16 h-16 lg:w-20 lg:h-20 object-cover cursor-pointer rounded-lg border-2 transition-all duration-300 hover:border-[#7b246d] my-1 lg:my-2 ${selectedImageIndex === index ? 'border-[#7b246d]' : 'border-transparent'}`}
                                                onClick={() => setSelectedImageIndex(index)}
                                                onError={() => handleImageError(index)}
                                            />
                                        );
                                    })}
                                </div>

                                {/* Main Image */}
                                <div className="relative rounded-lg overflow-hidden mb-6">
                                    <img
                                        src={productImages[selectedImageIndex]}
                                        alt={`Product Image ${selectedImageIndex + 1}`}
                                        className="rounded-lg object-cover w-full h-[100%] transition-transform duration-300 ease-in-out cursor-pointer hover:scale-105"
                                        onClick={() => setOpen(true)}
                                        onError={() => handleImageError(selectedImageIndex)}
                                    />
                                </div>
                                <Lightbox
                                    open={open}
                                    close={() => setOpen(false)}
                                    slides={productImages.map((image) => ({ src: image }))}
                                    plugins={[Counter, Fullscreen, Thumbnails, Zoom]}
                                />
                            </div>
                        )}

                        {/* Product Info Section */}
                        <div className="flex flex-col">
                            <h1 className="text-2xl md:text-3xl font-titleFont text-gray-900 mb-2">{productInfo.name}</h1>
                            <p className="text-lg uppercase text-gray-500 font-semibold mb-2">{productInfo.status}</p>
                            <div className="text-2xl font-bold text-gray-800 mb-2 flex gap-2 items-center">
                                <p><FormatPrice price={productInfo.newPrice} currency={selectedCurrency} /></p>
                                {productInfo?.oldPrice && (
                                    <p className="line-through text-gray-500 text-lg"><FormatPrice price={productInfo.oldPrice} currency={selectedCurrency} /></p>
                                )}
                            </div>
                            {/* <p className="text-red-600 text-sm">GST Inclusive</p> */}

                            {/* Color & Size selector */}
                            <div className="my-2">
                                {Array.isArray(availableColors) && availableColors.length > 0 && (
                                    <div className="flex flex-col gap-2 mb-3">
                                        <p className="text-lg font-semibold text-gray-800">Color:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {availableColors.map((color, index) => (
                                                <button
                                                    key={index}
                                                    className={`py-1 px-2 rounded-lg transition-all duration-300 font-titleFont capitalize hover:shadow-lg transform hover:scale-105 ${selectedColor === color ? 'bg-[#7b246d] text-white border-[#7b246d] border-1' : 'bg-gray-100 text-gray-800 border-1 border-gray-200'}`}
                                                    onClick={() => setSelectedColor(color)}
                                                    title={color}
                                                >
                                                    {color}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {Array.isArray(availableSizes) && availableSizes.length > 0 && (
                                    <div className="flex flex-col gap-2 mb-3">
                                        <p className="text-lg font-semibold text-gray-800">Size:</p>
                                        <div className="flex gap-2">
                                            {availableSizes.map((size, index) => (
                                                <button
                                                    key={index}
                                                    className={`py-1 px-2 rounded-lg transition-all duration-300 font-titleFont capitalize hover:shadow-lg transform hover:scale-105 ${selectedSize === size ? 'bg-[#7b246d] text-white border-[#7b246d] border-1' : 'bg-gray-100 text-gray-800 border-1 border-gray-200'}`}
                                                    onClick={() => setSelectedSize(size)}
                                                    title={size}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Quantity Selector & Size Guide */}
                            <div className="flex items-center justify-between mb-6">
                                {/* Quantity Selector */}
                                <div className="flex items-center gap-4">
                                    <p className="text-lg font-semibold text-gray-800">Quantity:</p>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setQuantity(quantity > 1 ? quantity - 1 : quantity)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded-md">
                                            -
                                        </button>
                                        <input
                                            type="text"
                                            value={quantity}
                                            onChange={handleQuantityChange}
                                            className="w-10 text-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded-md"
                                        />
                                        <button onClick={() => setQuantity(quantity + 1)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded-md">
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Size Guide */}
                                {/* <div className="flex items-center gap-1">
                                <img src={SizeGuideIcon} alt="Size Guide Icon" className="w-4 h-4 md:w-5 md:h-5" />
                                <a onClick={() => setSizeGuideOpen(true)} className="text-[#7b246d] text-sm cursor-pointer hover:underline uppercase">
                                    Size Guide
                                </a>
                            </div> */}
                            </div>

                            {/* YouTube Video */}
                            {productInfo.youtubeVideoLink &&
                                <div className="relative pt-[55%] w-full md:pt-[46%] md:w-[90%] shadow-lg rounded-lg overflow-hidden">
                                    <iframe
                                        src={productInfo.youtubeVideoLink}
                                        title="YouTube video player"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        className="absolute top-0 left-0 w-full h-full"
                                    ></iframe>
                                </div>
                            }

                            {/* Action Buttons */}
                            <div className="flex flex-col md:flex-row gap-3 mt-4 mb-4">
                                <button
                                    className="w-full md:w-[280px] bg-[#7b246d] text-white hover:bg-gray-500 py-2 px-4 md:py-2 md:px-6 rounded-lg font-semibold font-heading transition-all uppercase"
                                    onClick={() => { handleBuyNow() }}
                                >
                                    Buy Now
                                </button>
                                <button
                                    className="w-full md:w-[280px] bg-gray-200 hover:bg-gray-300 text-[#7b246d] py-2 px-4 md:py-2 md:px-6 rounded-lg font-semibold font-heading transition-all uppercase"
                                    onClick={handleAddCart}>
                                    Add to Cart
                                </button>
                            </div>

                            {/* <p className="text-gray-800 text-lg mt-2 "><b className="text-lg">Stock:</b> {productInfo.stock}</p> */}
                            <p className="text-red-500 text-[15px] mt-2">
                                <b className="text-[15px] uppercase">Disclaimer: </b>
                                Product color may vary slightly due to photographic lighting sources or monitor settings.
                            </p>
                        </div>

                        {/* Tabs for Description, Shipping, and Returns */}
                        <div className="md:px-4">
                            <div className="flex gap-10 border-b-2 border-gray-200 pb-2 mb-4">
                                <button
                                    className={`text-sm md:text-lg font-semibold relative transition-all uppercase ${activeTab === "description" ? "text-[#7b246d]" : "text-gray-600 hover:text-[#7b246d]"}`}
                                    onClick={() => setActiveTab("description")}
                                >
                                    Description
                                    {activeTab === "description" && (
                                        <span className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-[#7b246d] rounded"></span>
                                    )}
                                </button>
                                <button
                                    className={`text-sm md:text-lg font-semibold relative transition-all uppercase ${activeTab === "shipping" ? "text-[#7b246d]" : "text-gray-600 hover:text-[#7b246d]"
                                        }`}
                                    onClick={() => setActiveTab("shipping")}
                                >
                                    Shipping Details
                                    {activeTab === "shipping" && (
                                        <span className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-[#7b246d] rounded"></span>
                                    )}
                                </button>
                                <button
                                    className={`text-sm md:text-lg font-semibold relative transition-all uppercase ${activeTab === "returns" ? "text-[#7b246d]" : "text-gray-600 hover:text-[#7b246d]"}`}
                                    onClick={() => setActiveTab("returns")}
                                >
                                    Return & Refund
                                    {activeTab === "returns" && (
                                        <span className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-[#7b246d] rounded"></span>
                                    )}
                                </button>
                            </div>

                            {/* Tabs Content */}
                            <div>
                                {activeTab === "description" && (
                                    <div className="mb-10">
                                        <h2 className="text-lg font-bold font-heading text-gray-800 mb-2">Description:</h2>
                                        <p
                                            className="text-gray-700"
                                            dangerouslySetInnerHTML={{
                                                __html: formatDescription(productInfo.longDescription),
                                            }}
                                        ></p>
                                    </div>
                                )}
                                {activeTab === "shipping" && (
                                    <div className="mb-10 ml-5">
                                        <h2 className="text-lg font-bold font-heading text-gray-800 mb-4">Shipping Policy</h2>
                                        <p className="text-gray-700 mb-4">
                                            At Nayab Fashion, we are committed to delivering your orders accurately and promptly. Please review our shipping policy to understand how we process and ship your orders.
                                        </p>

                                        <h3 className="font-bold text-gray-800 mt-6 mb-2">1. Shipping Methods</h3>
                                        <p className="text-gray-700 mb-4">
                                            We offer various shipping methods to meet your needs. The available options will be presented at checkout, and they include:
                                        </p>
                                        <ul className="list-disc list-inside text-gray-700 mb-4">
                                            <li>Standard Shipping: Estimated delivery within 5-7 business days.</li>
                                            <li>Expedited Shipping: Estimated delivery within 2-3 business days.</li>
                                            <li>Overnight Shipping: Next-day delivery for orders placed before [insert cutoff time].</li>
                                        </ul>

                                        <h3 className="font-bold text-gray-800 mt-6 mb-2">2. Shipping Charges</h3>
                                        <p className="text-gray-700 mb-4">
                                            Shipping charges are calculated based on the weight of your order and the shipping method selected.
                                            You will see the total shipping cost at checkout before you complete your order.
                                        </p>

                                        <h3 className="font-bold text-gray-800 mt-6 mb-2">3. Order Processing Time</h3>
                                        <p className="text-gray-700 mb-4">
                                            Orders are typically processed within 1-2 business days. Orders placed on weekends or holidays will be processed the next business day.
                                        </p>

                                        <h3 className="font-bold text-gray-800 mt-6 mb-2">4. Delivery Timeframes</h3>
                                        <p className="text-gray-700 mb-4">
                                            Delivery times may vary based on your location and the shipping method selected. Please note that delays may occur due to unforeseen circumstances such as extreme weather, holidays, or carrier delays.
                                        </p>

                                        <h3 className="font-bold text-gray-800 mt-6 mb-2">5. Tracking Your Order</h3>
                                        <p className="text-gray-700 mb-4">
                                            Once your order has shipped, you will receive a confirmation email with tracking information. You can use this tracking number to monitor the status of your shipment.
                                        </p>

                                        <h3 className="font-bold text-gray-800 mt-6 mb-2">6. Shipping to International Addresses</h3>
                                        <p className="text-gray-700 mb-4">
                                            We are pleased to offer international shipping. Please note that customs duties, taxes, and fees are the responsibility of the customer and may be charged upon delivery.
                                        </p>

                                        <h3 className="font-bold text-gray-800 mt-6 mb-2">7. Contact Us</h3>
                                        <p className="text-gray-700 mb-4">
                                            If you have any questions about your order or our shipping policy, please reach out to our customer service team at [insert contact information].
                                        </p>

                                        <p className="text-gray-700">
                                            Thank you for choosing Nayab Fashion! We appreciate your business and look forward to serving you.
                                        </p>
                                    </div>
                                )}
                                {activeTab === "returns" && (
                                    <div className="mb-10 ml-5">
                                        <h2 className="text-lg font-bold font-heading text-gray-800 mb-4">Returns Policy</h2>
                                        <p className="text-gray-700 mb-4">
                                            At Nayab Fashion, customer satisfaction is our top priority. We strive to provide high-quality products and exceptional service. However, we understand that sometimes returns or refunds may be necessary. Please read our returns policy carefully to ensure that you understand our terms and conditions.
                                        </p>

                                        <h3 className="font-bold text-gray-800 mt-6 mb-2">1. Eligibility for Refunds</h3>
                                        <ul className="list-disc list-inside text-gray-700 mb-4">
                                            <li><strong>Defective or Damaged Items:</strong> If you receive a defective or damaged item, please contact us within 7 days of delivery. Be sure to include a photo and description of the defect or damage. We will review the issue and, if approved, offer a replacement or refund.</li>
                                            <li><strong>Incorrect Item Received:</strong> If you received the wrong item, please contact us within 7 days of delivery. We will arrange for the correct item to be shipped and provide instructions for returning the incorrect item.</li>
                                        </ul>

                                        <h3 className="font-bold text-gray-800 mt-6 mb-2">2. Conditions for Refunds</h3>
                                        <ul className="list-disc list-inside text-gray-700 mb-4">
                                            <li>The item must be unused, unwashed, and in its original packaging with all tags attached.</li>
                                            <li>You must provide proof of purchase, such as an order confirmation or receipt.</li>
                                            <li>Items marked as "final sale" or "clearance" are not eligible for refunds or returns.</li>
                                        </ul>

                                        <h3 className="font-bold text-gray-800 mt-6 mb-2">3. Refund Process</h3>
                                        <ol className="list-decimal list-inside text-gray-700 mb-4">
                                            <li><strong>Initiating a Refund:</strong> To initiate a refund, please contact our customer support team at [insert contact information] within the timeframes specified above.</li>
                                            <li><strong>Return Shipping:</strong> If approved for a return, we will provide instructions for shipping the item back to us. Please note that customers are responsible for return shipping costs, unless the return is due to a defect or error on our part.</li>
                                            <li><strong>Refund Approval:</strong> Once we receive and inspect your returned item, we will notify you of the approval or rejection of your refund.</li>
                                            <li><strong>Refund Method:</strong> Approved refunds will be processed to the original payment method. Refunds may take up to 7-10 business days to appear on your account, depending on your bank or card issuer.</li>
                                        </ol>

                                        <h3 className="font-bold text-gray-800 mt-6 mb-2">4. Non-Refundable Items</h3>
                                        <ul className="list-disc list-inside text-gray-700 mb-4">
                                            <li>Items that are used, washed, or not in their original condition.</li>
                                            <li>Final sale or clearance items.</li>
                                            <li>Gift cards or promotional items.</li>
                                        </ul>

                                        <h3 className="font-bold text-gray-800 mt-6 mb-2">5. International Orders</h3>
                                        <p className="text-gray-700 mb-4">
                                            For international orders, please note:
                                        </p>
                                        <ul className="list-disc list-inside text-gray-700 mb-4">
                                            <li>Nayab Fashion does not cover customs duties, import taxes, or other charges. These are the responsibility of the customer and are non-refundable.</li>
                                            <li>Any additional costs or fees associated with the return of international orders are the customer’s responsibility.</li>
                                        </ul>

                                        <h3 className="font-bold text-gray-800 mt-6 mb-2">6. Contact Us</h3>
                                        <p className="text-gray-700 mb-4">
                                            If you have any questions regarding our refund policy or need assistance with your return, please reach out to our customer service team at [insert contact information].
                                        </p>
                                        <p className="text-gray-700">
                                            Thank you for choosing Nayab Fashion! We are here to make your shopping experience as smooth and satisfying as possible.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Size Guide Modal */}
                        {sizeGuideOpen && (
                            <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
                                <div className="bg-white w-11/12 md:w-1/3 p-5 rounded-lg shadow-lg">
                                    <div className="flex justify-between items-start mb-3">
                                        <h2 className="text-lg font-titleFont font-medium text-gray-800 uppercase">Size Guide</h2>
                                        <button onClick={() => setSizeGuideOpen(false)} className="font-titleFont font-medium bg-transparent text-gray-600 hover:text-gray-800 transition text-xl">
                                            <RxCross1 />
                                        </button>
                                    </div>
                                    <img
                                        src={SizeGuideImage}
                                        alt="Size Guide Image"
                                        className="w-full h-auto"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Cart Confirmation Modal */}
                        {isModalOpen && (
                            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-50">
                                <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 max-w-xs md:max-w-md mx-auto relative">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="absolute top-5 right-5 text-gray-600 hover:text-gray-800 focus:outline-none"
                                    >
                                        <FaTimes />
                                    </button>
                                    <h3 className="text-base md:text-xl font-heading font-bold text-gray-900 mb-4 text-center uppercase">Added to Cart!</h3>
                                    <p className="text-sm md:text-sm text-gray-700 mb-6 text-center">
                                        You have added <b>{quantity}</b> unit(s) of <b>{productInfo.name}</b> to your cart.
                                    </p>
                                    <div className="flex items-center justify-center space-x-4">
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="text-sm md:text-base bg-gray-200 hover:bg-gray-300 text-gray-800 font-heading font-semibold py-2 px-4 md:py-2 md:px-6 rounded-lg focus:outline-none transition duration-200 ease-in-out uppercase"
                                        >
                                            Continue Shopping
                                        </button>
                                        <button
                                            onClick={handleNavigate}
                                            className="text-sm md:text-base bg-[#7b246d] hover:bg-[#5c1a4e] text-white font-heading font-semibold py-2 px-4 md:py-2 md:px-6 rounded-lg focus:outline-none transition duration-200 ease-in-out uppercase"
                                        >
                                            View Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative text-center pt-10 pb-0">
                        {/* Horizontal lines and text */}
                        <div className="flex items-center justify-center">
                            <div className="flex-grow border-t-4 border-black mx-5 md:mx-10"></div>
                            <span className="text-xl md:text-2xl lg:text-3xl font-semibold uppercase">Related Products</span>
                            <div className="flex-grow border-t-4 border-black mx-5 md:mx-10"></div>
                        </div>
                    </div>

                    <Slider {...settings}>
                        {relatedProducts && relatedProducts.length > 0 ? (
                            relatedProducts.map((product) => {

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
                </>
            )}
        </div>
    );
};

export default ProductDetails;
