const express = require('express');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/roles');

const router = express.Router();

// All routes require authentication and admin role
router.use(verifyToken);
router.use(checkRole('admin'));

/**
 * GET /users
 * List all users
 */
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /users/:id
 * Get user by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /users
 * Create a new user
 */
router.post('/', async (req, res) => {
    try {
        const { username, password, email, role, status } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Validate role
        if (role && !['office', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role. Must be "office" or "admin"' });
        }

        // Check if username already exists
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        const user = await User.create({ username, password, email, role, status });
        res.status(201).json(user);
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * PUT /users/:id
 * Update user
 */
router.put('/:id', async (req, res) => {
    try {
        const { username, email, role, status, password } = req.body;

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        // Validate role
        if (role && !['office', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role. Must be "office" or "admin"' });
        }

        // Validate status
        if (status && !['active', 'inactive'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status. Must be "active" or "inactive"' });
        }

        // Update basic user info
        await User.update(req.params.id, { username, email, role, status });

        // Update password if provided
        if (password) {
            await User.updatePassword(req.params.id, password);
        }

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Update user error:', error);
        if (error.message === 'User not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

/**
 * PATCH /users/:id/status
 * Update user status (activate/deactivate)
 */
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        if (!status || !['active', 'inactive'].includes(status)) {
            return res.status(400).json({ error: 'Valid status is required (active or inactive)' });
        }

        await User.updateStatus(req.params.id, status);
        res.json({ message: 'User status updated successfully' });
    } catch (error) {
        console.error('Update user status error:', error);
        if (error.message === 'User not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

/**
 * DELETE /users/:id
 * Delete user
 */
router.delete('/:id', async (req, res) => {
    try {
        // Prevent deleting yourself
        if (req.user.id === parseInt(req.params.id)) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        await User.delete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        if (error.message === 'User not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

module.exports = router;
