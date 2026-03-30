const pool = require('../config/database');

class Product {
    static async findAll() {
        const { rows: products } = await pool.query(
            'SELECT id, title, price, description, rating, category, created_at FROM products ORDER BY created_at DESC'
        );
        const { rows: images } = await pool.query('SELECT id, url, product_id FROM images');
        return products.map(p => ({
            ...p,
            images: images.filter(img => img.product_id === p.id)
        }));
    }

    static async findById(id) {
        const { rows } = await pool.query(
            'SELECT id, title, price, description, rating, category, created_at FROM products WHERE id = $1',
            [id]
        );
        if (!rows[0]) return null;
        const { rows: images } = await pool.query(
            'SELECT id, url, product_id FROM images WHERE product_id = $1',
            [id]
        );
        return { ...rows[0], images };
    }

    static async create({ title, price, description, rating, category, images }) {
        const { rows } = await pool.query(
            'INSERT INTO products (title, price, description, rating, category) VALUES ($1,$2,$3,$4,$5) RETURNING id',
            [title, price, description || '', rating || 0, category || 'phones']
        );
        const newId = rows[0].id;

        const productImages = (images && images.length > 0) ? images : getRelevantImages(title);
        for (const img of productImages) {
            const url = typeof img === 'string' ? img : img.url;
            if (url) await pool.query('INSERT INTO images (url, product_id) VALUES ($1,$2)', [url, newId]);
        }

        return this.findById(newId);
    }

    static async update(id, { title, price, description, rating }) {
        const fields = [];
        const values = [];
        let i = 1;
        if (title !== undefined)       { fields.push(`title = $${i++}`);       values.push(title); }
        if (price !== undefined)       { fields.push(`price = $${i++}`);       values.push(price); }
        if (description !== undefined) { fields.push(`description = $${i++}`); values.push(description); }
        if (rating !== undefined)      { fields.push(`rating = $${i++}`);      values.push(rating); }
        if (!fields.length) return null;
        values.push(id);
        await pool.query(`UPDATE products SET ${fields.join(', ')} WHERE id = $${i}`, values);
        return this.findById(id);
    }

    static async delete(id) {
        await pool.query('DELETE FROM products WHERE id = $1', [id]);
        return { id };
    }
}

const categoryImages = {
    iphone:    ['https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=600&fit=crop'],
    phone:     ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop'],
    samsung:   ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=600&fit=crop'],
    macbook:   ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop'],
    laptop:    ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop'],
    airpod:    ['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&h=600&fit=crop'],
    headphone: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop'],
    watch:     ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop'],
    default:   ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop']
};

function getRelevantImages(title) {
    const t = title.toLowerCase();
    for (const [key, imgs] of Object.entries(categoryImages)) {
        if (t.includes(key)) return imgs;
    }
    return categoryImages.default;
}

module.exports = Product;
