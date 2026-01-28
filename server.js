const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// SQLite Database
const dbPath = path.join(__dirname, 'data.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('journal_mode = WAL');

// Create table
db.exec(`
  CREATE TABLE IF NOT EXISTS data_store (
    key TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Routes

// GET - Citire date
app.get('/api/load/:key', (req, res) => {
  try {
    const stmt = db.prepare('SELECT data FROM data_store WHERE key = ?');
    const record = stmt.get(req.params.key);
    
    if (record) {
      res.json(JSON.parse(record.data));
    } else {
      res.json(null);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Salvare date
app.post('/api/save', (req, res) => {
  try {
    const { key, data } = req.body;
    
    if (!key || data === undefined) {
      return res.status(400).json({ error: 'key și data sunt obligatorii' });
    }

    const jsonData = JSON.stringify(data);
    const stmt = db.prepare(
      'INSERT OR REPLACE INTO data_store (key, data, updatedAt) VALUES (?, ?, CURRENT_TIMESTAMP)'
    );
    stmt.run(key, jsonData);

    res.json({ success: true, message: 'Date salvate cu succes' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Salvare multiple keys
app.post('/api/save-bulk', (req, res) => {
  try {
    const { updates } = req.body;
    
    const stmt = db.prepare(
      'INSERT OR REPLACE INTO data_store (key, data, updatedAt) VALUES (?, ?, CURRENT_TIMESTAMP)'
    );
    
    const insertMany = db.transaction((updates) => {
      for (const { key, data } of updates) {
        stmt.run(key, JSON.stringify(data));
      }
    });

    insertMany(updates);
    res.json({ success: true, message: 'Toate datele salvate cu succes' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Încarcă TOȚI datele (pentru import)
app.get('/api/load-all', (req, res) => {
  try {
    const stmt = db.prepare('SELECT key, data FROM data_store');
    const records = stmt.all();
    
    const allData = {};
    records.forEach(record => {
      allData[record.key] = JSON.parse(record.data);
    });

    res.json(allData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Șterge comenzi vechi
app.delete('/api/delete-old-orders/:days', (req, res) => {
  try {
    const days = parseInt(req.params.days);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const stmt = db.prepare('SELECT data FROM data_store WHERE key = ?');
    const record = stmt.get('orders');
    
    if (record) {
      const orders = JSON.parse(record.data);
      const filtered = orders.filter(order => 
        new Date(order.date) > cutoffDate
      );

      const updateStmt = db.prepare(
        'UPDATE data_store SET data = ?, updatedAt = CURRENT_TIMESTAMP WHERE key = ?'
      );
      updateStmt.run(JSON.stringify(filtered), 'orders');

      res.json({ 
        success: true, 
        deleted: orders.length - filtered.length,
        message: `${orders.length - filtered.length} comenzi șterse`
      });
    } else {
      res.json({ success: true, deleted: 0, message: 'Nicio comandă de șters' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server rulează pe port ${PORT}`);
  console.log(`📁 Database: ${dbPath}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});
