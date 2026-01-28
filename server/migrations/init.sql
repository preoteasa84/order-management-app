-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE,
    role TEXT NOT NULL DEFAULT 'office' CHECK (role IN ('office', 'admin')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    commission_rate REAL DEFAULT 0.0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    office_user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (office_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ClientAllocations table
CREATE TABLE IF NOT EXISTS client_allocations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id TEXT NOT NULL,
    agent_id INTEGER NOT NULL,
    allocated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(client_id, agent_id),
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
);

-- Add agent_id to orders table if not exists
-- SQLite doesn't support ALTER TABLE ADD COLUMN IF NOT EXISTS
-- So we'll handle this in the database initialization code

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_client_allocations_client ON client_allocations(client_id);
CREATE INDEX IF NOT EXISTS idx_client_allocations_agent ON client_allocations(agent_id);
CREATE INDEX IF NOT EXISTS idx_agents_office_user ON agents(office_user_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
