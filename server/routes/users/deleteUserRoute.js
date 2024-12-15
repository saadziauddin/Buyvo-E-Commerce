import express from 'express';
import User from '../../models/userModel.js';
import cloudinary from '../../helpers/cloudinary.js';

const router = express.Router();

router.delete('/api/deleteUser', async (req, res) => {
    const { UserId } = req.query;
    if (!UserId) {
        return res.status(400).json({ message: "UserId is required" });
    }
    
    try {
        const user = await User.findById(UserId);
        if (!user) {
            return res.status(400).json({ error: "User not found!" });
        }

        const profileImageObj = user.profileImage && user.profileImage[0];
        if (profileImageObj && profileImageObj.imagePath) {
            const publicId = `user_images/${profileImageObj.imageName}`;
            // Delete image from Cloudinary
            try {
                const deletionResult = await cloudinary.uploader.destroy(publicId);
            } catch (err) {
                console.error("Error deleting image from Cloudinary:", err);
                return res.status(500).json({ error: "Failed to delete image from Cloudinary." });
            }
        }

        const deleteUser = await User.deleteOne({ _id: UserId });
        if (!deleteUser.deletedCount) {
            res.status(400).json({ error: "User not deleted!" });
        } else {
            res.status(200).json({ message: "User deleted successfully!" });
        }
    } catch (error) {
        console.error("Error during deletion: ", error);
        res.status(500).json({ message: "Internal server error: ", error });
    }
});

export default router;
