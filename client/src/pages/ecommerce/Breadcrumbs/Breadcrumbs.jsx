// import React, { useEffect, useState } from "react";
// import { HiOutlineChevronRight } from "react-icons/hi";
// import { Link, useLocation, useParams } from "react-router-dom";
// import api from '../../../api/api.js';

// const Breadcrumbs = ({ title }) => {
//   const location = useLocation();
//   const [breadcrumbs, setBreadcrumbs] = useState([]);
//   const { id } = useParams();

//   const fetchProductName = async (id) => {
//     try {
//       const response = await api.get(`/api/fetchProductById/${id}`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch product name");
//       }
//       const data = await response.data.product[0];
//       console.log("Product name: ", data)
//       return data.name; // Assume your API returns { name: "Product Name" }
//     } catch (error) {
//       console.error("Error fetching product name:", error);
//       return id; // Fallback to ID if there's an error
//     }
//   };  

//   // useEffect(() => {
//   //   const pathnames = location.pathname.split("/").filter((item) => item);
//   //   setBreadcrumbs(pathnames);
//   // }, [location]);

//   useEffect(() => {
//     const updateBreadcrumbs = async () => {
//       const pathnames = location.pathname.split("/").filter((item) => item);
//       const resolvedBreadcrumbs = await Promise.all(
//         pathnames.map(async (item, index) => {
//           // Fetch product name for IDs (assume IDs are after "/products/")
//           if (index === 1 && pathnames[0] === "product") {
//             return await fetchProductName(item);
//           }
//           return item.replace(/-/g, " "); // Default behavior for other parts
//         })
//       );
//       setBreadcrumbs(resolvedBreadcrumbs);
//     };

//     updateBreadcrumbs();
//   }, [location]);

//   return (
//     <div className="w-full py-10 xl:py-10 flex flex-col gap-3">
//       <h1 className="text-4xl text-gray-800 font-titleFont font-semibold">
//         {title}
//       </h1>
//       <p className="text-sm font-normal text-lightText capitalize flex items-center">
//         <Link to="/" className="hover:underline">Home</Link>
//         <span className="px-1">
//           <HiOutlineChevronRight />
//         </span>

//         {breadcrumbs.map((breadcrumb, index) => {
//           const routeTo = `/products/${breadcrumbs.slice(0, index + 1).join("/")}`;
//           const isLast = index === breadcrumbs.length - 1;

//           return (
//             <span key={index} className="flex items-center">
//               {!isLast ? (
//                 <>
//                   <Link to={routeTo} className="hover:underline capitalize">
//                     {breadcrumb.replace(/-/g, " ")}
//                   </Link>
//                   <span className="px-1">
//                     <HiOutlineChevronRight />
//                   </span>
//                 </>
//               ) : (
//                 <span className="capitalize font-semibold text-primeColor">
//                   {breadcrumb.replace(/-/g, " ")}
//                 </span>
//               )}
//             </span>
//           );
//         })}
//       </p>
//     </div>
//   );
// };

// export default Breadcrumbs;

import React, { useEffect, useState } from "react";
import { HiOutlineChevronRight } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import api from '../../../api/api.js';

const Breadcrumbs = ({ title }) => {
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  // Fetch product name based on ID
  const fetchProductName = async (id) => {
    try {
      const response = await api.get(`/api/fetchProductById/${id}`);
      if (response.status !== 200) {
        throw new Error("Failed to fetch product name");
      }
      const product = response.data.product[0]; // Assuming this is the structure
      return product?.name || id; // Fallback to ID if name is missing
    } catch (error) {
      console.error("Error fetching product name:", error);
      return id; // Fallback to ID if there's an error
    }
  };

  useEffect(() => {
    const updateBreadcrumbs = async () => {
      // Extract path segments from the current URL
      const pathnames = location.pathname.split("/").filter((item) => item);

      // Resolve breadcrumbs
      const resolvedBreadcrumbs = await Promise.all(
        pathnames.map(async (item, index) => {
          // Replace product ID with name if it's in the product route
          if (index === 1 && pathnames[0] === "product") {
            return await fetchProductName(item); // Fetch product name
          }
          return item.replace(/-/g, " "); // Format other segments
        })
      );

      setBreadcrumbs(resolvedBreadcrumbs); // Update the breadcrumbs state
    };

    updateBreadcrumbs();
  }, [location]);

  return (
    <div className="w-full py-10 xl:py-10 flex flex-col gap-3">
      <h1 className="text-4xl text-gray-800 font-titleFont font-semibold">
        {title}
      </h1>
      <p className="text-sm font-normal text-lightText capitalize flex items-center">
        <Link to="/" className="hover:underline">Home</Link>
        <span className="px-1">
          <HiOutlineChevronRight />
        </span>

        {breadcrumbs.map((breadcrumb, index) => {
          const routeTo = `/${breadcrumbs.slice(0, index + 1).join("/")}`;
          const isLast = index === breadcrumbs.length - 1;

          return (
            <span key={index} className="flex items-center">
              {!isLast ? (
                <>
                  <Link to={routeTo} className="hover:underline capitalize">
                    {breadcrumb}
                  </Link>
                  <span className="px-1">
                    <HiOutlineChevronRight />
                  </span>
                </>
              ) : (
                <span className="capitalize font-semibold text-primeColor">
                  {breadcrumb}
                </span>
              )}
            </span>
          );
        })}
      </p>
    </div>
  );
};

export default Breadcrumbs;
