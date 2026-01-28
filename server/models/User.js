const { db } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = {
    /**
     * Create a new user
     */
    create: async (userData) => {
        return new Promise(async (resolve, reject) => {
            const { username, password, email, role = 'office', status = 'active' } = userData;
            
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            
            db.run(
                `INSERT INTO users (username, password, email, role, status) VALUES (?, ?, ?, ?, ?)`,
                [username, hashedPassword, email, role, status],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            id: this.lastID,
                            username,
                            email,
                            role,
                            status,
                            created_at: new Date().toISOString()
                        });
                    }
                }
            );
        });
    },

    /**
     * Find user by username
     */
    findByUsername: (username) => {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM users WHERE username = ?',
                [username],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
    },

    /**
     * Find user by ID
     */
    findById: (id) => {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT id, username, email, role, status, created_at, updated_at FROM users WHERE id = ?',
                [id],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
    },

    /**
     * Get all users
     */
    findAll: () => {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT id, username, email, role, status, created_at, updated_at FROM users ORDER BY created_at DESC',
                [],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows || []);
                }
            );
        });
    },

    /**
     * Update user
     */
    update: (id, userData) => {
        return new Promise((resolve, reject) => {
            const { username, email, role, status } = userData;
            
            db.run(
                `UPDATE users SET username = ?, email = ?, role = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
                [username, email, role, status, id],
                function(err) {
                    if (err) {
                        reject(err);
                    } else if (this.changes === 0) {
                        reject(new Error('User not found'));
                    } else {
                        resolve({ success: true, changes: this.changes });
                    }
                }
            );
        });
    },

    /**
     * Update user password
     */
    updatePassword: async (id, newPassword) => {
        return new Promise(async (resolve, reject) => {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            
            db.run(
                'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [hashedPassword, id],
                function(err) {
                    if (err) {
                        reject(err);
                    } else if (this.changes === 0) {
                        reject(new Error('User not found'));
                    } else {
                        resolve({ success: true });
                    }
                }
            );
        });
    },

    /**
     * Update user status
     */
    updateStatus: (id, status) => {
        return new Promise((resolve, reject) => {
            db.run(
                'UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [status, id],
                function(err) {
                    if (err) {
                        reject(err);
                    } else if (this.changes === 0) {
                        reject(new Error('User not found'));
                    } else {
                        resolve({ success: true });
                    }
                }
            );
        });
    },

    /**
     * Delete user
     */
    delete: (id) => {
        return new Promise((resolve, reject) => {
            db.run(
                'DELETE FROM users WHERE id = ?',
                [id],
                function(err) {
                    if (err) {
                        reject(err);
                    } else if (this.changes === 0) {
                        reject(new Error('User not found'));
                    } else {
                        resolve({ success: true });
                    }
                }
            );
        });
    },

    /**
     * Verify password
     */
    verifyPassword: async (plainPassword, hashedPassword) => {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
};

module.exports = User;
