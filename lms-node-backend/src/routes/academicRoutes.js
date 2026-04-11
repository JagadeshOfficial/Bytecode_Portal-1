const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const upload = multer({ storage: multer.memoryStorage() });

// GridFS initialization for BOTH recordings and assignments
let gridfsAssignments; 
mongoose.connection.on('connected', () => {
    const db = mongoose.connection.useDb('academic-db');
    gridfsAssignments = new mongoose.mongo.GridFSBucket(db, {
        bucketName: 'assignment_files'
    });
});

// GridFS initialization for recordings
let gridfsBucket;
mongoose.connection.on('connected', () => {
    const db = mongoose.connection.useDb('academic-db');
    gridfsBucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: 'recordings'
    });
});

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

// @desc    Get batches by course
// @route   GET /api/academic/batches/course/:courseId
router.get('/batches/course/:courseId', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        const batches = await db.collection('batches').find({ courseId: req.params.courseId }).toArray();
        const mappedBatches = batches.map(b => ({
            ...b,
            id: b._id.toString()
        }));
        res.json(mappedBatches);
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
        const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'recordings' });
        
        // Upload file to GridFS
        const uploadStream = bucket.openUploadStream(req.file.filename, {
            contentType: req.file.mimetype,
            metadata: { sessionId: req.params.id }
        });

        fs.createReadStream(req.file.path).pipe(uploadStream);

        uploadStream.on('error', (err) => {
            console.error("GridFS error:", err);
            return res.status(500).json({ error: 'Database storage failed' });
        });

        uploadStream.on('finish', async () => {
            // Clean up temporary local file
            fs.unlinkSync(req.file.path);

            const recordingUrl = `http://localhost:8080/api/academic/recording/${req.file.filename}`;
            
            let filter;
            try {
                filter = { _id: new mongoose.Types.ObjectId(req.params.id) };
            } catch (e) {
                filter = { meetingLink: req.params.id };
            }

            await db.collection('live_sessions').updateOne(
                filter,
                { $set: { recordingUrl, status: 'RECORDED', updatedAt: new Date() } }
            );

            res.json({ success: true, recordingUrl });
        });
    } catch (err) {
        console.error("Recording upload error:", err);
        res.status(500).json({ error: err.message });
    }
});

// @desc    Stream recording from MongoDB GridFS
router.get('/recording/:filename', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'recordings' });
        
        const files = await bucket.find({ filename: req.params.filename }).toArray();
        if (!files || files.length === 0) {
            return res.status(404).json({ error: 'Recording not found' });
        }

        res.set('Content-Type', files[0].contentType || 'video/webm');
        res.set('Accept-Ranges', 'bytes');

        const downloadStream = bucket.openDownloadStreamByName(req.params.filename);
        downloadStream.pipe(res);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Delete recording and cleanup GridFS
router.delete('/sessions/:id/recording', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'recordings' });
        
        let filter;
        try {
            filter = { _id: new mongoose.Types.ObjectId(req.params.id) };
        } catch (e) {
            filter = { meetingLink: req.params.id };
        }

        const session = await db.collection('live_sessions').findOne(filter);
        if (session && session.recordingUrl) {
            // Extract filename from URL
            const parts = session.recordingUrl.split('/');
            const filename = parts[parts.length - 1];
            
            // Delete from GridFS
            const files = await bucket.find({ filename }).toArray();
            for (const file of files) {
                await bucket.delete(file._id);
            }
        }

        // Detach from session
        await db.collection('live_sessions').updateOne(
            filter,
            { $set: { recordingUrl: null, status: 'SCHEDULED', updatedAt: new Date() } }
        );

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Upload general academic files (Assignments, Project brief) to GridFS
// @route   POST /api/academic/upload
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        // Lazy initialization check
        if (!gridfsAssignments) {
            const db = mongoose.connection.useDb('academic-db');
            gridfsAssignments = new mongoose.mongo.GridFSBucket(db, {
                bucketName: 'assignment_files'
            });
        }

        const filename = `${Date.now()}-${req.file.originalname}`;
        const uploadStream = gridfsAssignments.openUploadStream(filename, {
            contentType: req.file.mimetype
        });

        // Pass buffer to GridFS
        const Readable = require('stream').Readable;
        const s = new Readable();
        s._read = () => {};
        s.push(req.file.buffer);
        s.push(null);
        s.pipe(uploadStream);

        uploadStream.on('error', (err) => {
            console.error("GridFS Upload Error:", err);
            res.status(500).json({ error: 'Database storage failed' });
        });

        uploadStream.on('finish', () => {
            res.json({ 
                success: true, 
                url: `http://localhost:8080/api/academic/assignment-file/${filename}` 
            });
        });
    } catch (err) {
        console.error("Upload route error:", err);
        res.status(500).json({ error: err.message });
    }
});

// @desc    Get all assignments
router.get('/assignments', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        const assignments = await db.collection('assignments').find().toArray();
        const mapped = assignments.map(a => ({ ...a, id: a._id.toString() }));
        res.json(mapped);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Create new assignment
router.post('/assignments', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        const assignment = { ...req.body, createdAt: new Date() };
        const result = await db.collection('assignments').insertOne(assignment);
        res.status(201).json({ ...assignment, id: result.insertedId.toString() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Update assignment
router.put('/assignments/:id', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        const { id, _id, ...updateData } = req.body;
        await db.collection('assignments').updateOne(
            { _id: new mongoose.Types.ObjectId(req.params.id) },
            { $set: updateData }
        );
        res.json({ id: req.params.id, ...updateData });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Delete assignment
router.delete('/assignments/:id', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        await db.collection('assignments').deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Serve academic files from GridFS
router.get('/assignment-file/:filename', async (req, res) => {
    try {
        if (!gridfsAssignments) {
            const db = mongoose.connection.useDb('academic-db');
            gridfsAssignments = new mongoose.mongo.GridFSBucket(db, {
                bucketName: 'assignment_files'
            });
        }

        const files = await gridfsAssignments.find({ filename: req.params.filename }).toArray();
        if (!files || files.length === 0) return res.status(404).json({ error: 'File not found' });

        res.set('Content-Type', files[0].contentType || 'application/octet-stream');
        gridfsAssignments.openDownloadStreamByName(req.params.filename).pipe(res);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- UNIVERSAL TEST ENGINE ROUTES ---

// @desc    Get all tests
router.get('/tests', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        const tests = await db.collection('tests').find().toArray();
        const mapped = tests.map(t => ({ ...t, id: t._id.toString() }));
        res.json(mapped);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Create new test
router.post('/tests', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        const test = { 
            ...req.body, 
            createdAt: new Date(),
            updatedAt: new Date(),
            status: req.body.status || 'STAGING'
        };
        const result = await db.collection('tests').insertOne(test);
        res.status(201).json({ ...test, id: result.insertedId.toString() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Update test
router.put('/tests/:id', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        const { id, _id, ...updateData } = req.body;
        const result = await db.collection('tests').updateOne(
            { _id: new mongoose.Types.ObjectId(req.params.id) },
            { $set: { ...updateData, updatedAt: new Date() } }
        );
        res.json({ id: req.params.id, ...updateData });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Delete test
router.delete('/tests/:id', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        await db.collection('tests').deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Submit test response
router.post('/test-submissions', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        const submission = { ...req.body, submittedAt: new Date() };
        const result = await db.collection('test_submissions').insertOne(submission);
        res.status(201).json({ ...submission, id: result.insertedId.toString() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Log proctoring anomaly
router.post('/proctoring/logs', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        const log = { ...req.body, timestamp: new Date() };
        await db.collection('proctoring_logs').insertOne(log);
        res.status(201).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Get proctoring logs for a test/candidate
router.get('/proctoring/logs/:testId', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        const logs = await db.collection('proctoring_logs').find({ testId: req.params.testId }).toArray();
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- MOCK INTERVIEW ROUTES ---

// @desc    Get all mock interviews
router.get('/mock-interviews', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        const interviews = await db.collection('mock_interviews').find().toArray();
        const mapped = interviews.map(i => ({ ...i, id: i._id.toString() }));
        res.json(mapped);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Create new mock interview
router.post('/mock-interviews', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        const interview = { 
            ...req.body, 
            createdAt: new Date(),
            updatedAt: new Date(),
            status: req.body.status || 'SCHEDULED'
        };
        const result = await db.collection('mock_interviews').insertOne(interview);
        res.status(201).json({ ...interview, id: result.insertedId.toString() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Update mock interview
router.put('/mock-interviews/:id', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        const { id, _id, ...updateData } = req.body;
        const result = await db.collection('mock_interviews').updateOne(
            { _id: new mongoose.Types.ObjectId(req.params.id) },
            { $set: { ...updateData, updatedAt: new Date() } }
        );
        res.json({ id: req.params.id, ...updateData });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Delete mock interview
router.delete('/mock-interviews/:id', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        await db.collection('mock_interviews').deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Submit interview feedback
router.post('/interview-feedback', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        const feedback = { ...req.body, submittedAt: new Date() };
        const result = await db.collection('interview_feedback').insertOne(feedback);
        res.status(201).json({ ...feedback, id: result.insertedId.toString() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
