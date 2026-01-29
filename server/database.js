const Database = require('better-sqlite3');
const path = require('path');

// Create database connection
const db = new Database(path.join(__dirname, 'data.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables if they don't exist
const createTables = () => {
  // Orders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Clients table
  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      nume TEXT NOT NULL,
      cif TEXT,
      nrRegCom TEXT,
      codContabil TEXT,
      judet TEXT,
      localitate TEXT,
      strada TEXT,
      codPostal TEXT,
      telefon TEXT,
      email TEXT,
      banca TEXT,
      iban TEXT,
      agentId TEXT,
      priceZone TEXT,
      afiseazaKG INTEGER DEFAULT 0,
      productCodes TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Products table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      codArticolFurnizor TEXT NOT NULL,
      codProductie TEXT,
      codBare TEXT,
      descriere TEXT NOT NULL,
      um TEXT,
      gestiune TEXT,
      gramajKg REAL,
      cotaTVA INTEGER,
      prices TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database tables initialized');
};

// Initialize tables
createTables();

module.exports = db;