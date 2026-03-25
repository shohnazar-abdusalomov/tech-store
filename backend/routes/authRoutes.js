const express = require('express');
const router = express.Router();
const { AuthController } = require('../controllers');
const { Validators } = require('../utils');
const { auth } = require('../middlewares');

router.post(
    '/register',
    Validators.authValidation.register,
    AuthController.register
);

router.post(
    '/login',
    Validators.authValidation.login,
    AuthController.login
);

router.get(
    '/profile',
    auth,
    AuthController.getProfile
);

module.exports = router;
