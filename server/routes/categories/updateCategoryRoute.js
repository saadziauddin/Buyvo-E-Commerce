import express from 'express';
import multer from 'multer';
import Category from '../../models/categoryModel.js';
import moment from 'moment';
import path from 'path';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../../helpers/cloudinary.js';

const router = express.Router();

// Set up Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'category_images',
        allowed_formats: ['jpeg', 'png', 'jpg'],
        public_id: (req, file) => {
            const timestamp = moment().format('DD-MM-YYYY');
            return `${timestamp}-${file.originalname.split('.')[0]}`;
        },
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 3 }, // 3MB limit
    fileFilter: (req, file, cb) => {
        if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only .png, .jpg, and .jpeg formats are allowed!'), false);
        }
    }
});

const sanitizeField = (field) => {
    if (Array.isArray(field)) {
        return field.length > 0 ? field.map(f => f.trim()).filter(f => f !== '') : null;
    }
    return typeof field === 'string' && field.trim() !== '' ? field.trim() : null;
};

const validateCategoryFields = (body) => {
    const errors = {};
    if (!body.name || body.name.trim() === '') {
        errors.name = 'Category name is required.';
    }
    return errors;
};

// Update category route
router.put('/api/updateCategory/:categoryId', (req, res) => {
    upload.single('image')(req, res, async (uploadError) => {
        if (uploadError) {
            if (uploadError instanceof multer.MulterError && uploadError.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: 'File size limit exceeds 3MB!' });
            } else if (uploadError.message) {
                return res.status(400).json({ error: uploadError.message });
            } else {
                return res.status(500).json({ error: 'An error occurred during file upload!' });
            }
        }

        const { categoryId } = req.params;
        const { name, description } = { ...req.body };

        const errors = validateCategoryFields(req.body);
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors });
        }

        try {
            const fetchedCategory = await Category.findById(categoryId);
            if (!fetchedCategory) {
                return res.status(404).json({ error: "Category not found!" });
            }

            
            let categoryImage = fetchedCategory.image;
            // If there's a new image uploaded, delete the old image
            if (req.file) {
                if (fetchedCategory.image && fetchedCategory.image[0]?.imageName && fetchedCategory.image[0]?.imagePath) {                    
                    const oldImagePublicId = `category_images/${fetchedCategory.image[0].imageName}`;

                    try {
                        const deletionResult = await cloudinary.uploader.destroy(oldImagePublicId);
                    } catch (error) {
                        console.error('Error deleting old image from Cloudinary:', error);
                    }
                }
                const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'category_images',
                    public_id: `${moment().format('DD-MM-YYYY')}-${path.parse(req.file.originalname).name}`,
                });

                categoryImage = [
                    {
                        imageName: uploadedImage.public_id.split('/').pop(),
                        imagePath: uploadedImage.secure_url,
                    },
                ];
            }

            const category = await Category.findById(categoryId);
            if (!category) {
                return res.status(404).json({ message: "Category not found!" });
            }

            const sanitizedCategory = {
                ...(category.name && {
                    name: sanitizeField(name)
                }),
                ...(category.description && {
                    description: sanitizeField(description)
                }),
                ...(category.image && {
                    image: categoryImage
                })
            };

            const updatedCategory = await Category.findByIdAndUpdate(
                categoryId,
                sanitizedCategory,
                { new: true }
            );

            if (!updatedCategory) {
                return res.status(404).json({ error: 'Category not found!' });
            }

            return res.status(200).json({ message: "Category updated successfully!" });

        } catch (error) {
            console.log("Error during updating category:", error);
            return res.status(400).json({ error: "Error during updating category!" });
        }
    });
});

export default router;
