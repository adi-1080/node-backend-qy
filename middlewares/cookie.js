import jwt from 'jsonwebtoken'

const authenticateToken = (req, res, next) => {
    const token = req.cookies.auth_token; // Extract token from cookies

    if (!token) {
        return res.status(401).json({ error: 'Access denied. Token missing.' });
    }

    try {
        // Verify token
        const user = jwt.verify(token, process.env.SECRET_KEY); // Replace with your secret key
        req.user = user; // Attach the user data to the request
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token.' });
    }
};
