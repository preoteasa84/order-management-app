const { db } = require('../config/database');

const Agent = {
    /**
     * Create a new agent
     */
    create: (agentData) => {
        return new Promise((resolve, reject) => {
            const { name, commission_rate = 0.0, status = 'active', office_user_id } = agentData;
            
            db.run(
                `INSERT INTO agents (name, commission_rate, status, office_user_id) VALUES (?, ?, ?, ?)`,
                [name, commission_rate, status, office_user_id],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            id: this.lastID,
                            name,
                            commission_rate,
                            status,
                            office_user_id,
                            created_at: new Date().toISOString()
                        });
                    }
                }
            );
        });
    },

    /**
     * Find agent by ID
     */
    findById: (id) => {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM agents WHERE id = ?',
                [id],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
    },

    /**
     * Get all agents
     */
    findAll: () => {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM agents ORDER BY name',
                [],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows || []);
                }
            );
        });
    },

    /**
     * Update agent
     */
    update: (id, agentData) => {
        return new Promise((resolve, reject) => {
            const { name, commission_rate, status, office_user_id } = agentData;
            
            db.run(
                `UPDATE agents SET name = ?, commission_rate = ?, status = ?, office_user_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
                [name, commission_rate, status, office_user_id, id],
                function(err) {
                    if (err) {
                        reject(err);
                    } else if (this.changes === 0) {
                        reject(new Error('Agent not found'));
                    } else {
                        resolve({ success: true, changes: this.changes });
                    }
                }
            );
        });
    },

    /**
     * Delete agent
     */
    delete: (id) => {
        return new Promise((resolve, reject) => {
            db.run(
                'DELETE FROM agents WHERE id = ?',
                [id],
                function(err) {
                    if (err) {
                        reject(err);
                    } else if (this.changes === 0) {
                        reject(new Error('Agent not found'));
                    } else {
                        resolve({ success: true });
                    }
                }
            );
        });
    }
};

module.exports = Agent;
