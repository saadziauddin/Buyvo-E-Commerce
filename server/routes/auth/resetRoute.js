import express from 'express';
import bcrypt from 'bcrypt';
import User from '../../models/userModel.js';

const router = express.Router();

// Verify Email
router.post('/api/verifyEmail', async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email address!' });
        }
        
        return res.status(200).json({ message: 'Email verified successfully!' });
    } catch (error) {
        console.error("Error during email verification: ", error);
        return res.status(500).json({ error: 'Internal server error!' });
    }
});

// Reset Password
router.post('/api/resetPassword', async (req, res) => {
    const { email, newPassword, confirmNewPassword } = req.body;
    try {
        if (!email || !newPassword || !confirmNewPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email address!' });
        }

        // Check if new password and confirm password match
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ error: 'Password and confirm password do not match!' });
        }

        // Hash the new password
        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password in the database
        user.hashedPassword = newHashedPassword;
        user.password = newPassword;
        user.confirmPassword = confirmNewPassword;
        await user.save();

        return res.status(200).json({ message: 'Password reset successfully!' });
    } catch (error) {
        console.error("Error during password reset: ", error);
        return res.status(500).json({ error: 'Internal server error!' });
    }
});

export default router;
