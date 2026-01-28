const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const jwtConfig = require('../config/jwt');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /auth/login
 * Login endpoint
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Find user
        const user = await User.findByUsername(username);
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Check if user is active
        if (user.status !== 'active') {
            return res.status(403).json({ error: 'User account is inactive' });
        }

        // Verify password
        const isValidPassword = await User.verifyPassword(password, user.password);
        
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /auth/register
 * Register a new user (public endpoint for initial setup)
 */
router.post('/register', async (req, res) => {
    try {
        const { username, password, email, role = 'office' } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Validate role
        if (!['office', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role. Must be "office" or "admin"' });
        }

        // Check if username already exists
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        // Create user
        const user = await User.create({ username, password, email, role });

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /auth/logout
 * Logout endpoint (token invalidation handled on client side)
 */
router.post('/logout', verifyToken, (req, res) => {
    // In a more complex system, you might want to maintain a token blacklist
    // For now, logout is handled client-side by removing the token
    res.json({ message: 'Logged out successfully' });
});

/**
 * GET /auth/me
 * Get current user information
 */
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            status: user.status
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
