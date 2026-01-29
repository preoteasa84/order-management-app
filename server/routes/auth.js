const express = require('express');
const router = express.Router();
const db = require('../database');
const crypto = require('crypto');

// Hash password function
function hashPassword(password) {
    const salt = 'order-management-salt-2026';
    return crypto.createHash('sha256').update(password + salt).digest('hex');
}

// Login
router.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const hashedPassword = hashPassword(password);
        if (user.password !== hashedPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({
            token: `token_${user.id}_${Date.now()}`,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Register
router.post('/register', (req, res) => {
    try {
        const { username, password, name, role } = req.body;

        if (!username || !password || !name) {
            return res.status(400).json({ error: 'Username, password and name required' });
        }

        const existing = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
        if (existing) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const hashedPassword = hashPassword(password);
        const id = `user-${Date.now()}`;

        db.prepare(
            'INSERT INTO users (id, username, password, name, role, status) VALUES (?, ?, ?, ?, ?, ?)'
        ).run(id, username, hashedPassword, name, role || 'user', 'active');

        res.status(201).json({
            id,
            username,
            name,
            role: role || 'user'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
