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
        const mappedBatches = batches.map(b => ({
            ...b,
            id: b._id.toString()
        }));
        console.log(`Fetched ${mappedBatches.length} batches from academic-db`);
        res.json(mappedBatches);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Create new batch
// @route   POST /api/academic/batches
router.post('/batches', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        const batch = { ...req.body, createdAt: new Date(), updatedAt: new Date() };
        const result = await db.collection('batches').insertOne(batch);
        res.status(201).json({ ...batch, id: result.insertedId.toString() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Update batch
// @route   PUT /api/academic/batches/:id
router.put('/batches/:id', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        const { id, _id, ...updateData } = req.body;
        
        // Remove any other potential ID fields from updateData
        delete updateData.id;
        delete updateData._id;

        const result = await db.collection('batches').updateOne(
            { _id: new mongoose.Types.ObjectId(req.params.id) },
            { $set: { ...updateData, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Batch not found' });
        }

        res.json({ id: req.params.id, ...updateData });
    } catch (err) {
        console.error("Batch update error:", err);
        res.status(500).json({ error: err.message });
    }
});

// @desc    Delete batch
// @route   DELETE /api/academic/batches/:id
router.delete('/batches/:id', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        await db.collection('batches').deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get('/curriculum', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        const curriculum = await db.collection('curriculum').find().toArray();
        res.json(curriculum);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Get all sessions or by batch
router.get('/sessions', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        const filter = req.query.batchId ? { batchId: req.query.batchId } : {};
        const sessions = await db.collection('live_sessions').find(filter).toArray();
        res.json(sessions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Get sessions by batch (specific route if needed)
router.get('/sessions/batch/:batchId', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        const sessions = await db.collection('live_sessions').find({ batchId: req.params.batchId }).toArray();
        res.json(sessions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Create live session
router.post('/sessions', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        const session = { ...req.body, createdAt: new Date() };
        const result = await db.collection('live_sessions').insertOne(session);
        res.status(201).json({ ...session, id: result.insertedId.toString() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Update live session
router.put('/sessions/:id', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        const { id, ...updateData } = req.body;
        await db.collection('live_sessions').updateOne(
            { _id: new mongoose.Types.ObjectId(req.params.id) },
            { $set: updateData }
        );
        res.json({ id: req.params.id, ...updateData });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Delete live session
router.delete('/sessions/:id', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        await db.collection('live_sessions').deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
