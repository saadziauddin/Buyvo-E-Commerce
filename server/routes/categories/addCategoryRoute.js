import express from 'express';
import multer from 'multer';
import Category from '../../models/categoryModel.js';
import moment from 'moment';
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

router.post('/api/categories/addCategory', (req, res) => {
    upload.single('image')(req, res, async (uploadError) => {
        if (uploadError) {
            if (uploadError instanceof multer.MulterError && uploadError.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: 'File size exceeds 3MB!' });
            } else if (uploadError.message) {
                return res.status(400).json({ error: uploadError.message });
            } else {
                return res.status(500).json({ error: 'An error occurred during file upload!' });
            }
        }

        const { name, description } = req.body;
        
        const errors = validateCategoryFields(req.body);
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors });
        }

        try {
            const image = req.file
                ? { imageName: req.file.filename.split('/').pop(), imagePath: req.file.path }
                : { imageName: null, imagePath: null };

            const sanitizedCategory = {
                name: sanitizeField(name),
                description: sanitizeField(description),
                image: image
            };

            const newCategory = new Category(sanitizedCategory);
            await newCategory.save();

            return res.status(200).json({ message: "Category uploaded successfully!" });
        } catch (error) {
            console.log("Error during adding category:", error);
            return res.status(500).json({ error: "Error during adding category!" });
        }
    });
});

export default router;
