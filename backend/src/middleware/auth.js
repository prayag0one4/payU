const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('No token provided. Authorization denied.', 401);
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return next(new AppError('Invalid token.', 401));
        }
        if (err.name === 'TokenExpiredError') {
            return next(new AppError('Token expired. Please login again.', 401));
        }
        next(err);
    }
};

module.exports = authMiddleware;
