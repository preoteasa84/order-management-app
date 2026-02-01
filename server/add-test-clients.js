const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'data.db'));

// Get the agent ID
const agent = db.prepare('SELECT * FROM agents LIMIT 1').get();
console.log('Agent:', agent);

// Get zones
const zones = db.prepare('SELECT * FROM zones').all();
console.log('Zones:', zones);

// Add some test clients
const clients = [
    {
        id: 'client-test-1',
        nume: 'Client Test 1',
        cif: '12345678',
        nrRegCom: 'J12/1234/2020',
        agentId: agent.id,
        priceZone: zones[0]?.id || 'zone_1',
        status: 'active',
        activeFrom: '2020-01-01'
    },
    {
        id: 'client-test-2',
        nume: 'Client Test 2',
        cif: '87654321',
        nrRegCom: 'J12/5678/2020',
        agentId: agent.id,
        priceZone: zones[0]?.id || 'zone_1',
        status: 'active',
        activeFrom: '2020-01-01'
    },
    {
        id: 'client-test-3',
        nume: 'Client Test 3',
        cif: '11223344',
        nrRegCom: 'J12/9012/2020',
        agentId: agent.id,
        priceZone: zones[1]?.id || 'zone_2',
        status: 'active',
        activeFrom: '2020-01-01'
    }
];

for (const client of clients) {
    const existing = db.prepare('SELECT * FROM clients WHERE id = ?').get(client.id);
    if (!existing) {
        db.prepare(
            'INSERT INTO clients (id, nume, cif, nrRegCom, agentId, priceZone, status, activeFrom) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        ).run(client.id, client.nume, client.cif, client.nrRegCom, client.agentId, client.priceZone, client.status, client.activeFrom);
        console.log(`✅ Client created: ${client.nume}`);
    } else {
        console.log(`✅ Client already exists: ${client.nume}`);
    }
}

console.log('\n✅ Test clients added!');
db.close();
