import express from 'express';
import bcrypt from 'bcrypt';
import multer from 'multer';
import User from '../../models/userModel.js';
import Role from '../../models/roleModel.js';
import moment from 'moment';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../../helpers/cloudinary.js';

const router = express.Router();

// Set up Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'user_images',
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
    },
});

// Sanitize field function
const sanitizeField = (field) => {
    return typeof field === 'string' && field.trim() !== '' ? field.trim() : null;
};

// Validation for required fields
const validateFields = (body) => {
    const errors = {};

    if (!body.firstName || body.firstName.trim() === '') {
        errors.firstName = 'First Name is required.';
    }
    if (!body.lastName || body.lastName.trim() === '') {
        errors.lastName = 'Last Name is required.';
    }
    if (!body.email || body.email.trim() === '') {
        errors.email = 'Email is required.';
    }
    if (!body.contactNo || body.contactNo.trim() === '') {
        errors.contactNo = 'Contact Number is required.';
    }
    if (!body.address || body.address.trim() === '') {
        errors.address = 'Address is required.';
    }
    if (!body.city || body.city.trim() === '') {
        errors.city = 'City is required.';
    }
    if (!body.country || body.country.trim() === '') {
        errors.country = 'Country is required.';
    }
    if (!body.password || body.password.trim() === '') {
        errors.password = 'Password is required.';
    }
    if (!body.confirmPassword || body.confirmPassword.trim() === '') {
        errors.confirmPassword = 'Confirm Password is required.';
    }

    return errors;
};

router.post('/api/signup', (req, res) => {
    upload.single('profileImage')(req, res, async (uploadError) => {
        if (uploadError) {
            if (uploadError instanceof multer.MulterError) {
                if (uploadError.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ error: 'File size limit exceeds 3MB!' });
                }
            } else {
                return res.status(400).json({ error: uploadError.message });
            }
        }

        const { firstName, lastName, email, contactNo, address, city, country, postalCode, password, confirmPassword, role } = req.body;

        const fullName = sanitizeField(firstName) + " " + sanitizeField(lastName);
        
        const userName = sanitizeField(email);

        const errors = validateFields(req.body);
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Password and confirm password do not match!" });
        }

        try {
            const existingUser = await User.findOne({ email: email });
            if (existingUser) {
                return res.status(400).json({ error: "Email already exists, use another email for sign up!" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const profileImage = req.file
                ? { imageName: req.file.filename.split('/').pop(), imagePath: req.file.path }
                : { imageName: null, imagePath: null };

            const sanitizedUser = {
                firstName: sanitizeField(firstName),
                lastName: sanitizeField(lastName),
                email: sanitizeField(email),
                contactNo: sanitizeField(contactNo),
                address: sanitizeField(address),
                city: sanitizeField(city),
                country: sanitizeField(country),
                postalCode: sanitizeField(postalCode),
                // password: sanitizeField(password),
                // confirmPassword: sanitizeField(confirmPassword),
                hashedPassword: hashedPassword,
                userRole: role,
                profileImage: profileImage,
                fullName: fullName,
                userName: userName,
            };

            const newUser = new User(sanitizedUser);
            await newUser.save();

            res.status(200).json({ message: "Registration successful!" });
        } catch (error) {
            console.error('Error during registration: ', error);
            res.status(500).json({ error: "Internal server error" });
        }
    });
});

export default router;
