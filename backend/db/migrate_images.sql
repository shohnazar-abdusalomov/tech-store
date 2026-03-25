-- Migration script to update fake example.com images to real placeholder images
-- Run this script to fix existing broken images

-- Update iPhone 15 Pro images
UPDATE images SET url = 'https://picsum.photos/seed/iphone15/800/600' 
WHERE url LIKE '%example.com/iphone%' AND product_id = (SELECT id FROM products WHERE title = 'iPhone 15 Pro');

-- Update Samsung Galaxy images
UPDATE images SET url = 'https://picsum.photos/seed/samsung24/800/600' 
WHERE url LIKE '%example.com/samsung%' AND product_id = (SELECT id FROM products WHERE title = 'Samsung Galaxy S24');

-- Update MacBook Pro images
UPDATE images SET url = 'https://picsum.photos/seed/macbookm3/800/600' 
WHERE url LIKE '%example.com/macbook%' AND product_id = (SELECT id FROM products WHERE title = 'MacBook Pro M3');

-- Update AirPods images
UPDATE images SET url = 'https://picsum.photos/seed/airpods2/800/600' 
WHERE url LIKE '%example.com/airpods%' AND product_id = (SELECT id FROM products WHERE title = 'AirPods Pro 2');

-- Generic update for any remaining example.com images
UPDATE images SET url = 'https://picsum.photos/seed/tech/800/600' 
WHERE url LIKE '%example.com%';
