import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/userModel.js';

const router = express.Router();

router.post('/api/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) { return res.status(400).json({ error: "User not found!" }) }

        const isPasswordMatch = await bcrypt.compare(password.toString(), user.hashedPassword);
        if (!isPasswordMatch) { return res.status(400).json({ error: "Password not matched!" }) }

        const profileImage = (user.profileImage && user.profileImage[0].imageName && user.profileImage[0].imagePath) ? user.profileImage[0].imagePath : null;

        const token = jwt.sign(
            {
                id: user._id,
                name: user.fullName,
                email: user.email,
                role: user.role,
                image: profileImage
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,       // Prevent JavaScript access
            secure: true,         // Send only over HTTPS
            sameSite: 'None',     // Required for cross-origin cookies
            path: '/', // Matches the path used when setting the cookie
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        
        return res.status(200).json({
            // token,
            Status: "Success",
            message: "Login Successfull!",
            id: user._id,
            name: user.fullName,
            email: user.email,
            role: user.role,
            image: profileImage
        });

    } catch (error) {
        console.log("Error during login: ", error);
        return res.status(500).json({ error: "Internal server error!" });
    }
});

export default router;
