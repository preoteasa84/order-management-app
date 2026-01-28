require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { db } = require('./config/database');
const { verifyToken } = require('./middleware/auth');
const { checkRole } = require('./middleware/roles');

// Import routes
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const agentsRoutes = require('./routes/agents');
const databaseRoutes = require('./routes/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/agents', agentsRoutes);
app.use('/api/database', databaseRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get all orders (authenticated)
app.get('/api/orders', verifyToken, (req, res) => {
    db.all('SELECT * FROM orders ORDER BY createdAt DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows || []);
        }
    });
});

// Create order (authenticated)
app.post('/api/orders', verifyToken, (req, res) => {
    const { title, description } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }
    
    db.run(
        'INSERT INTO orders (title, description) VALUES (?, ?)',
        [title, description],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ 
                    id: this.lastID, 
                    title, 
                    description, 
                    status: 'pending',
                    createdAt: new Date().toISOString()
                });
            }
        }
    );
});

// Update order (authenticated)
app.put('/api/orders/:id', verifyToken, (req, res) => {
    const { status } = req.body;
    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }
    
    db.run(
        'UPDATE orders SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [status, req.params.id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else if (this.changes === 0) {
                res.status(404).json({ error: 'Order not found' });
            } else {
                res.json({ success: true });
            }
        }
    );
});

// Delete order (authenticated)
app.delete('/api/orders/:id', verifyToken, (req, res) => {
    db.run('DELETE FROM orders WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Order not found' });
        } else {
            res.json({ success: true });
        }
    });
});

// ============ CLIENTS ENDPOINTS ============

// Get all clients (authenticated)
app.get('/api/clients', verifyToken, (req, res) => {
    db.all('SELECT * FROM clients ORDER BY nume', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            // Parse JSON fields
            const clients = (rows || []).map(row => ({
                ...row,
                afiseazaKG: row.afiseazaKG === 1,
                productCodes: row.productCodes ? JSON.parse(row.productCodes) : {}
            }));
            res.json(clients);
        }
    });
});

// Get single client (authenticated)
app.get('/api/clients/:id', verifyToken, (req, res) => {
    db.get('SELECT * FROM clients WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ error: 'Client not found' });
        } else {
            const client = {
                ...row,
                afiseazaKG: row.afiseazaKG === 1,
                productCodes: row.productCodes ? JSON.parse(row.productCodes) : {}
            };
            res.json(client);
        }
    });
});

// Create client (authenticated)
app.post('/api/clients', verifyToken, (req, res) => {
    const client = req.body;
    
    if (!client.id || !client.nume) {
        return res.status(400).json({ error: 'ID and nume are required' });
    }
    
    db.run(
        `INSERT INTO clients (
            id, nume, cif, nrRegCom, codContabil, judet, localitate, strada, 
            codPostal, telefon, email, banca, iban, agentId, priceZone, 
            afiseazaKG, productCodes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            client.id, client.nume, client.cif, client.nrRegCom, client.codContabil,
            client.judet, client.localitate, client.strada, client.codPostal,
            client.telefon, client.email, client.banca, client.iban, client.agentId,
            client.priceZone, client.afiseazaKG ? 1 : 0, 
            JSON.stringify(client.productCodes || {})
        ],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ ...client, createdAt: new Date().toISOString() });
            }
        }
    );
});

// Update client (authenticated)
app.put('/api/clients/:id', verifyToken, (req, res) => {
    const client = req.body;
    
    if (!client.nume) {
        return res.status(400).json({ error: 'nume is required' });
    }
    
    db.run(
        `UPDATE clients SET 
            nume = ?, cif = ?, nrRegCom = ?, codContabil = ?, judet = ?, 
            localitate = ?, strada = ?, codPostal = ?, telefon = ?, email = ?, 
            banca = ?, iban = ?, agentId = ?, priceZone = ?, afiseazaKG = ?, 
            productCodes = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [
            client.nume, client.cif, client.nrRegCom, client.codContabil, client.judet,
            client.localitate, client.strada, client.codPostal, client.telefon,
            client.email, client.banca, client.iban, client.agentId, client.priceZone,
            client.afiseazaKG ? 1 : 0, JSON.stringify(client.productCodes || {}),
            req.params.id
        ],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else if (this.changes === 0) {
                res.status(404).json({ error: 'Client not found' });
            } else {
                res.json({ success: true });
            }
        }
    );
});

// Delete client (authenticated)
app.delete('/api/clients/:id', verifyToken, (req, res) => {
    db.run('DELETE FROM clients WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Client not found' });
        } else {
            res.json({ success: true });
        }
    });
});

// ============ PRODUCTS ENDPOINTS ============

// Get all products (authenticated)
app.get('/api/products', verifyToken, (req, res) => {
    db.all('SELECT * FROM products ORDER BY descriere', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            // Parse JSON fields
            const products = (rows || []).map(row => ({
                ...row,
                prices: row.prices ? JSON.parse(row.prices) : {}
            }));
            res.json(products);
        }
    });
});

// Get single product (authenticated)
app.get('/api/products/:id', verifyToken, (req, res) => {
    db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            const product = {
                ...row,
                prices: row.prices ? JSON.parse(row.prices) : {}
            };
            res.json(product);
        }
    });
});

// Create product (authenticated)
app.post('/api/products', verifyToken, (req, res) => {
    const product = req.body;
    
    if (!product.id || !product.descriere) {
        return res.status(400).json({ error: 'ID and descriere are required' });
    }
    
    db.run(
        `INSERT INTO products (
            id, codArticolFurnizor, codProductie, codBare, descriere, 
            um, gestiune, gramajKg, cotaTVA, prices
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            product.id, product.codArticolFurnizor, product.codProductie, 
            product.codBare, product.descriere, product.um, product.gestiune,
            product.gramajKg, product.cotaTVA, JSON.stringify(product.prices || {})
        ],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ ...product, createdAt: new Date().toISOString() });
            }
        }
    );
});

// Update product (authenticated)
app.put('/api/products/:id', verifyToken, (req, res) => {
    const product = req.body;
    
    if (!product.descriere) {
        return res.status(400).json({ error: 'descriere is required' });
    }
    
    db.run(
        `UPDATE products SET 
            codArticolFurnizor = ?, codProductie = ?, codBare = ?, descriere = ?, 
            um = ?, gestiune = ?, gramajKg = ?, cotaTVA = ?, prices = ?,
            updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [
            product.codArticolFurnizor, product.codProductie, product.codBare,
            product.descriere, product.um, product.gestiune, product.gramajKg,
            product.cotaTVA, JSON.stringify(product.prices || {}), req.params.id
        ],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else if (this.changes === 0) {
                res.status(404).json({ error: 'Product not found' });
            } else {
                res.json({ success: true });
            }
        }
    );
});

// Delete product (authenticated)
app.delete('/api/products/:id', verifyToken, (req, res) => {
    db.run('DELETE FROM products WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.json({ success: true });
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
