require('dotenv').config();
const { pool } = require('../config/database');

async function migrateImages() {
    const client = await pool.connect();
    
    try {
        console.log('Starting image URL migration...');
        
        // Update all example.com images to picsum.photos
        const result = await client.query(`
            UPDATE images 
            SET url = 'https://picsum.photos/seed/tech' || id || '/800/600'
            WHERE url LIKE '%example.com%'
            RETURNING id, url, product_id
        `);
        
        console.log(`Updated ${result.rowCount} images`);
        
        if (result.rowCount > 0) {
            console.log('Updated images:');
            result.rows.forEach(row => {
                console.log(`  ID ${row.id}: ${row.url}`);
            });
        }
        
        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

migrateImages();
