const Database = require('better-sqlite3');
const path = require('path');

// Use a file-based database
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize tables
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        rating REAL DEFAULT 0,
        category TEXT DEFAULT 'phones',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT NOT NULL,
        product_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
`);

// Add category column if it doesn't exist (migration for existing DB)
try {
    db.exec(`ALTER TABLE products ADD COLUMN category TEXT DEFAULT 'phones'`);
} catch (e) {
    // Column already exists, ignore
}

// Update existing products with correct categories based on title
const updateCategory = db.prepare(`UPDATE products SET category = ? WHERE id = ? AND (category IS NULL OR category = 'phones')`);
const existingProducts = db.prepare('SELECT id, title FROM products').all();
existingProducts.forEach(p => {
    const t = p.title.toLowerCase();
    let cat = 'phones';
    if (t.includes('macbook') || t.includes('laptop') || t.includes('thinkpad') || t.includes('xps') || t.includes('dell') || t.includes('lenovo')) cat = 'laptops';
    else if (t.includes('airpod') || t.includes('headphone') || t.includes('sony') || t.includes('bose') || t.includes('jbl') || t.includes('audio') || t.includes('earbud')) cat = 'audio';
    else if (t.includes('playstation') || t.includes('xbox') || t.includes('steam') || t.includes('gaming') || t.includes('razer') || t.includes('ps5')) cat = 'gaming';
    else if (t.includes('watch') || t.includes('fitbit') || t.includes('wearable') || t.includes('band')) cat = 'wearables';
    updateCategory.run(cat, p.id);
});

// Insert missing products by title (safe to run multiple times)
const insertIfMissing = (title, price, description, rating, category, images) => {
    const exists = db.prepare('SELECT id FROM products WHERE title = ?').get(title);
    if (exists) return exists.id;
    const insertProduct = db.prepare(`INSERT INTO products (title, price, description, rating, category) VALUES (?, ?, ?, ?, ?)`);
    const insertImage = db.prepare('INSERT INTO images (url, product_id) VALUES (?, ?)');
    const result = insertProduct.run(title, price, description, rating, category);
    images.forEach(url => insertImage.run(url, result.lastInsertRowid));
    return result.lastInsertRowid;
};

// Phones
insertIfMissing('iPhone 17 Pro Max', 1299.00, 'The most powerful iPhone ever. Featuring the A19 Ultra chip, a revolutionary camera system with 200MP sensor, and all-day battery life.', 4.9, 'phones', [
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&h=600&fit=crop'
]);
insertIfMissing('Samsung Galaxy S24 Ultra', 1100.00, 'High-end Android phone with S Pen, 200MP camera and AI features.', 4.7, 'phones', [
    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=600&fit=crop'
]);
insertIfMissing('Google Pixel 9 Pro', 999.00, 'Google flagship with best-in-class AI camera and pure Android experience.', 4.6, 'phones', [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop'
]);
insertIfMissing('OnePlus 12 Pro', 799.00, 'Flagship killer with Snapdragon 8 Gen 3 and 100W fast charging.', 4.5, 'phones', [
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&h=600&fit=crop'
]);

// Laptops
insertIfMissing('MacBook Pro M4 Max', 2499.00, 'Supercharged by M4 Max. The first laptop built from the ground up for AI. Incredible performance meets unprecedented efficiency.', 4.9, 'laptops', [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop'
]);
insertIfMissing('Dell XPS 15 OLED', 1899.00, 'Premium Windows laptop with stunning OLED display and Intel Core Ultra processor.', 4.7, 'laptops', [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=600&fit=crop'
]);
insertIfMissing('Lenovo ThinkPad X1 Carbon', 1599.00, 'Ultra-light business laptop with legendary ThinkPad reliability and 5G connectivity.', 4.6, 'laptops', [
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=600&fit=crop'
]);

// Audio
insertIfMissing('AirPods Pro 3', 299.00, 'Next-generation noise cancellation with Adaptive Audio and personalized Spatial Audio.', 4.8, 'audio', [
    'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1588423771073-b3aacb4d2f46?w=800&h=600&fit=crop'
]);
insertIfMissing('Sony WH-1000XM6', 399.00, 'Industry-leading noise canceling headphones with 40-hour battery life and LDAC support.', 4.9, 'audio', [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop'
]);
insertIfMissing('Bose QuietComfort Ultra', 349.00, 'Immersive audio with world-class noise cancellation and CustomTune technology.', 4.7, 'audio', [
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=600&fit=crop'
]);
insertIfMissing('JBL Charge 6', 199.00, 'Portable Bluetooth speaker with 24-hour playtime and IP67 waterproof rating.', 4.5, 'audio', [
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=600&fit=crop'
]);

// Gaming
insertIfMissing('PlayStation 5 Pro', 699.00, 'Next-gen gaming console with 8K gaming support, ray tracing and ultra-fast SSD.', 4.9, 'gaming', [
    'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&h=600&fit=crop'
]);
insertIfMissing('Xbox Series X 2TB', 599.00, 'Most powerful Xbox ever with 2TB storage, 4K gaming at 120fps.', 4.8, 'gaming', [
    'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&h=600&fit=crop'
]);
insertIfMissing('Steam Deck OLED', 549.00, 'Portable PC gaming with stunning OLED display and 8-hour battery life.', 4.7, 'gaming', [
    'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&h=600&fit=crop'
]);
insertIfMissing('Razer DeathAdder V3 Pro', 149.00, 'Wireless gaming mouse with Focus Pro 30K sensor and 90-hour battery.', 4.6, 'gaming', [
    'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&h=600&fit=crop'
]);

// Wearables
insertIfMissing('Apple Watch Ultra 3', 799.00, 'The most rugged and capable Apple Watch with titanium case and 72-hour battery.', 4.8, 'wearables', [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=600&fit=crop'
]);
insertIfMissing('Samsung Galaxy Watch 7', 349.00, 'Advanced health monitoring with BioActive sensor and 3-day battery life.', 4.6, 'wearables', [
    'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&h=600&fit=crop'
]);
insertIfMissing('Fitbit Charge 6', 159.00, 'Advanced fitness tracker with built-in GPS, heart rate monitoring and 7-day battery.', 4.4, 'wearables', [
    'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&h=600&fit=crop'
]);

console.log('Database initialized successfully!');

module.exports = db;
