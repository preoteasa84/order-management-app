const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'orders.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to SQLite database at', dbPath);
    }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Initialize database with migrations
function initializeDatabase() {
    return new Promise((resolve, reject) => {
        const migrationsPath = path.join(__dirname, '..', 'migrations', 'init.sql');
        
        fs.readFile(migrationsPath, 'utf8', (err, sql) => {
            if (err) {
                console.error('Error reading migrations file:', err);
                reject(err);
                return;
            }

            db.exec(sql, (err) => {
                if (err) {
                    console.error('Error executing migrations:', err);
                    reject(err);
                } else {
                    console.log('Database migrations executed successfully');
                    
                    // Check if agent_id column exists in orders table
                    db.all("PRAGMA table_info(orders)", [], (err, columns) => {
                        if (err) {
                            console.error('Error checking orders table:', err);
                            reject(err);
                            return;
                        }
                        
                        const hasAgentId = columns.some(col => col.name === 'agent_id');
                        
                        if (!hasAgentId) {
                            db.run('ALTER TABLE orders ADD COLUMN agent_id INTEGER REFERENCES agents(id)', (err) => {
                                if (err) {
                                    console.error('Error adding agent_id to orders:', err);
                                } else {
                                    console.log('Added agent_id column to orders table');
                                }
                                resolve();
                            });
                        } else {
                            resolve();
                        }
                    });
                }
            });
        });
    });
}

// Run initialization
initializeDatabase().catch(err => {
    console.error('Failed to initialize database:', err);
});

module.exports = { db, initializeDatabase };
