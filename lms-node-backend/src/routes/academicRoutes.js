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

// @desc    Delete test
// @route   DELETE /api/academic/tests/:id
router.delete('/tests/:id', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        await db.collection('tests').deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Get test engine statistics
// @route   GET /api/academic/tests/stats
router.get('/tests/stats', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        const totalTests = await db.collection('tests').countDocuments();
        const submissions = await db.collection('test_submissions').find().toArray();
        const logs = await db.collection('proctoring_logs').countDocuments();
        
        const avgScore = submissions.length > 0 
            ? (submissions.reduce((acc, curr) => acc + (curr.score || 0), 0) / submissions.length).toFixed(1)
            : 0;

        res.json([
            { label: 'Active Tests', value: totalTests, change: '+2 this week', iconType: 'Play' },
            { label: 'Total Attempts', value: submissions.length >= 1000 ? (submissions.length/1000).toFixed(1) + 'k' : submissions.length, change: 'avg 2.1k / day', iconType: 'Users' },
            { label: 'Avg Pass Rate', value: avgScore + '%', change: 'improved 4%', iconType: 'CheckCircle' },
            { label: 'AI Monitoring Efficiency', value: '99.2%', change: 'real-time audit active', iconType: 'Shield' }
        ]);
    } catch (err) {
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
        const mapped = sessions.map(s => ({ ...s, id: s._id.toString() }));
        res.json(mapped);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Get sessions by batch (specific route if needed)
router.get('/sessions/batch/:batchId', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        const sessions = await db.collection('live_sessions').find({ batchId: req.params.batchId }).toArray();
        const mapped = sessions.map(s => ({ ...s, id: s._id.toString() }));
        res.json(mapped);
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
        const { id, _id, ...updateData } = req.body;
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

// @desc    Get mock interview statistics
// @route   GET /api/academic/mock-interviews/stats
router.get('/mock-interviews/stats', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        const totalInterviews = await db.collection('mock_interviews').countDocuments();
        const feedback = await db.collection('interview_feedback').find().toArray();
        
        const avgScore = feedback.length > 0 
            ? (feedback.reduce((acc, curr) => acc + (curr.aiScore || 0), 0) / feedback.length).toFixed(0)
            : 0;

        const suspicious = await db.collection('proctoring_logs').countDocuments({ type: 'INTERVIEW' });

        res.json([
            { label: 'Total Interviews', value: totalInterviews, change: '+12%', iconType: 'Video' },
            { label: 'Avg AI Score', value: avgScore + '%', change: '+5%', iconType: 'Brain' },
            { label: 'Suspicious Activities', value: suspicious, change: '-20%', iconType: 'Shield' },
            { label: 'Success Rate', value: '68%', change: '+8%', iconType: 'Target' }
        ]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Get tracking data for all students in a batch
// @route   GET /api/academic/batches/:batchId/student-tracking
router.get('/batches/:batchId/student-tracking', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        
        const batchId = req.params.batchId;
        const students = await db.collection('users').find({ role: 'STUDENT', batchId: batchId }).toArray();
        
        const trackingData = await Promise.all(students.map(async (student) => {
            const interviews = await db.collection('mock_interviews').find({ candidateId: student._id.toString() }).toArray();
            const tests = await db.collection('test_submissions').find({ studentId: student._id.toString() }).toArray();
            
            return {
                id: student._id,
                name: student.fullName,
                email: student.email,
                interviewsAttended: interviews.length,
                avgInterviewScore: interviews.length > 0 ? (interviews.reduce((acc, i) => acc + (i.aiScore || 0), 0) / interviews.length).toFixed(0) : 0,
                testsTaken: tests.length,
                avgTestScore: tests.length > 0 ? (tests.reduce((acc, t) => acc + (t.score || 0), 0) / tests.length).toFixed(0) : 0,
                overallProgress: Math.min(100, (interviews.length * 10 + tests.length * 5))
            };
        }));

        res.json(trackingData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- SESSION REQUEST ROUTES (Tutor Support) ---

// @desc    Get all session requests
router.get('/session-requests', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        const requests = await db.collection('session_requests').find().sort({ createdAt: -1 }).toArray();
        const mapped = requests.map(r => ({ ...r, id: r._id.toString() }));
        res.json(mapped);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Create a session request
router.post('/session-requests', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        const request = { 
            ...req.body, 
            status: 'PENDING',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const result = await db.collection('session_requests').insertOne(request);
        res.status(201).json({ ...request, id: result.insertedId.toString() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Approve/Reject a session request
router.put('/session-requests/:id/action', async (req, res) => {
    try {
        const { action, reviewerId, reviewerName } = req.body; // action: 'APPROVED' or 'REJECTED'
        const requestId = req.params.id;
        const db = mongoose.connection.useDb('academic-db');

        const request = await db.collection('session_requests').findOne({ _id: new mongoose.Types.ObjectId(requestId) });
        if (!request) return res.status(404).json({ error: 'Request not found' });

        if (action === 'APPROVED') {
            const academicDb = mongoose.connection.useDb('academic-db');
            
            // Execute the actual operation based on request type
            if (request.type === 'CREATE') {
                const sessionPayload = { ...request.data, createdAt: new Date() };
                await academicDb.collection('live_sessions').insertOne(sessionPayload);
            } else {
                if (!request.sessionId) {
                    console.error("Critical: Approval failed because sessionId is missing in request document", request);
                    return res.status(400).json({ error: "Session identification missing in request" });
                }

                const sessionFilter = { _id: new mongoose.Types.ObjectId(request.sessionId) };

                if (request.type === 'EDIT') {
                    const { id, _id, ...updateData } = request.data;
                    await academicDb.collection('live_sessions').updateOne(
                        sessionFilter,
                        { $set: { ...updateData, updatedAt: new Date() } }
                    );
                } else if (request.type === 'DELETE') {
                    await academicDb.collection('live_sessions').deleteOne(sessionFilter);
                } else if (request.type === 'DELETE_RECORDING') {
                    await academicDb.collection('live_sessions').updateOne(
                        sessionFilter,
                        { $set: { recordingUrl: null, updatedAt: new Date() } }
                    );
                } else if (request.type === 'DOWNLOAD_RECORDING') {
                    // No database change required on the session itself for downloads,
                    // just marking the request as APPROVED serves as the audit log.
                } else if (request.type === 'DELETE_ASSIGNMENT') {
                    if (request.assignmentId) {
                        await academicDb.collection('assignments').deleteOne({ 
                            _id: new mongoose.Types.ObjectId(request.assignmentId) 
                        });
                    }
                } else if (request.type === 'JOIN_SESSION') {
                    // Approval of JOIN_SESSION is primarily used for frontend access control.
                    // No direct modification to the live_sessions collection is required,
                    // but the request document status update (done below) acts as the permission flag.
                }
            }
        }

        // Update request status
        await db.collection('session_requests').updateOne(
            { _id: new mongoose.Types.ObjectId(requestId) },
            { $set: { status: action, reviewerId, reviewerName, updatedAt: new Date() } }
        );

        res.json({ success: true, status: action });
    } catch (err) {
        console.error("Action error:", err);
        res.status(500).json({ error: err.message });
    }
});

// --- NOTIFICATION ROUTES ---

// @desc    Get notifications for a user OR role
router.get('/notifications', async (req, res) => {
    try {
        const { userId, role } = req.query;
        console.log(`GET /notifications user=${userId} role=${role}`);
        const db = mongoose.connection.useDb('academic-db');
        
        let filter = {};
        if (userId && role) {
            filter = { $or: [{ userId: userId }, { role: role }, { role: 'ALL' }] };
        } else if (userId) {
            filter = { $or: [{ userId: userId }, { role: 'ALL' }] };
        } else if (role) {
            filter = { $or: [{ role: role }, { role: 'ALL' }] };
        }

        const notifications = await db.collection('notifications').find(filter).sort({ createdAt: -1 }).limit(50).toArray();
        console.log(`Found ${notifications.length} notifications`);
        const mapped = notifications.map(n => ({ ...n, id: n._id.toString() }));
        res.json(mapped);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Create a notification
router.post('/notifications', async (req, res) => {
    try {
        console.log(`POST /notifications:`, req.body);
        const db = mongoose.connection.useDb('academic-db');
        const notification = {
            ...req.body,
            status: 'UNREAD',
            createdAt: new Date()
        };
        const result = await db.collection('notifications').insertOne(notification);
        res.status(201).json({ ...notification, id: result.insertedId.toString() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Mark notification as read
router.patch('/notifications/:id/read', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        await db.collection('notifications').updateOne(
            { _id: new mongoose.Types.ObjectId(req.params.id) },
            { $set: { status: 'READ', readAt: new Date() } }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Delete notification
router.delete('/notifications/:id', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('academic-db');
        await db.collection('notifications').deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Withdrawal/Delete a session request
router.delete('/session-requests/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = mongoose.connection.db;
        const result = await db.collection('session_requests').deleteOne({ 
            _id: new mongoose.Types.ObjectId(id) 
        });
        if (result.deletedCount === 0) return res.status(404).json({ error: 'Request not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --- LIVE ROOM PARTICIPANT TRACKING ---

// @desc    Update participant heartbeat
router.post('/rooms/:id/heartbeat', async (req, res) => {
    try {
        const { id: roomId } = req.params;
        const { userId, name, role, isMuted, isVideoOff } = req.body;
        const db = mongoose.connection.useDb('academic-db');

        await db.collection('room_participants').updateOne(
            { roomId, userId },
            { 
                $set: { 
                    name, 
                    role, 
                    isMuted, 
                    isVideoOff, 
                    lastSeen: new Date() 
                } 
            },
            { upsert: true }
        );

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Get active participants in a room
router.get('/rooms/:id/participants', async (req, res) => {
    try {
        const { id: roomId } = req.params;
        const db = mongoose.connection.useDb('academic-db');

        // Consider a participant active if they checked in within the last 20 seconds
        const cutoff = new Date(Date.now() - 20000);
        const participants = await db.collection('room_participants')
            .find({ roomId, lastSeen: { $gt: cutoff } })
            .toArray();

        res.json(participants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Mark session as completed
router.patch('/sessions/:id/complete', async (req, res) => {
    try {
        const { id } = req.params;
        const db = mongoose.connection.useDb('academic-db');
        await db.collection('live_sessions').updateOne(
            { _id: new mongoose.Types.ObjectId(id) },
            { $set: { status: 'COMPLETED', completedAt: new Date() } }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Terminate a room (clear all participants)
router.post('/rooms/:id/terminate', async (req, res) => {
    try {
        const { id: roomId } = req.params;
        const db = mongoose.connection.useDb('academic-db');
        await db.collection('room_participants').deleteMany({ roomId });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
