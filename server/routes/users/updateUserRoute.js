import express from 'express';
import bcrypt from 'bcrypt';
import multer from 'multer';
import User from '../../models/userModel.js';
import moment from 'moment';
import path from 'path';
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
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
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
    if (Array.isArray(field)) {
        return field.length > 0 ? field.map(f => f.trim()).filter(f => f !== '') : null;
    }
    return typeof field === 'string' && field.trim() !== '' ? field.trim() : null;
};

router.put('/api/updateUser/:userId', (req, res) => {
    upload.single('image')(req, res, async (uploadError) => {
        if (uploadError) {
            if (uploadError instanceof multer.MulterError) {
                if (uploadError.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ error: 'File size limit exceeds 5MB!' });
                }
            } else if (uploadError.message) {
                return res.status(400).json({ error: uploadError.message });
            } else {
                return res.status(500).json({ error: 'An error occurred during file upload!' });
            }
        }

        const { userId } = req.params;
        const { firstName, lastName, email, contactNo, address, city, country, postalCode, password, confirmPassword, role } = req.body;
        const fullName = firstName + " " + lastName;
        const userName = email;

        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found!" });
            }

            let profileImage = user.profileImage;
            // If there's a new image uploaded, delete the old image
            if (req.file) {
                // Delete the old image from Cloudinary if it exists
                if (user.profileImage && user.profileImage[0]?.imageName) {
                    const oldImagePublicId = `user_images/${user.profileImage[0].imageName}`;

                    try {
                        const deletionResult = await cloudinary.uploader.destroy(oldImagePublicId);
                    } catch (error) {
                        console.error('Error deleting old image from Cloudinary:', error);
                    }
                }

                const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'user_images',
                    public_id: `${moment().format('DD-MM-YYYY')}-${path.parse(req.file.originalname).name}`,
                });

                profileImage = [
                    {
                        imageName: uploadedImage.public_id.split('/').pop(),
                        imagePath: uploadedImage.secure_url,
                    },
                ];
            }
            
            let hashedPassword = user.password;
            if (password && password.trim() !== "") {
                hashedPassword = await bcrypt.hash(password, 10);
            }

            const sanitizedUser = {
                ...(firstName && {
                    firstName: sanitizeField(firstName)
                }),
                ...(lastName && {
                    lastName: sanitizeField(lastName)
                }),
                ...(email && {
                    email: sanitizeField(email)
                }),
                ...(contactNo && {
                    contactNo: sanitizeField(contactNo)
                }),
                ...(address && {
                    address: sanitizeField(address)
                }),
                ...(city && {
                    city: sanitizeField(city)
                }),
                ...(country && {
                    country: sanitizeField(country)
                }),
                // ...(postalCode && {
                postalCode: sanitizeField(postalCode)
                // })
                ,
                ...(password && {
                    password: sanitizeField(password)
                }),
                ...(confirmPassword && {
                    confirmPassword: sanitizeField(confirmPassword)
                }),
                ...(password && {
                    hashedPassword: hashedPassword
                }),
                ...(role && {
                    role: role
                }),
                ...(req.file && {
                    profileImage: profileImage
                }),
                fullName: fullName,
                userName: userName
            };

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                sanitizedUser,
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found!' });
            }

            res.status(200).json({ message: "User updated successfully!", updatedUser });

        } catch (error) {
            console.log("Error during user updation: ", error);
            return res.status(500).json({ error: "Internal server error!" });
        }
    });
});

export default router;
