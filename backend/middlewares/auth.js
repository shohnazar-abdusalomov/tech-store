const { authService } = require('../services');
const ApiResponse = require('../utils/response');

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return ApiResponse.unauthorized(res, 'No token provided');
        }

        const token = authHeader.split(' ')[1];
        const decoded = authService.verifyToken(token);

        if (!decoded) {
            return ApiResponse.unauthorized(res, 'Invalid or expired token');
        }

        req.user = decoded;
        next();
    } catch (error) {
        return ApiResponse.unauthorized(res, 'Authentication failed');
    }
};

const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = authService.verifyToken(token);
            if (decoded) {
                req.user = decoded;
            }
        }
        next();
    } catch (error) {
        next();
    }
};

module.exports = {
    auth,
    optionalAuth
};
