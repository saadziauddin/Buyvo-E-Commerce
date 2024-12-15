import express from 'express';
import multer from 'multer';
import Product from '../../models/productModel.js';
import moment from 'moment';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../../helpers/cloudinary.js';

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'product_images',
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
    // Trim, filter out empty strings, and deduplicate
    return [...new Set(field.map(f => f.trim()).filter(f => f !== ''))];
  }
  // Handle single string fields
  return typeof field === 'string' && field.trim() !== '' ? field.trim() : null;
};

const validateProductFields = (body) => {
  const errors = {};

  if (!body.name || body.name.trim() === '') {
    errors.name = 'Product name is required.';
  }
  if (!body.newPrice || isNaN(body.newPrice)) {
    errors.newPrice = 'Valid price is required.';
  }
  if (!body.category || !Array.isArray(body.category) || body.category.length === 0) {
    errors.category = 'Product category is required.';
  }  
  if (!body.stock || isNaN(body.stock)) {
    errors.stock = 'Valid stock quantity is required.';
  }

  // Deduplicate color and size fields
  if (Array.isArray(body.color)) {
    body.color = [...new Set(body.color.map(c => c.trim()).filter(c => c !== ''))];
  }
  if (Array.isArray(body.size)) {
    body.size = [...new Set(body.size.map(s => s.trim()).filter(s => s !== ''))];
  }

  return errors;
};

router.post('/api/products/addProduct', (req, res) => {
  upload.array('images', 10)(req, res, async (uploadError) => {
    if (uploadError) {
      if (uploadError instanceof multer.MulterError) {
        if (uploadError.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File size limit exceeds 3MB!' });
        }
        if (uploadError.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({ error: 'You can only upload up to 10 images at a time!' });
        }
      } else if (uploadError.message) {
        return res.status(400).json({ error: uploadError.message });
      } else {
        return res.status(500).json({ error: 'An error occurred during file upload!' });
      }
    }

    const {
      name,
      color,
      size,
      tags,
      stock,
      category,
      discount,
      status,
      newPrice,
      oldPrice,
      shortDescription,
      longDescription,
      youtubeVideoLink
    } = req.body;

    const errors = validateProductFields(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    if (!name || !category || !status || !newPrice || !shortDescription || !longDescription) {
      return res.status(400).json({ error: "Missing required fields e.g. Product Name, Category, Status, New Price, Short and Long Description." })
    }

    try {
      const images = req.files && req.files.length > 0
        ? req.files.map(file => ({
          imageName: file.filename.split('/').pop(),
          imagePath: file.path
        }))
        : [{ imageName: null, imagePath: null }];

      const sanitizedProduct = {
        name: sanitizeField(name),
        color: sanitizeField(color),
        size: sanitizeField(size),
        tags: sanitizeField(tags),
        stock: sanitizeField(stock),
        category: sanitizeField(category),
        discount: sanitizeField(discount),
        status: sanitizeField(status),
        newPrice: sanitizeField(newPrice),
        oldPrice: sanitizeField(oldPrice),
        shortDescription: sanitizeField(shortDescription),
        longDescription: sanitizeField(longDescription),
        youtubeVideoLink: sanitizeField(youtubeVideoLink),
        images,
      };

      const newProduct = new Product(sanitizedProduct);
      await newProduct.save();

      res.status(201).json({ message: 'Product added successfully!' });
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({ message: 'Error adding product', error: error.message });
    }
  });
});

export default router;
