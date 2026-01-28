const express = require('express');
const Agent = require('../models/Agent');
const ClientAllocation = require('../models/ClientAllocation');
const { verifyToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/roles');

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

/**
 * GET /agents
 * List all agents (admin and office)
 */
router.get('/', checkRole('admin', 'office'), async (req, res) => {
    try {
        const agents = await Agent.findAll();
        res.json(agents);
    } catch (error) {
        console.error('Get agents error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /agents/:id
 * Get agent by ID
 */
router.get('/:id', checkRole('admin', 'office'), async (req, res) => {
    try {
        const agent = await Agent.findById(req.params.id);
        
        if (!agent) {
            return res.status(404).json({ error: 'Agent not found' });
        }

        res.json(agent);
    } catch (error) {
        console.error('Get agent error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /agents
 * Create a new agent
 */
router.post('/', checkRole('admin', 'office'), async (req, res) => {
    try {
        const { name, commission_rate, status, office_user_id } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Agent name is required' });
        }

        const agent = await Agent.create({ 
            name, 
            commission_rate, 
            status, 
            office_user_id 
        });
        
        res.status(201).json(agent);
    } catch (error) {
        console.error('Create agent error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * PUT /agents/:id
 * Update agent
 */
router.put('/:id', checkRole('admin', 'office'), async (req, res) => {
    try {
        const { name, commission_rate, status, office_user_id } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Agent name is required' });
        }

        await Agent.update(req.params.id, { 
            name, 
            commission_rate, 
            status, 
            office_user_id 
        });
        
        res.json({ message: 'Agent updated successfully' });
    } catch (error) {
        console.error('Update agent error:', error);
        if (error.message === 'Agent not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

/**
 * DELETE /agents/:id
 * Delete agent
 */
router.delete('/:id', checkRole('admin', 'office'), async (req, res) => {
    try {
        await Agent.delete(req.params.id);
        res.json({ message: 'Agent deleted successfully' });
    } catch (error) {
        console.error('Delete agent error:', error);
        if (error.message === 'Agent not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

/**
 * GET /agents/:id/allocations
 * Get all client allocations for an agent
 */
router.get('/:id/allocations', checkRole('admin', 'office'), async (req, res) => {
    try {
        const allocations = await ClientAllocation.findByAgentId(req.params.id);
        res.json(allocations);
    } catch (error) {
        console.error('Get allocations error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /agents/:id/allocations
 * Allocate a client to an agent
 */
router.post('/:id/allocations', checkRole('admin', 'office'), async (req, res) => {
    try {
        const { client_id } = req.body;

        if (!client_id) {
            return res.status(400).json({ error: 'Client ID is required' });
        }

        // Verify agent exists
        const agent = await Agent.findById(req.params.id);
        if (!agent) {
            return res.status(404).json({ error: 'Agent not found' });
        }

        const allocation = await ClientAllocation.create(client_id, req.params.id);
        res.status(201).json(allocation);
    } catch (error) {
        console.error('Create allocation error:', error);
        if (error.message.includes('UNIQUE constraint failed')) {
            res.status(409).json({ error: 'Client already allocated to this agent' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

/**
 * DELETE /agents/:id/allocations/:allocationId
 * Remove a client allocation
 */
router.delete('/:id/allocations/:allocationId', checkRole('admin', 'office'), async (req, res) => {
    try {
        await ClientAllocation.delete(req.params.allocationId);
        res.json({ message: 'Allocation deleted successfully' });
    } catch (error) {
        console.error('Delete allocation error:', error);
        if (error.message === 'Allocation not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

module.exports = router;
