// import express from 'express';
// import Product from '../../models/productModel.js';
// import cloudinary from '../../helpers/cloudinary.js';

// const router = express.Router();

// router.delete('/api/deleteProductImage/:productId', async (req, res) => {
//     const { productId } = req.params;
//     const { publicId } = req.body;

//     if (!productId) {
//         return res.status(400).json({ message: "Product ID is required" });
//     }
//     if (!publicId) {
//         return res.status(400).json({ message: "Cloudinary Public ID is required" });
//     }

//     try {
//         const product = await Product.findById(productId);
//         if (!product) {
//             return res.status(404).json({ error: "Product not found!" });
//         }

//         // Find the image by its publicId
//         const imageToRemove = product.images.find(image => image.publicId === publicId);
//         if (!imageToRemove) {
//             return res.status(404).json({ error: "Image not found!" });
//         }

//         const fullPublicId = `product_images/${publicId}`;

//         // Remove the image from Cloudinary
//         await cloudinary.uploader.destroy(fullPublicId, (error, result) => {
//             if (error) {
//                 console.error("Cloudinary deletion error:", error);
//                 return res.status(500).json({ message: "Failed to delete image from Cloudinary", error });
//             }
//             // console.log("Cloudinary deletion result:", result);
//         });

//         // Remove the image from the product's images array
//         product.images = product.images.filter(image => image.publicId !== publicId);
//         await product.save();

//         return res.status(200).json({ success: true, message: "Image deleted successfully!" });
//     } catch (error) {
//         console.error("Error during image deletion:", error);
//         return res.status(500).json({ message: "Internal server error", error });
//     }
// });

// export default router;

import express from 'express';
import Product from '../../models/productModel.js';
import { supabase } from '../../helpers/supabaseClient.js'; // Supabase client initialization

const router = express.Router();

router.delete('/api/deleteProductImage/:productId', async (req, res) => {
    const { productId } = req.params;
    const { publicId } = req.body;

    if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
    }
    if (!publicId) {
        return res.status(400).json({ message: "Image name is required" });
    }

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found!" });
        }

        // Find the image by its path
        const imageToRemove = product.images.find(image => image.imageName === publicId);
        if (!imageToRemove) {
            return res.status(404).json({ error: "Image not found!" });
        }

        // Extract the bucket and path from the imagePath
        const bucketName = 'Images';
        const filePath = `Product Images/${publicId}`;

        // Delete the image from Supabase storage
        const { error: supabaseError } = await supabase.storage.from(bucketName).remove([filePath]);
        if (supabaseError) {
            console.error("Error deleting image from Supabase:", supabaseError);
            return res.status(500).json({ message: "Failed to delete image from Supabase", error: supabaseError.message });
        }

        // Remove the image from the MongoDB product document
        product.images = product.images.filter(image => image.publicId !== publicId);
        await product.save();

        return res.status(200).json({ success: true, message: "Image deleted successfully!" });
    } catch (error) {
        console.error("Error during image deletion:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
});

export default router;
