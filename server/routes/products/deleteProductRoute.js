import express from 'express';
import Product from '../../models/productModel.js';
import cloudinary from '../../helpers/cloudinary.js';

const router = express.Router();

router.delete('/api/deleteProduct', async (req, res) => {
    const { ProductId } = req.query;
    
    if (!ProductId) {
        return res.status(400).json({ message: "Product ID is required" });
    }

    try {
        const product = await Product.findById(ProductId);
        if (!product) {
            return res.status(404).json({ error: "Product not found!" });
        }

        // Check if the product has images and delete them from Cloudinary
        if (product.images && product.images.length > 0) {
            for (const imageObj of product.images) {
                if (imageObj && imageObj.imageName) {
                    try {
                        const fullPublicId = `product_images/${imageObj.imageName}`;
                        const result = await cloudinary.uploader.destroy(fullPublicId);
                        // console.log(`Cloudinary image deleted: ${fullPublicId}`, result);
                    } catch (err) {
                        console.error(`Error deleting Cloudinary image ${fullPublicId}:`, err);
                    }
                }
            }
        }

        // Delete the product from the database
        const deleteProduct = await Product.deleteOne({ _id: ProductId });
        if (!deleteProduct) {
            return res.status(400).json({ error: "Product not deleted!" });
        }
        return res.status(200).json({ message: "Product and images deleted successfully!" });
    } catch (error) {
        console.error("Error during deletion:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
});

export default router;
