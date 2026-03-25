const { authService } = require('../services');
const { ApiResponse } = require('../utils');

class AuthController {
    async register(req, res, next) {
        try {
            const { email, username, password } = req.body;
            const result = await authService.register({ email, username, password });

            if (!result.success) {
                return ApiResponse.error(res, result.error, result.statusCode);
            }

            return ApiResponse.created(res, result.data);
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await authService.login({ email, password });

            if (!result.success) {
                return ApiResponse.unauthorized(res, result.error);
            }

            return ApiResponse.success(res, result.data);
        } catch (error) {
            next(error);
        }
    }

    async getProfile(req, res, next) {
        try {
            const result = await authService.getUserById(req.user.id);

            if (!result.success) {
                return ApiResponse.notFound(res, result.error);
            }

            return ApiResponse.success(res, result.data);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();
