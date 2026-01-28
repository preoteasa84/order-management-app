const { db } = require('../config/database');

const ClientAllocation = {
    /**
     * Allocate a client to an agent
     */
    create: (client_id, agent_id) => {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO client_allocations (client_id, agent_id) VALUES (?, ?)`,
                [client_id, agent_id],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            id: this.lastID,
                            client_id,
                            agent_id,
                            allocated_at: new Date().toISOString()
                        });
                    }
                }
            );
        });
    },

    /**
     * Get all allocations for an agent
     */
    findByAgentId: (agent_id) => {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM client_allocations WHERE agent_id = ? ORDER BY allocated_at DESC',
                [agent_id],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows || []);
                }
            );
        });
    },

    /**
     * Get all allocations for a client
     */
    findByClientId: (client_id) => {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM client_allocations WHERE client_id = ?',
                [client_id],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows || []);
                }
            );
        });
    },

    /**
     * Delete an allocation
     */
    delete: (id) => {
        return new Promise((resolve, reject) => {
            db.run(
                'DELETE FROM client_allocations WHERE id = ?',
                [id],
                function(err) {
                    if (err) {
                        reject(err);
                    } else if (this.changes === 0) {
                        reject(new Error('Allocation not found'));
                    } else {
                        resolve({ success: true });
                    }
                }
            );
        });
    },

    /**
     * Delete allocation by client and agent
     */
    deleteByClientAndAgent: (client_id, agent_id) => {
        return new Promise((resolve, reject) => {
            db.run(
                'DELETE FROM client_allocations WHERE client_id = ? AND agent_id = ?',
                [client_id, agent_id],
                function(err) {
                    if (err) {
                        reject(err);
                    } else if (this.changes === 0) {
                        reject(new Error('Allocation not found'));
                    } else {
                        resolve({ success: true });
                    }
                }
            );
        });
    }
};

module.exports = ClientAllocation;
