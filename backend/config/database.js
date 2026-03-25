const Database = require('better-sqlite3');
const path = require('path');

// Use a file-based database
const dbPath = path.join(__dirname, '..', 'db', 'database.sqlite');
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

// Insert sample data if empty
const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;

if (productCount === 0) {
    // Insert products
    const insertProduct = db.prepare(`
        INSERT INTO products (title, price, description, rating) 
        VALUES (?, ?, ?, ?)
    `);
    
    const iphoneResult = insertProduct.run('iPhone 15 Pro', 1200.00, 'Latest Apple flagship smartphone', 4.80);
    const samsungResult = insertProduct.run('Samsung Galaxy S24', 1100.00, 'High-end Android phone', 4.70);
    const macbookResult = insertProduct.run('MacBook Pro M3', 2200.00, 'Powerful laptop for developers', 4.90);
    const airpodsResult = insertProduct.run('AirPods Pro 2', 250.00, 'Noise cancelling earbuds', 4.60);

    // Insert images
    const insertImage = db.prepare('INSERT INTO images (url, product_id) VALUES (?, ?)');
    
    // iPhone images
    insertImage.run('https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=600&fit=crop', iphoneResult.lastInsertRowid);
    insertImage.run('https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop', iphoneResult.lastInsertRowid);
    insertImage.run('https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&h=600&fit=crop', iphoneResult.lastInsertRowid);

    // Samsung images
    insertImage.run('https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=600&fit=crop', samsungResult.lastInsertRowid);
    insertImage.run('https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=600&fit=crop', samsungResult.lastInsertRowid);

    // MacBook images
    insertImage.run('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop', macbookResult.lastInsertRowid);
    insertImage.run('https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=600&fit=crop', macbookResult.lastInsertRowid);
    insertImage.run('https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop', macbookResult.lastInsertRowid);

    // AirPods images
    insertImage.run('https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&h=600&fit=crop', airpodsResult.lastInsertRowid);
    insertImage.run('https://images.unsplash.com/photo-1588423771073-b3aacb4d2f46?w=800&h=600&fit=crop', airpodsResult.lastInsertRowid);

    console.log('Sample data inserted successfully!');
}

module.exports = db;
