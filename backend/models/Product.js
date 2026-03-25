const db = require('../config/database');

// Product category to image mapping - relevant images based on keywords
const categoryImages = {
    // Smartphones
    iphone: [
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&h=600&fit=crop'
    ],
    phone: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&h=600&fit=crop'
    ],
    samsung: [
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=600&fit=crop'
    ],
    // Laptops
    macbook: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop'
    ],
    laptop: [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=600&fit=crop'
    ],
    // Audio
    airpod: [
        'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1588423771073-b3aacb4d2f46?w=800&h=600&fit=crop'
    ],
    earbud: [
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&h=600&fit=crop'
    ],
    headphone: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop'
    ],
    // Tablets
    ipad: [
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&h=600&fit=crop'
    ],
    tablet: [
        'https://images.unsplash.com/photo-1559656914-a30970c1affd?w=800&h=600&fit=crop'
    ],
    // Smartwatches
    watch: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=600&fit=crop'
    ],
    // Default tech images
    default: [
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop'
    ]
};

// Get relevant images based on product title
function getRelevantImages(title) {
    const titleLower = title.toLowerCase();
    
    for (const [category, images] of Object.entries(categoryImages)) {
        if (titleLower.includes(category)) {
            return images;
        }
    }
    
    return categoryImages.default;
}

class Product {
    static findAll() {
        const products = db.prepare(`
            SELECT id, title, price, description, rating, created_at
            FROM products ORDER BY created_at DESC
        `).all();
        
        const getImages = db.prepare('SELECT id, url, product_id FROM images WHERE product_id = ?');
        
        return products.map(product => ({
            ...product,
            images: getImages.all(product.id)
        }));
    }

    static findById(id) {
        const product = db.prepare(`
            SELECT id, title, price, description, rating, created_at
            FROM products WHERE id = ?
        `).get(id);
        
        if (!product) return null;
        
        const images = db.prepare('SELECT id, url, product_id FROM images WHERE product_id = ?').all(id);
        
        return { ...product, images };
    }

    static create({ title, price, description, rating, images }) {
        const result = db.prepare(`
            INSERT INTO products (title, price, description, rating)
            VALUES (?, ?, ?, ?)
        `).run(title, price, description, rating || 0);
        
        const newProductId = result.lastInsertRowid;
        
        const productImages = (images && Array.isArray(images) && images.length > 0) 
            ? images 
            : getRelevantImages(title);
        
        if (productImages && productImages.length > 0) {
            const insertImage = db.prepare('INSERT INTO images (product_id, url) VALUES (?, ?)');
            for (const url of productImages) {
                insertImage.run(newProductId, url);
            }
        }
        
        return this.findById(newProductId);
    }

    static update(id, { title, price, description, rating }) {
        const fields = [];
        const values = [];
        
        if (title !== undefined) { fields.push('title = ?'); values.push(title); }
        if (price !== undefined) { fields.push('price = ?'); values.push(price); }
        if (description !== undefined) { fields.push('description = ?'); values.push(description); }
        if (rating !== undefined) { fields.push('rating = ?'); values.push(rating); }
        
        if (fields.length === 0) return null;
        
        values.push(id);
        
        db.prepare(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`).run(...values);
        return this.findById(id);
    }

    static delete(id) {
        db.prepare('DELETE FROM products WHERE id = ?').run(id);
        return { id };
    }
}

module.exports = Product;
