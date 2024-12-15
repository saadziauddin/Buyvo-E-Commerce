import express from 'express';
import mongoose from 'mongoose';
import Category from '../../models/categoryModel.js';

const router = express.Router();

// Fetch Categories
router.get('/api/fetchCategories', async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json(categories);
    } catch (error) {
        console.log("Error fetching categories: ", error);
    }
});

// Fetch Category by Id
router.get('/api/fetchCategoryById/:categoryId', async (req, res) => {
    const categoryId = new mongoose.Types.ObjectId(req.params.categoryId);
    try {
        const category = await Category.find({_id: categoryId});

        return res.status(200).json({category});
    } catch (error) {
        console.log("Error fetching category by Id: ", error);
    }
});

// Fetch Categories excuding which I don't want
router.get('/api/fetchOnlyRequiredCategories', async (req, res) => {
    const excludedCategories = ["New Arrivals", "Best Sellers", "Special Offers"];
    
    try {
      const categories = await Category.find({ name: { $nin: excludedCategories } });
      return res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching categories: ", error);
      return res.status(500).json({ message: "Failed to fetch categories", error });
    }
  });
  

export default router;
