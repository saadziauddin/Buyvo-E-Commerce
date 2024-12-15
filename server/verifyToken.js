import jwt from 'jsonwebtoken'; 

const verifyToken = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    // console.log('Token received in cookie:', req.cookies.token);
    if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

    else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: "Token is not correct!" });
            } else {
                req.id = decoded.id;
                req.name = decoded.name;
                req.role = decoded.role;
                req.email = decoded.email;
                req.image = decoded.image;
                next();
            }
        });        
    }
};

export default verifyToken;

