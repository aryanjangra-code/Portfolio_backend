const jwt = require('jsonwebtoken');

const requireAdminAuth = (req, res, next) => {
    // Look for the token in the cookies
    const token = req.cookies.adminToken;

    if (!token) {
        return res.status(401).json({ error: 'Authentication required. Please log in.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Make sure it's the admin role
        if (decoded.role !== 'admin') {
            throw new Error('Unauthorized role');
        }
        
        next(); // Token is valid, proceed to the route
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
    }
};

module.exports = { requireAdminAuth };