const express = require('express');
const router = express.Router();
const { ProductController } = require('../controllers');
const { Validators } = require('../utils');
const { auth } = require('../middlewares');

router.get('/', ProductController.getAllProducts);

router.get(
    '/:id',
    Validators.productValidation.getById,
    ProductController.getProductById
);

router.post(
    '/',
    auth,
    Validators.productValidation.create,
    ProductController.createProduct
);

router.put(
    '/:id',
    auth,
    Validators.productValidation.update,
    ProductController.updateProduct
);

router.delete(
    '/:id',
    auth,
    Validators.productValidation.delete,
    ProductController.deleteProduct
);

module.exports = router;
