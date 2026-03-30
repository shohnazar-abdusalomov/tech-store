const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

class Validators {
    static productValidation = {
        create: [
            body('title').trim().notEmpty().withMessage('Title is required')
                .isLength({ max: 255 }).withMessage('Title must be less than 255 characters'),
            body('price').notEmpty().withMessage('Price is required')
                .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
            body('description').optional().trim()
                .isLength({ max: 2000 }).withMessage('Description must be less than 2000 characters'),
            body('rating').optional()
                .isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
            body('images').optional().isArray().withMessage('Images must be an array'),
            handleValidationErrors
        ],
        update: [
            param('id').isInt({ min: 1 }).withMessage('Invalid product ID'),
            body('title').optional().trim().notEmpty().withMessage('Title cannot be empty')
                .isLength({ max: 255 }).withMessage('Title must be less than 255 characters'),
            body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
            body('description').optional().trim()
                .isLength({ max: 2000 }).withMessage('Description must be less than 2000 characters'),
            body('rating').optional()
                .isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
            handleValidationErrors
        ],
        getById: [
            param('id').isInt({ min: 1 }).withMessage('Invalid product ID'),
            handleValidationErrors
        ],
        delete: [
            param('id').isInt({ min: 1 }).withMessage('Invalid product ID'),
            handleValidationErrors
        ]
    };

    static authValidation = {
        register: [
            body('email').trim().notEmpty().withMessage('Email is required')
                .isEmail().withMessage('Invalid email format'),
            body('username').trim().notEmpty().withMessage('Username is required')
                .isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters'),
            body('password').notEmpty().withMessage('Password is required')
                .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
            handleValidationErrors
        ],
        login: [
            body('email').trim().notEmpty().withMessage('Email is required')
                .isEmail().withMessage('Invalid email format'),
            body('password').notEmpty().withMessage('Password is required'),
            handleValidationErrors
        ]
    };
}

module.exports = Validators;
