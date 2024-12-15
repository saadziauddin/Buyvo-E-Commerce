import React from "react";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import "./Loader.css";

const Loader = () => {
  const initialLoading = useSelector((state) => state.reduxReducer.initialLoading);
  const loading = useSelector((state) => state.reduxReducer.loading);

  return loading ? (
    <div className="loader-container">
      <ClipLoader color="#25b09b" size={50} />
    </div>
  ) : null;
};

export default Loader;
