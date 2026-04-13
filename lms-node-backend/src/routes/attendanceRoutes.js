const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const User = require('../models/User');

// @desc    Mark attendance for a session
// @route   POST /api/attendance
router.post('/', async (req, res) => {
    try {
        const { date, batch, trainer, trainerStatus, records, sessionType, sessionTopic } = req.body;
        
        // Upsert logic: if attendance for this batch/date exists, update it
        const startOfDay = new Date(date);
        startOfDay.setHours(0,0,0,0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23,59,59,999);

        const existing = await Attendance.findOne({
            batch,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (existing) {
            existing.trainerStatus = trainerStatus;
            existing.records = records;
            existing.sessionType = sessionType;
            existing.sessionTopic = sessionTopic;
            existing.trainer = trainer;
            await existing.save();
            return res.status(200).json(existing);
        }

        const attendance = new Attendance({
            date,
            batch,
            trainer,
            trainerStatus,
            records,
            sessionType,
            sessionTopic
        });

        await attendance.save();
        res.status(201).json(attendance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Get attendance history for a batch
// @route   GET /api/attendance/batch/:batchId
router.get('/batch/:batchId', async (req, res) => {
    try {
        const history = await Attendance.find({ batch: req.params.batchId })
            .populate('trainer', 'fullName profileImage')
            .populate('records.student', 'fullName profileImage')
            .sort({ date: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Get daily attendance report
// @route   GET /api/attendance/daily
router.get('/daily', async (req, res) => {
    try {
        const { date } = req.query;
        const targetDate = date ? new Date(date) : new Date();
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0,0,0,0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23,59,59,999);

        const records = await Attendance.find({
            date: { $gte: startOfDay, $lte: endOfDay }
        }).populate('trainer', 'fullName');
        
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
