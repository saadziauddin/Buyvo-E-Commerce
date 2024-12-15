import express from 'express';
import Product from '../../models/productModel.js';
import mongoose from 'mongoose';

const router = express.Router();

// Fetch Products
router.get('/api/fetchProducts', async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json(products);
    } catch (error) {
        console.log("Error fetching products: ", error);
        return res.status(500).json({error: "Internal server error while fetching products!"});
    }
});

// Fetch Product by Id
router.get('/api/fetchProductById/:productId', async (req, res) => {
    const productId = new mongoose.Types.ObjectId(req.params.productId);
    try {
        const product = await Product.find({_id: productId});
        return res.status(200).json({product});
    } catch (error) {
        console.log("Error fetching product by Id: ", error);
    }
});

// Fetch Product by Category
router.get('/api/fetchProductByCategory/:categoryName', async (req, res) => {
    const categoryName = req.params.categoryName;
    try {
        const fetchCategory = await Product.find({ category: { $in: [categoryName] } });
        return res.status(200).json({ fetchCategory });
    } catch (error) {
        console.error("Error fetching product by Category: ", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Fetch products whose category includes "New Arrivals"
router.get('/api/fetchProductsByCategory/newArrivals', async (req, res) => {
    try {
        const products = await Product.find({ category: { $in: ['New Arrivals'] } });
        return res.status(200).json({ products });
    } catch (error) {
        console.error("Error fetching products whose category = New Arrivals: ", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Fetch products whose category includes "Best Sellers"
router.get('/api/fetchProductsByCategory/bestSellers', async (req, res) => {
    try {
        const products = await Product.find({ category: { $in: ['Best Sellers'] } });
        return res.status(200).json({ products });
    } catch (error) {
        console.error("Error fetching products whose category = Best Sellers: ", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Fetch products whose category includes "Special Offers"
router.get('/api/fetchProductsByCategory/specialOffers', async (req, res) => {
    try {
        const products = await Product.find({ category: { $in: ['Special Offers'] } });
        return res.status(200).json({ products });
    } catch (error) {
        console.error("Error fetching products whose category = Special Offers: ", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Fetch Product by Name
router.get('/api/fetchProductByName/:productName', async (req, res) => {
    const productName = req.params.productName;
    try {
        const fetchProducts = await Product.find({ name: productName});
        return res.status(200).json({ fetchProducts });
    } catch (error) {
        console.error("Error fetching product by name: ", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
