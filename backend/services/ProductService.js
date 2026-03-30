const Product = require('../models/Product');

class ProductService {
    async getAllProducts() {
        try {
            const products = await Product.findAll();
            return { success: true, data: products, count: products.length };
        } catch (error) {
            throw new Error(`Failed to fetch products: ${error.message}`);
        }
    }

    async getProductById(id) {
        try {
            const product = await Product.findById(id);
            if (!product) return { success: false, error: 'Product not found' };
            return { success: true, data: product };
        } catch (error) {
            throw new Error(`Failed to fetch product: ${error.message}`);
        }
    }

    async createProduct(productData) {
        try {
            const { title, price, description, rating, category, images } = productData;
            if (!title || !price) return { success: false, error: 'Title and price are required' };
            const product = await Product.create({ title, price, description, rating, category, images });
            return { success: true, data: product };
        } catch (error) {
            throw new Error(`Failed to create product: ${error.message}`);
        }
    }

    async updateProduct(id, updateData) {
        try {
            const existing = await Product.findById(id);
            if (!existing) return { success: false, error: 'Product not found' };
            const updated = await Product.update(id, updateData);
            return { success: true, data: updated };
        } catch (error) {
            throw new Error(`Failed to update product: ${error.message}`);
        }
    }

    async deleteProduct(id) {
        try {
            const existing = await Product.findById(id);
            if (!existing) return { success: false, error: 'Product not found' };
            await Product.delete(id);
            return { success: true, message: 'Product deleted successfully', id: parseInt(id) };
        } catch (error) {
            throw new Error(`Failed to delete product: ${error.message}`);
        }
    }
}

module.exports = new ProductService();
