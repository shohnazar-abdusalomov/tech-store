require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT) || 5432,
    ssl: { rejectUnauthorized: false }
});

// Initialize tables
async function initDB() {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                price REAL NOT NULL,
                description TEXT,
                rating REAL DEFAULT 0,
                category TEXT DEFAULT 'phones',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS images (
                id SERIAL PRIMARY KEY,
                url TEXT NOT NULL,
                product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Seed products if empty
        const { rows } = await client.query('SELECT COUNT(*) FROM products');
        if (parseInt(rows[0].count) === 0) {
            await seedProducts(client);
        }

        console.log('Database initialized successfully!');
    } finally {
        client.release();
    }
}

async function seedProducts(client) {
    const insert = async (title, price, description, rating, category, images) => {
        const res = await client.query(
            'INSERT INTO products (title, price, description, rating, category) VALUES ($1,$2,$3,$4,$5) RETURNING id',
            [title, price, description, rating, category]
        );
        const id = res.rows[0].id;
        for (const url of images) {
            await client.query('INSERT INTO images (url, product_id) VALUES ($1,$2)', [url, id]);
        }
    };

    // Phones
    await insert('iPhone 17 Pro Max', 1299.00, 'The most powerful iPhone ever. A19 Ultra chip, 200MP camera, all-day battery.', 4.9, 'phones', [
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop'
    ]);
    await insert('Samsung Galaxy S24 Ultra', 1100.00, 'High-end Android phone with S Pen, 200MP camera and AI features.', 4.7, 'phones', [
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=600&fit=crop'
    ]);
    await insert('Google Pixel 9 Pro', 999.00, 'Google flagship with best-in-class AI camera and pure Android experience.', 4.6, 'phones', [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop'
    ]);
    await insert('OnePlus 12 Pro', 799.00, 'Flagship killer with Snapdragon 8 Gen 3 and 100W fast charging.', 4.5, 'phones', [
        'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&h=600&fit=crop'
    ]);

    // Laptops
    await insert('MacBook Pro M4 Max', 2499.00, 'Supercharged by M4 Max. Built for AI. Incredible performance meets efficiency.', 4.9, 'laptops', [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=600&fit=crop'
    ]);
    await insert('Dell XPS 15 OLED', 1899.00, 'Premium Windows laptop with stunning OLED display and Intel Core Ultra.', 4.7, 'laptops', [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop'
    ]);
    await insert('Lenovo ThinkPad X1 Carbon', 1599.00, 'Ultra-light business laptop with legendary reliability and 5G connectivity.', 4.6, 'laptops', [
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=600&fit=crop'
    ]);

    // Audio
    await insert('AirPods Pro 3', 299.00, 'Next-generation noise cancellation with Adaptive Audio and Spatial Audio.', 4.8, 'audio', [
        'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&h=600&fit=crop'
    ]);
    await insert('Sony WH-1000XM6', 399.00, 'Industry-leading noise canceling headphones with 40-hour battery and LDAC.', 4.9, 'audio', [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop'
    ]);
    await insert('Bose QuietComfort Ultra', 349.00, 'Immersive audio with world-class noise cancellation and CustomTune technology.', 4.7, 'audio', [
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=600&fit=crop'
    ]);
    await insert('JBL Charge 6', 199.00, 'Portable Bluetooth speaker with 24-hour playtime and IP67 waterproof rating.', 4.5, 'audio', [
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=600&fit=crop'
    ]);

    // Gaming
    await insert('PlayStation 5 Pro', 699.00, 'Next-gen gaming console with 8K support, ray tracing and ultra-fast SSD.', 4.9, 'gaming', [
        'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&h=600&fit=crop'
    ]);
    await insert('Xbox Series X 2TB', 599.00, 'Most powerful Xbox ever with 2TB storage, 4K gaming at 120fps.', 4.8, 'gaming', [
        'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&h=600&fit=crop'
    ]);
    await insert('Steam Deck OLED', 549.00, 'Portable PC gaming with stunning OLED display and 8-hour battery life.', 4.7, 'gaming', [
        'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&h=600&fit=crop'
    ]);
    await insert('Razer DeathAdder V3 Pro', 149.00, 'Wireless gaming mouse with Focus Pro 30K sensor and 90-hour battery.', 4.6, 'gaming', [
        'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&h=600&fit=crop'
    ]);

    // Wearables
    await insert('Apple Watch Ultra 3', 799.00, 'Most rugged Apple Watch with titanium case and 72-hour battery.', 4.8, 'wearables', [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop'
    ]);
    await insert('Samsung Galaxy Watch 7', 349.00, 'Advanced health monitoring with BioActive sensor and 3-day battery.', 4.6, 'wearables', [
        'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&h=600&fit=crop'
    ]);
    await insert('Fitbit Charge 6', 159.00, 'Advanced fitness tracker with built-in GPS and 7-day battery.', 4.4, 'wearables', [
        'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&h=600&fit=crop'
    ]);
}

initDB().catch(console.error);

module.exports = pool;
