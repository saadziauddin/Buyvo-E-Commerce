// import express from 'express';
// import Product from '../../models/productModel.js';
// import cloudinary from '../../helpers/cloudinary.js';

// const router = express.Router();

// router.delete('/api/deleteProduct', async (req, res) => {
//     const { ProductId } = req.query;

//     if (!ProductId) {
//         return res.status(400).json({ message: "Product ID is required" });
//     }

//     try {
//         const product = await Product.findById(ProductId);
//         if (!product) {
//             return res.status(404).json({ error: "Product not found!" });
//         }

//         // Check if the product has images and delete them from Cloudinary
//         if (product.images && product.images.length > 0) {
//             for (const imageObj of product.images) {
//                 if (imageObj && imageObj.imageName) {
//                     try {
//                         const fullPublicId = `product_images/${imageObj.imageName}`;
//                         const result = await cloudinary.uploader.destroy(fullPublicId);
//                         // console.log(`Cloudinary image deleted: ${fullPublicId}`, result);
//                     } catch (err) {
//                         console.error(`Error deleting Cloudinary image ${fullPublicId}:`, err);
//                     }
//                 }
//             }
//         }

//         // Delete the product from the database
//         const deleteProduct = await Product.deleteOne({ _id: ProductId });
//         if (!deleteProduct) {
//             return res.status(400).json({ error: "Product not deleted!" });
//         }
//         return res.status(200).json({ message: "Product and images deleted successfully!" });
//     } catch (error) {
//         console.error("Error during deletion:", error);
//         return res.status(500).json({ message: "Internal server error", error });
//     }
// });

// export default router;

import express from 'express';
import Product from '../../models/productModel.js';
import { supabase } from '../../helpers/supabaseClient.js';

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

        // Check if the product has images and delete them from Supabase
        if (product.images && product.images.length > 0) {
            for (const imageObj of product.images) {
                if (imageObj?.imageName) {
                    const bucketName = 'Images';
                    const filePath = `Product Images/${imageObj.imageName}`;

                    try {
                        const { error: supabaseError } = await supabase.storage
                            .from(bucketName)
                            .remove([filePath]);

                        if (supabaseError) {
                            console.log(`Supabase error while deleting ${filePath}:`, supabaseError.message);
                            console.error(`Supabase error while deleting ${filePath}:`, supabaseError.message);
                            continue; // Continue to next image even if one deletion fails
                        }
                    } catch (deletionError) {
                        console.error(`Unexpected error during deletion of ${filePath}:`, deletionError);
                    }
                } else {
                    console.warn("Invalid or missing image object:", imageObj);
                }
            }
        }

        // Delete the product from the database
        const deleteResult = await Product.deleteOne({ _id: ProductId });
        if (!deleteResult.deletedCount) {
            return res.status(400).json({ error: "Product not deleted!" });
        }

        return res.status(200).json({ message: "Product and images deleted successfully!" });
    } catch (error) {
        console.error("Error during product deletion:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

export default router;
