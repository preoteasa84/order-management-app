const express = require('express');
const { db } = require('../config/database');
const { verifyToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/roles');

const router = express.Router();

// All routes require authentication and admin role
router.use(verifyToken);
router.use(checkRole('admin'));

/**
 * POST /database/backup
 * Export full database as JSON
 */
router.post('/backup', async (req, res) => {
    try {
        const backup = {};

        // Get all table names
        const tables = await new Promise((resolve, reject) => {
            db.all(
                "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
                [],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows.map(r => r.name));
                }
            );
        });

        // Export each table
        for (const table of tables) {
            const data = await new Promise((resolve, reject) => {
                db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
            backup[table] = data;
        }

        // Add metadata
        backup._metadata = {
            exportDate: new Date().toISOString(),
            version: '1.0',
            tables: tables
        };

        res.json(backup);
    } catch (error) {
        console.error('Backup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /database/import
 * Import database from JSON backup
 */
router.post('/import', async (req, res) => {
    try {
        const backup = req.body;

        if (!backup || typeof backup !== 'object') {
            return res.status(400).json({ error: 'Invalid backup data' });
        }

        // Start transaction
        await new Promise((resolve, reject) => {
            db.run('BEGIN TRANSACTION', (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        try {
            // Import each table
            for (const [tableName, rows] of Object.entries(backup)) {
                // Skip metadata
                if (tableName === '_metadata') continue;

                // Skip if no data
                if (!Array.isArray(rows) || rows.length === 0) continue;

                // Clear existing data (optional - can be removed if append is desired)
                await new Promise((resolve, reject) => {
                    db.run(`DELETE FROM ${tableName}`, [], (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });

                // Insert rows
                for (const row of rows) {
                    const columns = Object.keys(row);
                    const placeholders = columns.map(() => '?').join(', ');
                    const values = columns.map(col => row[col]);

                    await new Promise((resolve, reject) => {
                        db.run(
                            `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`,
                            values,
                            (err) => {
                                if (err) reject(err);
                                else resolve();
                            }
                        );
                    });
                }
            }

            // Commit transaction
            await new Promise((resolve, reject) => {
                db.run('COMMIT', (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            res.json({ 
                message: 'Database imported successfully',
                importedTables: Object.keys(backup).filter(k => k !== '_metadata')
            });
        } catch (error) {
            // Rollback on error
            await new Promise((resolve) => {
                db.run('ROLLBACK', () => resolve());
            });
            throw error;
        }
    } catch (error) {
        console.error('Import error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

module.exports = router;
