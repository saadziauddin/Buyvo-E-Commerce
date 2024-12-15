import React from "react";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import ThankYou from "../Thankyou/Thankyou";

const Payment = () => {
  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Payment gateway" />
      <div className="pb-3 font-titleFont text-center">
        <p>Payment gateway is currently not integrated, we are currently providing only cash on delivery.</p>
        <ThankYou />
      </div>
    </div>
  );
};

export default Payment;
