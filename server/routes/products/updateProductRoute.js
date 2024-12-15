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

const sanitizeAndConvert = (data, existingData = {}) => {
  const sanitizedData = {};
  const allKeys = new Set([...Object.keys(data), ...Object.keys(existingData)]);

  for (let key of allKeys) {
    const value = data[key];

    // Treat empty strings, "null" (string), and undefined as null
    if (value === undefined || value === '' || value === 'null') {
      sanitizedData[key] = null;
    } 
    // Convert numeric fields
    else if (['oldPrice', 'discount', 'stock'].includes(key)) {
      sanitizedData[key] = !isNaN(value) ? Number(value) : null;
    }
    else if (key === 'color' || key === 'size') {
      sanitizedData[key] = Array.isArray(data[key])
        ? [...new Set(data[key].map(value => value.trim()).filter(value => value !== ''))]
        : [data[key].trim()];
    }
    // Handle strings (trim whitespace)
    else {
      sanitizedData[key] = typeof value === 'string' ? value.trim() : value;
    }
  }

  return sanitizedData;
};

const validateProductFields = (body) => {
  const errors = {};
  // Validate required fields
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
  // Validate color and size for duplicates
  if (Array.isArray(body.color)) {
    body.color = [...new Set(body.color.map(c => c.trim()).filter(c => c !== ''))];
  }
  if (Array.isArray(body.size)) {
    body.size = [...new Set(body.size.map(s => s.trim()).filter(s => s !== ''))];
  }
  return errors;
};

router.put('/api/updateProduct/:productId', (req, res) => {
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

    const { productId } = req.params;
    const errors = validateProductFields(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    try {
      const existingProduct = await Product.findById(productId);
      if (!existingProduct) {
        return res.status(404).json({ error: 'Product not found!' });
      }

      const { name, color, size, tags, stock, category, discount, status, newPrice, oldPrice, shortDescription, longDescription, youtubeVideoLink } = sanitizeAndConvert(req.body);

      // If new images are uploaded, update the images
      let updatedImages = existingProduct.images;
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map((file) => ({
          imageName: file.filename.split('/').pop(),
          imagePath: file.path
        }));
        updatedImages = [...updatedImages, ...newImages];
      }

      const sanitizedProduct = {
        name: name || null,
        color: color || null,
        size: size || null,
        tags: tags || null,
        stock: stock || null,
        category: category || null,
        discount: discount || null,
        status: status || null,
        newPrice: newPrice || null,
        oldPrice: oldPrice || null,
        youtubeVideoLink: youtubeVideoLink || null,
        shortDescription: shortDescription || null,
        longDescription: longDescription || null,
        images: updatedImages || null,
      };
      
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        sanitizedProduct,
        { new: true }
      );
      
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found!' });
      }

      res.status(200).json({ message: 'Product updated successfully!', updatedProduct });
    } catch (error) {
      console.error('Error updating product:', error.message);
      res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
  });
});

export default router;
