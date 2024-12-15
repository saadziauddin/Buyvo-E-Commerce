import express from 'express';
import Product from '../../models/productModel.js';
import Category from '../../models/categoryModel.js';

const router = express.Router();

router.get('/api/search', async (req, res) => {
    const searchTerm = req.query.term;
    if (!searchTerm || searchTerm.trim() === '') {
        return res.status(400).json({ error: 'Search term is required.' });
    }

    try {
        // Case-insensitive regex for text fields
        const searchRegex = new RegExp(searchTerm, 'i');

        // Convert to a number if the searchTerm is numeric
        const numericSearchTerm = !isNaN(searchTerm) ? Number(searchTerm) : null;

        const [products, categories] = await Promise.all([
            Product.find({
                $or: [
                    { name: searchRegex },
                    { category: { $in: [searchRegex] } }, // Match the term within the array
                    { color: searchRegex },
                    { size: searchRegex },
                    // Numeric fields
                    ...(numericSearchTerm !== null
                        ? [
                            { discount: numericSearchTerm },
                            { newPrice: numericSearchTerm },
                            { oldPrice: numericSearchTerm }
                        ]
                        : [])
                ]
            }).lean(),

            Category.find({
                $or: [
                    { name: searchRegex },
                ]
            }).lean()
        ]);

        // Return only products and categories that matched
        return res.status(200).json({ products, categories });
    } catch (error) {
        console.error("Error during search:", error);
        return res.status(500).json({ error: "An error occurred during search." });
    }
});

export default router;
