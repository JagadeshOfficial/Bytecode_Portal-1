const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Attendance = require('../models/Attendance');
const SystemLog = require('../models/SystemLog');
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

// @desc    Get aggregated tracking center data
// @route   GET /api/attendance/tracking-center
router.get('/tracking-center', async (req, res) => {
    try {
        const academicDb = mongoose.connection.useDb('academic-db');
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const [users, attendanceDocs, rawBatches, interviews, tests, systemLogs] = await Promise.all([
            User.find().lean(),
            Attendance.find().sort({ date: -1 }).limit(90).lean(),
            academicDb.collection('batches').find().toArray(),
            academicDb.collection('mock_interviews').find().toArray(),
            academicDb.collection('test_submissions').find().toArray(),
            SystemLog.find()
                .sort({ timestamp: -1 })
                .limit(20)
                .populate('user', 'fullName role email')
                .lean()
        ]);

        const batchById = new Map();
        const batchByUserId = new Map();

        rawBatches.forEach((batch) => {
            const info = {
                id: String(batch._id),
                batchCode: batch.batchCode || '',
                batchName: batch.batchName || batch.name || batch.batchCode || 'Unnamed Batch',
                courseName: batch.courseName || '',
                schedule: batch.schedule || '',
                mode: batch.mode || '',
                status: batch.status || '',
                trainerName: batch.trainerName || ''
            };

            batchById.set(info.id, info);

            (batch.studentIds || []).forEach((studentId) => {
                batchByUserId.set(String(studentId), info);
            });

            (batch.trainerIds || []).forEach((trainerId) => {
                if (!batchByUserId.has(String(trainerId))) {
                    batchByUserId.set(String(trainerId), info);
                }
            });

            if (batch.trainerId && !batchByUserId.has(String(batch.trainerId))) {
                batchByUserId.set(String(batch.trainerId), info);
            }
        });

        const latestAttendanceByUserId = new Map();
        let geoFenceEnabledSessions = 0;
        let qrEnabledSessions = 0;

        attendanceDocs.forEach((doc) => {
            if (doc.geoFenceEnabled) geoFenceEnabledSessions += 1;
            if (doc.qrActive) qrEnabledSessions += 1;

            (doc.records || []).forEach((record) => {
                const userId = record.student ? String(record.student) : '';
                if (!userId || latestAttendanceByUserId.has(userId)) return;

                const batchInfo = batchById.get(String(doc.batch));
                latestAttendanceByUserId.set(userId, {
                    attendanceDate: doc.date,
                    isToday: new Date(doc.date) >= startOfToday,
                    batchId: String(doc.batch || batchInfo?.id || ''),
                    batchName: batchInfo?.batchName || '',
                    batchCode: batchInfo?.batchCode || '',
                    sessionType: doc.sessionType || '',
                    sessionTopic: doc.sessionTopic || '',
                    status: record.status || 'ABSENT',
                    loginTime: record.loginTime || null,
                    logoutTime: record.logoutTime || null,
                    device: record.deviceInfo?.name || '',
                    os: record.deviceInfo?.os || '',
                    browser: record.deviceInfo?.browser || '',
                    deviceFingerprint: record.deviceInfo?.fingerprint || '',
                    ipAddress: record.ipAddress || '',
                    location: record.location || {},
                    isVpnDetected: Boolean(record.isVpnDetected),
                    isMultipleDevice: Boolean(record.isMultipleDevice),
                    remark: record.remark || ''
                });
            });
        });

        const interviewStatsByUserId = new Map();
        interviews.forEach((entry) => {
            const userId = String(entry.candidateId || entry.studentId || entry.userId || '');
            if (!userId) return;

            const current = interviewStatsByUserId.get(userId) || { count: 0, totalScore: 0 };
            current.count += 1;
            current.totalScore += Number(entry.aiScore || entry.score || 0);
            interviewStatsByUserId.set(userId, current);
        });

        const testStatsByUserId = new Map();
        tests.forEach((entry) => {
            const userId = String(entry.studentId || entry.userId || '');
            if (!userId) return;

            const current = testStatsByUserId.get(userId) || { count: 0, totalScore: 0 };
            current.count += 1;
            current.totalScore += Number(entry.score || entry.marks || 0);
            testStatsByUserId.set(userId, current);
        });

        const records = users.map((user) => {
            const userId = String(user._id);
            const attendance = latestAttendanceByUserId.get(userId);
            const directUserBatchInfo =
                user.batchId || user.batchName || user.courseName
                    ? {
                        id: String(user.batchId || ''),
                        batchCode: user.batchCode || '',
                        batchName: user.batchName || 'Unassigned',
                        courseName: user.courseName || '',
                    }
                    : null;
            const batchInfo = batchByUserId.get(userId) || batchById.get(String(user.batchId || '')) || directUserBatchInfo;
            const interviewStats = interviewStatsByUserId.get(userId) || { count: 0, totalScore: 0 };
            const testStats = testStatsByUserId.get(userId) || { count: 0, totalScore: 0 };
            const avgInterviewScore = interviewStats.count > 0 ? Math.round(interviewStats.totalScore / interviewStats.count) : 0;
            const avgTestScore = testStats.count > 0 ? Math.round(testStats.totalScore / testStats.count) : 0;
            const attendanceRate = typeof user.attendanceRate === 'number' ? user.attendanceRate : 0;

            const flags = [];
            if (attendance?.isVpnDetected) flags.push('VPN detected');
            if (attendance?.isMultipleDevice) flags.push('Multiple devices');
            if (attendance?.status === 'SUSPICIOUS') flags.push('Suspicious attendance');
            if (user.isRestricted) flags.push('Restricted account');
            if (attendance?.remark) flags.push(attendance.remark);

            const risk =
                flags.length >= 2 || attendance?.status === 'SUSPICIOUS'
                    ? 'HIGH'
                    : flags.length === 1 || attendance?.status === 'LATE'
                        ? 'MEDIUM'
                        : 'LOW';

            const overallProgress = Math.max(
                Math.round((attendanceRate * 0.5) + (avgInterviewScore * 0.25) + (avgTestScore * 0.25)),
                attendanceRate > 0 ? Math.round(attendanceRate) : 0
            );

            const city = attendance?.location?.city || user.lastLocation?.city || '';
            const state = attendance?.location?.state || user.lastLocation?.state || '';
            const location = [city, state].filter(Boolean).join(', ') || 'Not available';

            return {
                id: userId,
                name: user.fullName || 'Unknown User',
                email: user.email || '',
                role: user.role || 'UNKNOWN',
                branch: user.branch || '',
                department: user.department || '',
                userStatus: user.userStatus || 'Unknown',
                active: Boolean(user.active),
                isRestricted: Boolean(user.isRestricted),
                batchId: attendance?.batchId || batchInfo?.id || '',
                batchName: attendance?.batchName || batchInfo?.batchName || 'Unassigned',
                batchCode: attendance?.batchCode || batchInfo?.batchCode || user.batchCode || '',
                courseName: batchInfo?.courseName || user.courseName || '',
                attendanceRate,
                status: attendance?.status || 'NO_RECORD',
                isToday: Boolean(attendance?.isToday),
                loginTime: attendance?.loginTime,
                logoutTime: attendance?.logoutTime,
                lastActivityAt: attendance?.logoutTime || attendance?.loginTime || attendance?.attendanceDate || user.createdAt || null,
                lastSeen: attendance?.isToday
                    ? (attendance?.logoutTime ? 'Checked out today' : 'Active today')
                    : (attendance?.attendanceDate ? 'Previous session' : 'No attendance yet'),
                device: attendance?.device || (user.deviceFingerprints?.length ? 'Known device' : 'Not captured'),
                os: attendance?.os || '',
                browser: attendance?.browser || '',
                deviceFingerprint: attendance?.deviceFingerprint || '',
                ipAddress: attendance?.ipAddress || user.lastLoginIp || '',
                location,
                sessionType: attendance?.sessionType || '',
                sessionTopic: attendance?.sessionTopic || '',
                flags,
                risk,
                interviewsAttended: interviewStats.count,
                avgInterviewScore,
                testsTaken: testStats.count,
                avgTestScore,
                overallProgress: Math.min(100, overallProgress)
            };
        }).sort((a, b) => {
            const riskOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
            const aRank = riskOrder[a.risk] ?? 3;
            const bRank = riskOrder[b.risk] ?? 3;
            if (aRank !== bRank) return aRank - bRank;
            return a.name.localeCompare(b.name);
        });

        const presentToday = records.filter((row) => row.isToday && ['PRESENT', 'LATE', 'SUSPICIOUS'].includes(row.status)).length;
        const suspiciousCount = records.filter((row) => row.risk === 'HIGH' || row.status === 'SUSPICIOUS').length;
        const avgAttendanceRate =
            records.length > 0
                ? Number((records.reduce((sum, row) => sum + (row.attendanceRate || 0), 0) / records.length).toFixed(1))
                : 0;

        const derivedAlerts = records
            .filter((row) => row.risk !== 'LOW' || row.isRestricted)
            .slice(0, 12)
            .map((row) => ({
                id: `derived-${row.id}`,
                userId: row.id,
                userName: row.name,
                role: row.role,
                module: 'TRACKING',
                action: row.status === 'SUSPICIOUS' ? 'SUSPICIOUS_ATTENDANCE' : 'TRACKING_WARNING',
                severity: row.risk === 'HIGH' ? 'CRITICAL' : 'WARNING',
                timestamp: row.lastActivityAt || new Date().toISOString(),
                ipAddress: row.ipAddress,
                summary: row.flags[0] || row.status || 'Tracking warning'
            }));

        const logAlerts = systemLogs.map((log) => ({
            id: String(log._id),
            userId: log.user ? String(log.user._id || '') : '',
            userName: log.user?.fullName || 'System',
            role: log.user?.role || '',
            module: log.module || 'SYSTEM',
            action: log.action || 'SYSTEM_EVENT',
            severity: log.severity || 'INFO',
            timestamp: log.timestamp || log.createdAt || new Date().toISOString(),
            ipAddress: log.ipAddress || '',
            summary:
                typeof log.details === 'string'
                    ? log.details
                    : (log.details?.message || log.details?.remark || log.action || 'System activity')
        }));

        const alerts = [...logAlerts, ...derivedAlerts]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 12);

        const uniqueRoles = [...new Set(records.map((row) => row.role).filter(Boolean))].sort();
        const batchFilters = rawBatches.map((batch) => ({
            id: String(batch._id),
            batchCode: batch.batchCode || '',
            batchName: batch.batchName || batch.name || batch.batchCode || 'Unnamed Batch'
        }));

        res.json({
            generatedAt: new Date().toISOString(),
            summary: {
                totalUsers: records.length,
                totalStudents: records.filter((row) => row.role === 'STUDENT').length,
                totalStaff: records.filter((row) => row.role !== 'STUDENT').length,
                trackedBatches: batchFilters.length,
                presentToday,
                suspiciousCount,
                avgAttendanceRate,
                geoFenceEnabledSessions,
                qrEnabledSessions
            },
            filters: {
                roles: uniqueRoles,
                batches: batchFilters
            },
            alerts,
            records
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
