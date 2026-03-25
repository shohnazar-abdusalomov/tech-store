const Product = require('../models/Product');

class ProductService {
    getAllProducts() {
        try {
            const products = Product.findAll();
            return {
                success: true,
                data: products,
                count: products.length
            };
        } catch (error) {
            throw new Error(`Failed to fetch products: ${error.message}`);
        }
    }

    getProductById(id) {
        try {
            const product = Product.findById(id);
            if (!product) {
                return {
                    success: false,
                    error: 'Product not found',
                    statusCode: 404
                };
            }
            return {
                success: true,
                data: product
            };
        } catch (error) {
            throw new Error(`Failed to fetch product: ${error.message}`);
        }
    }

    createProduct(productData) {
        try {
            const { title, price, description, rating, images } = productData;

            if (!title || !price) {
                return {
                    success: false,
                    error: 'Title and price are required',
                    statusCode: 400
                };
            }

            const product = Product.create({
                title,
                price,
                description,
                rating,
                images
            });

            return {
                success: true,
                data: product,
                statusCode: 201
            };
        } catch (error) {
            throw new Error(`Failed to create product: ${error.message}`);
        }
    }

    updateProduct(id, updateData) {
        try {
            const existingProduct = Product.findById(id);
            if (!existingProduct) {
                return {
                    success: false,
                    error: 'Product not found',
                    statusCode: 404
                };
            }

            Product.update(id, updateData);
            const updatedProduct = Product.findById(id);

            return {
                success: true,
                data: updatedProduct
            };
        } catch (error) {
            throw new Error(`Failed to update product: ${error.message}`);
        }
    }

    deleteProduct(id) {
        try {
            const existingProduct = Product.findById(id);
            if (!existingProduct) {
                return {
                    success: false,
                    error: 'Product not found',
                    statusCode: 404
                };
            }

            Product.delete(id);

            return {
                success: true,
                message: 'Product deleted successfully',
                id: parseInt(id)
            };
        } catch (error) {
            throw new Error(`Failed to delete product: ${error.message}`);
        }
    }
}

module.exports = new ProductService();
