import express from 'express';
const router = express.Router();

router.get('/api/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,       // Prevent JavaScript access
        secure: true,         // Send only over HTTPS
        sameSite: 'None',     // Required for cross-origin cookies
        path: '/', // Matches the path used when setting the cookie
    });
    return res.json({ Status: "Success" });
});

export default router;
