const { productService } = require('../services');
const { ApiResponse } = require('../utils');

class ProductController {
    async getAllProducts(req, res, next) {
        try {
            const result = await productService.getAllProducts();
            return ApiResponse.success(res, {
                products: result.data,
                count: result.count
            });
        } catch (error) {
            next(error);
        }
    }

    async getProductById(req, res, next) {
        try {
            const { id } = req.params;
            const result = await productService.getProductById(id);

            if (!result.success) {
                return ApiResponse.notFound(res, result.error);
            }

            return ApiResponse.success(res, result.data);
        } catch (error) {
            next(error);
        }
    }

    async createProduct(req, res, next) {
        try {
            const { title, price, description, rating, images } = req.body;
            const result = await productService.createProduct({
                title,
                price,
                description,
                rating,
                images
            });

            if (!result.success) {
                return ApiResponse.badRequest(res, result.error);
            }

            return ApiResponse.created(res, result.data);
        } catch (error) {
            next(error);
        }
    }

    async updateProduct(req, res, next) {
        try {
            const { id } = req.params;
            const { title, price, description, rating } = req.body;
            const result = await productService.updateProduct(id, {
                title,
                price,
                description,
                rating
            });

            if (!result.success) {
                return ApiResponse.notFound(res, result.error);
            }

            return ApiResponse.success(res, result.data);
        } catch (error) {
            next(error);
        }
    }

    async deleteProduct(req, res, next) {
        try {
            const { id } = req.params;
            const result = await productService.deleteProduct(id);

            if (!result.success) {
                return ApiResponse.notFound(res, result.error);
            }

            return ApiResponse.success(res, result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ProductController();
