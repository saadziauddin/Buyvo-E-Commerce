import express from 'express';
import Category from '../../models/categoryModel.js';
import cloudinary from '../../helpers/cloudinary.js';

const router = express.Router();

router.delete('/api/deleteCategory', async (req, res) => {
    const { CategoryId } = req.query;
    if (!CategoryId) {
        return res.status(400).json({ message: "Category Id is required" });
    }
    
    try {
        const category = await Category.findById(CategoryId);
        if (!category) {
            return res.status(400).json({ error: "Category not found!" });
        }

        const imageObj = category.image[0];
        if (imageObj && imageObj.imagePath) {
            const publicId = `category_images/${imageObj.imageName}`;
            // Delete image from Cloudinary
            try {
                const deletionResult = await cloudinary.uploader.destroy(publicId);
            } catch (err) {
                console.error("Error deleting image from Cloudinary:", err);
                return res.status(500).json({ error: "Failed to delete image from Cloudinary." });
            }
        }

        const deleteCategory = await Category.deleteOne({ _id: CategoryId });
        if (!deleteCategory.deletedCount) {
            return res.status(400).json({ error: "Category not deleted!" });
        }

        return res.status(200).json({ message: "Category deleted successfully!" });
    } catch (error) {
        console.error("Error during deletion: ", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

export default router;
