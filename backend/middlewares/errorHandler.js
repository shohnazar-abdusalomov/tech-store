const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            success: false,
            error: 'Invalid JSON payload'
        });
    }

    if (err.code === '23505') {
        return res.status(409).json({
            success: false,
            error: 'Duplicate entry exists'
        });
    }

    if (err.code === '23503') {
        return res.status(400).json({
            success: false,
            error: 'Referenced resource does not exist'
        });
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        error: `Route ${req.originalUrl} not found`
    });
};

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = {
    errorHandler,
    notFoundHandler,
    AppError
};
