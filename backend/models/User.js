const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    static async findAll() {
        const result = await db.query(`
            SELECT id, email, username, created_at
            FROM users
            ORDER BY created_at DESC
        `);
        return result.rows;
    }

    static async findById(id) {
        const result = await db.query(`
            SELECT id, email, username, created_at
            FROM users
            WHERE id = $1
        `, [id]);
        return result.rows[0] || null;
    }

    static async findByEmail(email) {
        const result = await db.query(`
            SELECT id, email, username, password, created_at
            FROM users
            WHERE email = $1
        `, [email]);
        return result.rows[0] || null;
    }

    static async create({ email, username, password }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query(`
            INSERT INTO users (email, username, password)
            VALUES ($1, $2, $3)
            RETURNING id, email, username, created_at
        `, [email, username, hashedPassword]);
        return result.rows[0];
    }

    static async update(id, { email, username }) {
        const result = await db.query(`
            UPDATE users 
            SET email = COALESCE($1, email),
                username = COALESCE($2, username)
            WHERE id = $3
            RETURNING id, email, username, created_at
        `, [email, username, id]);
        return result.rows[0] || null;
    }

    static async delete(id) {
        const result = await db.query(
            'DELETE FROM users WHERE id = $1 RETURNING id',
            [id]
        );
        return result.rows[0] || null;
    }

    static async comparePassword(candidatePassword, hashedPassword) {
        return await bcrypt.compare(candidatePassword, hashedPassword);
    }
}

module.exports = User;
