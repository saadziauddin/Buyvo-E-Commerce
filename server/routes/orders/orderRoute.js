import express from 'express';
import mongoose from 'mongoose';
import Order from '../../models/orderModel.js';
import User from '../../models/userModel.js';
import sendOrderConfirmationEmail from '../../helpers/emailService.js';

const router = express.Router();

// Create Order
router.post('/newOrder', async (req, res) => {
  const { orderId, user, products, grandTotal, userInfo, paymentInfo, paymentStatus, orderStatus, orderCancellation } = req.body;

  // Validate required fields according to the schema
  // if (!orderId) return res.status(400).json({ message: "Order Id is required." });

  if (!user) return res.status(400).json({ message: "User email is required." });

  if (!products || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ message: "At least one product is required." });
  } else {
    for (const product of products) {
      if (!product.productName) return res.status(400).json({ message: "Product name is required for each product." });
      if (product.quantity == null || product.quantity <= 0) return res.status(400).json({ message: "Valid quantity is required for each product." });
      if (product.price == null) return res.status(400).json({ message: "Product price is required for each product." });
      if (product.totalAmount == null) return res.status(400).json({ message: "Total amount is required for each product." });
    }
  }

  if (!grandTotal) return res.status(400).json({ message: "Grand total is required." });

  if (!userInfo || typeof userInfo !== 'object') {
    return res.status(400).json({ message: "User info is required and must be an object." });
  } else {
    const { name, email, phone, shippingAddress, billingAddress, city, country } = userInfo;
    if (!name) return res.status(400).json({ message: "User name is required." });
    if (!email) return res.status(400).json({ message: "User email is required." });
    if (!phone) return res.status(400).json({ message: "User phone number is required." });
    if (!shippingAddress) return res.status(400).json({ message: "Shipping address is required." });
    if (!billingAddress) return res.status(400).json({ message: "Billing address is required." });
    if (!city) return res.status(400).json({ message: "City is required." });
    if (!country) return res.status(400).json({ message: "Country is required." });
  }

  if (!paymentStatus || !['Pending', 'Paid', 'Failed'].includes(paymentStatus)) {
    return res.status(400).json({ message: "Valid payment status is required (Pending, Paid, or Failed)." });
  }

  if (!orderStatus || !['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(orderStatus)) {
    return res.status(400).json({ message: "Valid order status is required (Processing, Shipped, Delivered, or Cancelled)." });
  }

  try {
    let existingUser = await User.findOne({ email: user });
    const userExists = !!existingUser;

    const newOrder = new Order({
      orderId,
      user,
      userExists,
      products,
      grandTotal,
      userInfo,
      paymentInfo,
      paymentStatus,
      orderStatus,
      orderCancellation
    });

    await newOrder.save();

    // Send the order confirmation email
    // await sendOrderConfirmationEmail(userInfo.email, userInfo.name, orderId, JSON.stringify(products));

    res.status(201).json({ message: 'Order Successful!', orderId: newOrder.orderId });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Internal server error!" });
  }
});

// Update Order Status
router.put('/updateOrderStatus/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { orderStatus, cancelledBy, cancelReason } = req.body;

  try {
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          orderStatus,
          orderCancellation: {
            cancelledBy,
            cancelReason
          }
        },
        { new: true }
      );

      if (!order) {
          return res.status(404).json({ error: 'Order not found' });
      }

      return res.status(200).json({ message: `Order ${orderStatus.toLowerCase()} successfully`, order });
  } catch (error) {
      console.error("Error updating order status: ", error);
      return res.status(500).json({ error: 'An error occurred while updating the order status' });
  }
});

export default router;
