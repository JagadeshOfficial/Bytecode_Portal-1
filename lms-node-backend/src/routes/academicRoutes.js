const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// @desc    Get all batches
// @route   GET /api/academic/batches
router.get('/batches', async (req, res) => {
    try {
        // Query academic-db directly using the same connection if possible, 
        // or just return mock data if cross-db is tricky with mongoose.
        // For now, let's try to access the other DB via the connection.
        const db = mongoose.connection.useDb('academic-db');
        const batches = await db.collection('batches').find().toArray();
        res.json(batches);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
