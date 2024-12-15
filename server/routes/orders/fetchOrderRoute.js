import express from 'express';
import Order from '../../models/orderModel.js';
import mongoose from 'mongoose';

const router = express.Router();

// Fetch Orders
router.get('/fetchOrders', async (req, res) => {
    try {
        const orders = await Order.find();
        return res.status(200).json(orders);
    } catch (error) {
        console.log("Error fetching orders: ", error);
        return res.status(500).json({error: "Internal server error while fetching orders!"});
    }
});

// Fetch All Orders By User Email
router.get('/fetchOrdersByEmail/:useremail', async (req, res) => {
    const { useremail } = req.params;
    try {
        const orders = await Order.find({user: useremail});
        if (!orders) {
            return res.status(404).json({ error: "Orders not found" });
        }
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders by Id:", error);
        res.status(500).json({ error: "Internal server error!" });
    }
});

// Fetch Order By OrderId
router.get('/fetchOrderById/:orderId', async (req, res) => {
    const { orderId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ error: "Invalid Order ID!" });
    }

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error("Error fetching order by Id:", error);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
