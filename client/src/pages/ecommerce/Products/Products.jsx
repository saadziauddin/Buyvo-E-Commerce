import React, { useEffect, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { BsGridFill } from "react-icons/bs";
import { ImList } from "react-icons/im";
import ReactPaginate from "react-paginate";
import Product from "./ProductCard.jsx";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs.jsx";
import api from "../../../api/api.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { toggleCategory, toggleBrand, togglePrice } from "../../../redux/reduxSlice";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../redux/reduxSlice";
import Loader from "../../../components/Loader/Loader";

function Products() {
  const { selectedCurrency } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [gridViewActive, setGridViewActive] = useState(true);
  const [itemOffset, setItemOffset] = useState(0);
  const [sortOption, setSortOption] = useState("Best Sellers");
  const location = useLocation();
  const dispatch = useDispatch();
  const checkedCategories = useSelector((state) => state.reduxReducer.checkedCategories);
  const checkedBrands = useSelector((state) => state.reduxReducer.checkedBrands);
  const checkedPrices = useSelector((state) => state.reduxReducer.checkedPrices);
  const loading = useSelector((state) => state.reduxReducer.loading);
  const [error, setError] = useState(null);

  // Extracting query parameters from the URL
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");
  const productName = queryParams.get("name");

  useEffect(() => {
    const fetchData = async () => {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out. Please try again later.")), 1 * 60 * 1000)
      );

      dispatch(setLoading(true));

      try {
        let response;

        if (category) {
          response = await Promise.race([
            api.get(`/api/fetchProductByCategory/${encodeURIComponent(category)}`),
            timeoutPromise,
          ]);
        } else if (productName) {
          response = await Promise.race([
            api.get(`/api/fetchProductByName/${encodeURIComponent(productName)}`),
            timeoutPromise,
          ]);
        } else {
          response = await Promise.race([
            api.get("/api/fetchProducts"),
            timeoutPromise
          ]);
        }

        const data = response.data;

        if (category) {
          setProducts(Array.isArray(data.fetchCategory) ? data.fetchCategory : []);
        } else if (productName) {
          setProducts(Array.isArray(data.fetchProducts) ? data.fetchProducts : []);
        } else {
          setProducts(Array.isArray(data) ? data : []);
        }

        setError(null);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setError(error.message || "An error occurred while fetching the data.");
        setProducts([]);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [category, productName, location.search, dispatch]);

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortOption) {
      case "A-Z":
        return a.name.localeCompare(b.name);
      case "Z-A":
        return b.name.localeCompare(a.name);
      case "Price: Low to High":
        return a.newPrice - b.newPrice;
      case "Price: High to Low":
        return b.newPrice - a.newPrice;
      default:
        return 0;
    }
  });

  // Filter products based on selected categories, brands, and price ranges
  const filteredProducts = sortedProducts.filter((item) => {
    const isCategorySelected =
      checkedCategories.length === 0 ||
      checkedCategories.some((category) => category.title === item.cat);

    const isBrandSelected =
      checkedBrands.length === 0 ||
      checkedBrands.some((brand) => brand.title === item.brand);

    const isPriceSelected =
      checkedPrices.length === 0 ||
      checkedPrices.some(
        (priceRange) => item.newPrice >= priceRange.priceOne && item.newPrice <= priceRange.priceTwo
      );

    return isCategorySelected && isBrandSelected && isPriceSelected;
  });

  // Pagination logic
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = filteredProducts.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  const handlePageClick = (event) => {
    const newOffset = event.selected * itemsPerPage;
    setItemOffset(newOffset);
  };

  return (
    <>
      <div className="px-6">
        <Breadcrumbs title="Products" />
      </div>

      {/* Main Content */}
      <div className="w-full h-full flex flex-col gap-10">
        {loading && <Loader />}

        {error && <p className="text-red-500 text-center py-5">{error}</p>}

        {!loading && !error && (
          <>
            <div className="w-full flex flex-col md:flex-row md:items-center justify-between px-6">
              {/* Sort and Show Options */}
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">Sort by:</label>
                  <select
                    id="sortOptions"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-auto mt-1 pl-3 pr-10 py-1 border border-gray-300 rounded-sm cursor-pointer text-gray-700 hover:bg-gray-200"
                  >
                    <option value="A-Z">Alphabetically: A-Z</option>
                    <option value="Z-A">Alphabetically: Z-A</option>
                    <option value="Price: Low to High">Price: Low to High</option>
                    <option value="Price: High to Low">Price: High to Low</option>
                  </select>
                </div>

                <div className="relative cursor-pointer">
                  <label className="block text-gray-600">Show:</label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="w-20 border border-gray-300 py-1 px-4 rounded-sm cursor-pointer text-gray-700"
                  >
                    <option value="12">12</option>
                    <option value="24">24</option>
                    <option value="48">48</option>
                    <option value="96">96</option>
                  </select>
                </div>
              </div>

              {/* Grid/List View Toggle */}
              <div className="flex items-center gap-4 sm:mt-2">
                {/* <span
              className={`${isSidebarOpen ? "bg-[#7b246d] text-white" : "border border-gray-300 text-gray-600"} rounded-md w-8 h-8 flex justify-center items-center cursor-pointer`}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} // This should correctly toggle the sidebar
            >
              <FontAwesomeIcon icon={faFilter} />
            </span> */}
                <span
                  className={`${gridViewActive ? "bg-[#7b246d] text-white" : "border border-gray-300 text-gray-600"} rounded-md w-8 h-8 flex justify-center items-center cursor-pointer`}
                  onClick={() => setGridViewActive(true)}
                >
                  <BsGridFill />
                </span>
                <span
                  className={`${!gridViewActive ? "bg-[#7b246d] text-white" : "border border-gray-300 text-gray-600"} rounded-md w-8 h-8 flex justify-center items-center cursor-pointer`}
                  onClick={() => setGridViewActive(false)}
                >
                  <ImList />
                </span>
              </div>
            </div>

            <div className={`px-4 ${gridViewActive ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-x-6" : "flex-col gap-4"}`}>

              {currentItems.length > 0 ? (
                currentItems.map((product) => {

                  const imagePaths =
                    Array.isArray(product.images) && product.images.length > 0
                      ? product.images.map((img) => `${img.imagePath}`)
                      : [
                        `https://res.cloudinary.com/dzmjsrpdp/image/upload/v1732013415/image-not-available_jrcuh6.png`,
                      ];

                  return (
                    <div className="w-full" key={product._id}>
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
                <p className="text-center items-center justify-center text-gray-500 mb-5">No products found.</p>
              )}
            </div>
          </>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <>
            {/* Pagination */}
            < ReactPaginate
              breakLabel="..."
              nextLabel="Next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              pageCount={pageCount}
              previousLabel="< Previous"
              renderOnZeroPageCount={null}
              containerClassName="flex justify-center gap-2 mb-10"
              pageLinkClassName="px-4 py-2 border border-gray-300 rounded-md"
              previousLinkClassName="px-4 py-2 border border-gray-300 rounded-md"
              nextLinkClassName="px-4 py-2 border border-gray-300 rounded-md"
              activeLinkClassName="bg-[#7b246d] text-white"
            />
          </>
        )}
      </div>
    </>
  );
};

export default Products;
