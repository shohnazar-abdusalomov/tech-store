const { auth, optionalAuth } = require('./auth');
const { errorHandler, notFoundHandler, AppError } = require('./errorHandler');
const corsMiddleware = require('./cors');

module.exports = {
    auth,
    optionalAuth,
    errorHandler,
    notFoundHandler,
    AppError,
    corsMiddleware
};
