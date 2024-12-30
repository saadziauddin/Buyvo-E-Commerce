import React from "react";
import { useOutletContext } from "react-router-dom";
import Banner from "../Banner/Banner";
import BestSellers from "../Products/BestSellers/BestSellers";
import NewArrivals from "../Products/NewArrivals/NewArrivals";
import SpecialOffers from "../Products/SpecialOffers/SpecialOffers";
import SmallBanner from "../Products/SmallBanner/SmallBanner";

const Home = () => {
  const { selectedCurrency } = useOutletContext();
  return (
    <>
      <Banner />
      <div id="new-arrivals">
        <NewArrivals selectedCurrency={selectedCurrency} />
      </div>
      <div id="small-banner">
        <SmallBanner selectedCurrency={selectedCurrency} />
      </div>
      <BestSellers selectedCurrency={selectedCurrency} />
      <div id="special-offers">
        <SpecialOffers selectedCurrency={selectedCurrency} />
      </div>
    </>
  );
};

export default Home;
