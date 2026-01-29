const express = require('express');
const router = express.Router();

let zones = []; // This will act as an in-memory database for demonstration.

router.get('/', (req, res) => {
    res.status(200).json(zones);
});

router.post('/', (req, res) => {
    const newZone = req.body;
    // Validate the newZone and handle errors
    if (!newZone.name) {
        return res.status(400).json({ error: 'Zone name is required' });
    }
    zones.push(newZone);
    res.status(201).json(newZone);
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const updatedZone = req.body;
    const index = zones.findIndex(zone => zone.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Zone not found' });
    }

    zones[index] = { ...zones[index], ...updatedZone };
    res.status(200).json(zones[index]);
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const index = zones.findIndex(zone => zone.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Zone not found' });
    }

    zones.splice(index, 1);
    res.status(204).send();
});

module.exports = router;