import express from 'express';
import User from '../../models/userModel.js';
import cloudinary from '../../helpers/cloudinary.js';

const router = express.Router();

router.delete('/api/deleteProfileImage/:userId', async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        // Ensure profileImage is a string before attempting to delete
        const profileImagePath = Array.isArray(user.profileImage) ? user.profileImage[0] : user.profileImage;

        // Check if the user has a profile image
        if (!profileImagePath) {
            return res.status(404).json({ error: "No profile image to delete!" });
        }

        // Ensure the user has a profile image
        const profileImageObj = user.profileImage && user.profileImage[0];
        if (!profileImageObj || !profileImageObj.imageName) {
            return res.status(404).json({ error: "No profile image to delete!" });
        }

        const publicId = `user_images/${profileImageObj.imageName}`;

        // Delete image from Cloudinary
        try {
            const deletionResult = await cloudinary.uploader.destroy(publicId);
        } catch (err) {
            console.error("Error deleting image from Cloudinary:", err);
            return res.status(500).json({ error: "Failed to delete image from Cloudinary." });
        }

        // Clear the profileImage field in the user document
        user.profileImage = null;
        await user.save();

        return res.status(200).json({ success: true, message: "Profile image deleted successfully!" });
    } catch (error) {
        console.error("Error during profile image deletion:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
});

export default router;
