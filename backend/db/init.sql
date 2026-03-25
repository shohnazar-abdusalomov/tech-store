-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    rating DECIMAL(3, 2) CHECK (rating >= 0 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create images table
CREATE TABLE IF NOT EXISTS images (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    product_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);

-- Insert sample data (only if tables are empty)
INSERT INTO products (title, price, description, rating)
SELECT 'iPhone 15 Pro', 1200.00, 'Latest Apple flagship smartphone', 4.80
WHERE NOT EXISTS (SELECT 1 FROM products WHERE title = 'iPhone 15 Pro');

INSERT INTO products (title, price, description, rating)
SELECT 'Samsung Galaxy S24', 1100.00, 'High-end Android phone', 4.70
WHERE NOT EXISTS (SELECT 1 FROM products WHERE title = 'Samsung Galaxy S24');

INSERT INTO products (title, price, description, rating)
SELECT 'MacBook Pro M3', 2200.00, 'Powerful laptop for developers', 4.90
WHERE NOT EXISTS (SELECT 1 FROM products WHERE title = 'MacBook Pro M3');

INSERT INTO products (title, price, description, rating)
SELECT 'AirPods Pro 2', 250.00, 'Noise cancelling earbuds', 4.60
WHERE NOT EXISTS (SELECT 1 FROM products WHERE title = 'AirPods Pro 2');

-- Insert images for products (using relevant real images from Unsplash)
INSERT INTO images (url, product_id)
SELECT 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=600&fit=crop', (SELECT id FROM products WHERE title = 'iPhone 15 Pro')
WHERE NOT EXISTS (SELECT 1 FROM images WHERE url LIKE '%images.unsplash.com%' AND product_id = (SELECT id FROM products WHERE title = 'iPhone 15 Pro'));

INSERT INTO images (url, product_id)
SELECT 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop', (SELECT id FROM products WHERE title = 'iPhone 15 Pro')
WHERE NOT EXISTS (SELECT 1 FROM images WHERE url = 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop');

INSERT INTO images (url, product_id)
SELECT 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&h=600&fit=crop', (SELECT id FROM products WHERE title = 'iPhone 15 Pro')
WHERE NOT EXISTS (SELECT 1 FROM images WHERE url = 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&h=600&fit=crop');

INSERT INTO images (url, product_id)
SELECT 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=600&fit=crop', (SELECT id FROM products WHERE title = 'Samsung Galaxy S24')
WHERE NOT EXISTS (SELECT 1 FROM images WHERE url LIKE '%images.unsplash.com%' AND product_id = (SELECT id FROM products WHERE title = 'Samsung Galaxy S24'));

INSERT INTO images (url, product_id)
SELECT 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=600&fit=crop', (SELECT id FROM products WHERE title = 'Samsung Galaxy S24')
WHERE NOT EXISTS (SELECT 1 FROM images WHERE url = 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=600&fit=crop');

INSERT INTO images (url, product_id)
SELECT 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop', (SELECT id FROM products WHERE title = 'MacBook Pro M3')
WHERE NOT EXISTS (SELECT 1 FROM images WHERE url LIKE '%images.unsplash.com%' AND product_id = (SELECT id FROM products WHERE title = 'MacBook Pro M3'));

INSERT INTO images (url, product_id)
SELECT 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=600&fit=crop', (SELECT id FROM products WHERE title = 'MacBook Pro M3')
WHERE NOT EXISTS (SELECT 1 FROM images WHERE url = 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=600&fit=crop');

INSERT INTO images (url, product_id)
SELECT 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop', (SELECT id FROM products WHERE title = 'MacBook Pro M3')
WHERE NOT EXISTS (SELECT 1 FROM images WHERE url = 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop');

INSERT INTO images (url, product_id)
SELECT 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&h=600&fit=crop', (SELECT id FROM products WHERE title = 'AirPods Pro 2')
WHERE NOT EXISTS (SELECT 1 FROM images WHERE url LIKE '%images.unsplash.com%' AND product_id = (SELECT id FROM products WHERE title = 'AirPods Pro 2'));

INSERT INTO images (url, product_id)
SELECT 'https://images.unsplash.com/photo-1588423771073-b3aacb4d2f46?w=800&h=600&fit=crop', (SELECT id FROM products WHERE title = 'AirPods Pro 2')
WHERE NOT EXISTS (SELECT 1 FROM images WHERE url = 'https://images.unsplash.com/photo-1588423771073-b3aacb4d2f46?w=800&h=600&fit=crop');
