const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer for video uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'src/public/recordings';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${req.params.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

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

// @desc    Upload recording for a session
router.post('/sessions/:id/recording', upload.single('recording'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const db = mongoose.connection.useDb('academic-db');
        const recordingUrl = `http://localhost:8080/uploads/recordings/${req.file.filename}`;
        
        // Find session and update recordingUrl
        // Room ID might be batchCode-timestamp (from frontend) or a DB _id
        let filter;
        try {
            filter = { _id: new mongoose.Types.ObjectId(req.params.id) };
        } catch (e) {
            // If not a valid ObjectId, try matching by meetingLink (which stores the room ID)
            filter = { meetingLink: req.params.id };
        }

        const result = await db.collection('live_sessions').updateOne(
            filter,
            { $set: { recordingUrl, status: 'RECORDED', updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            // If still not found, just return the URL so the frontend can handle it if it wants
            return res.json({ message: 'File saved but session not found in DB', recordingUrl });
        }

        res.json({ success: true, recordingUrl });
    } catch (err) {
        console.error("Recording upload error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
