const express = require('express');
const mongoose = require('mongoose');

const Attendance = require('../models/Attendance');
const SystemLog = require('../models/SystemLog');
const User = require('../models/User');

const router = express.Router();

function toValidDate(...values) {
    for (const value of values) {
        if (!value) continue;

        const date = new Date(value);
        if (!Number.isNaN(date.getTime())) {
            return date;
        }
    }

    return null;
}

function humanizeValue(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeKey(value) {
    return String(value || '').trim();
}

function normalizeEmail(value) {
    return normalizeKey(value).toLowerCase();
}

function buildUserLookups(users) {
    const byId = new Map();
    const byEmail = new Map();

    users.forEach((user) => {
        const id = normalizeKey(user._id);
        const email = normalizeEmail(user.email);

        if (id) byId.set(id, user);
        if (email) byEmail.set(email, user);
    });

    return { byId, byEmail };
}

function findUserRecord(lookups, ...values) {
    for (const value of values) {
        const key = normalizeKey(value);
        if (!key) continue;

        const directMatch = lookups.byId.get(key);
        if (directMatch) return directMatch;

        const emailMatch = lookups.byEmail.get(key.toLowerCase());
        if (emailMatch) return emailMatch;
    }

    return null;
}

function resolveUserName(lookups, explicitName, fallback, ...identifiers) {
    const cleanName = normalizeKey(explicitName);
    if (cleanName) return cleanName;

    const matchedUser = findUserRecord(lookups, ...identifiers);
    return matchedUser?.fullName || matchedUser?.email || fallback;
}

function resolveUserRole(lookups, explicitRole, fallback, ...identifiers) {
    const cleanRole = normalizeKey(explicitRole);
    if (cleanRole) return cleanRole;

    const matchedUser = findUserRecord(lookups, ...identifiers);
    return matchedUser?.role || fallback;
}

function resolveUserLabelList(lookups, values = [], fallback) {
    const labels = [];
    const seen = new Set();

    values.forEach((value) => {
        const label = resolveUserName(lookups, '', '', value);
        if (!label) return;

        const normalizedLabel = label.toLowerCase();
        if (seen.has(normalizedLabel)) return;

        seen.add(normalizedLabel);
        labels.push(label);
    });

    if (labels.length === 0) return fallback;
    if (labels.length <= 2) return labels.join(', ');

    return `${labels.slice(0, 2).join(', ')} +${labels.length - 2} more`;
}

function pushActivityEvent(events, event) {
    const timestamp = toValidDate(event.timestamp);
    if (!timestamp) return;

    events.push({
        ...event,
        timestamp: timestamp.toISOString(),
    });
}

// @desc    Get comprehensive admin stats
// @route   GET /api/admin/stats
router.get('/stats', async (req, res) => {
    try {
        const studentCount = await User.countDocuments({ role: 'STUDENT' });
        const trainerCount = await User.countDocuments({ role: 'TRAINER' });

        const financeDb = mongoose.connection.useDb('finance-db');
        const fees = await financeDb.collection('fee_records').find().toArray();
        const totalRevenue = fees.reduce((acc, curr) => acc + (curr.paidAmount || 0), 0);

        const revenueByMonth = {};
        fees.forEach((fee) => {
            if (!fee.lastPaymentDate) return;

            const date = new Date(fee.lastPaymentDate);
            const month = date.toLocaleString('default', { month: 'short' });
            revenueByMonth[month] = (revenueByMonth[month] || 0) + (fee.paidAmount || 0);
        });

        const chartData = Object.keys(revenueByMonth).map((month) => ({
            month,
            revenue: revenueByMonth[month],
        }));

        const courseDb = mongoose.connection.useDb('course-db');
        const courseCount = await courseDb.collection('courses').countDocuments();

        const placementDb = mongoose.connection.useDb('placement-db');
        const placements = await placementDb.collection('placement_records').find().toArray();
        const jobListings = await placementDb.collection('job_listings').countDocuments();

        const placementRate = placements.length > 0 ? 92.4 : 0;

        const userDb = mongoose.connection.useDb('user-db');
        const leadsCollection = userDb.collection('leads');
        const [leadCount, interestedCount, admissionCount] = await Promise.all([
            leadsCollection.countDocuments({ status: 'NEW' }),
            leadsCollection.countDocuments({ status: 'INTERESTED' }),
            leadsCollection.countDocuments({ status: 'CONVERTED' }),
        ]);

        res.json({
            totalStudents: studentCount,
            totalTrainers: trainerCount,
            totalRevenue: totalRevenue || 142500,
            activeCourses: courseCount,
            placementRate,
            jobListings,
            conversionData: [
                { name: 'New Leads', value: leadCount || 850, fill: '#8b5cf6' },
                { name: 'Interested', value: interestedCount || 420, fill: '#3b82f6' },
                { name: 'Admissions', value: admissionCount || 310, fill: '#10b981' },
            ],
            revenueTrend: chartData.length > 0 ? chartData : [
                { month: 'Jan', revenue: 45000 },
                { month: 'Feb', revenue: 52000 },
                { month: 'Mar', revenue: 48000 },
                { month: 'Apr', revenue: 61000 },
                { month: 'May', revenue: 55000 },
                { month: 'Jun', revenue: 72000 },
            ],
            placements: placements.slice(0, 5),
        });
    } catch (err) {
        console.error('Stats error:', err);
        res.status(500).json({ error: err.message });
    }
});

// @desc    Get aggregated system activity
// @route   GET /api/admin/system-activity
router.get('/system-activity', async (req, res) => {
    try {
        const academicDb = mongoose.connection.useDb('academic-db');

        const [
            systemLogs,
            allUsers,
            recentUsers,
            attendanceDocs,
            batches,
            liveSessions,
            mockInterviews,
            testSubmissions,
        ] = await Promise.all([
            SystemLog.find()
                .sort({ timestamp: -1 })
                .limit(50)
                .populate('user', 'fullName role email')
                .lean(),
            User.find()
                .select('fullName role email createdAt')
                .lean(),
            User.find()
                .sort({ createdAt: -1 })
                .limit(30)
                .lean(),
            Attendance.find()
                .sort({ date: -1, createdAt: -1 })
                .limit(30)
                .populate('trainer', 'fullName role email')
                .lean(),
            academicDb.collection('batches').find().sort({ updatedAt: -1, createdAt: -1 }).limit(20).toArray(),
            academicDb.collection('live_sessions').find().sort({ updatedAt: -1, createdAt: -1, startTime: -1 }).limit(20).toArray(),
            academicDb.collection('mock_interviews').find().sort({ updatedAt: -1, createdAt: -1, interviewDate: -1 }).limit(20).toArray(),
            academicDb.collection('test_submissions').find().sort({ updatedAt: -1, createdAt: -1, submittedAt: -1 }).limit(20).toArray(),
        ]);

        const events = [];
        const userLookups = buildUserLookups(allUsers);

        systemLogs.forEach((log) => {
            const matchedUser = log.user
                ? findUserRecord(userLookups, log.user._id, log.user.email)
                : null;

            pushActivityEvent(events, {
                id: String(log._id),
                timestamp: log.timestamp || log.createdAt,
                module: log.module || 'SYSTEM',
                action: log.action || 'SYSTEM_EVENT',
                severity: log.severity || 'INFO',
                userName: log.user?.fullName || matchedUser?.fullName || 'System',
                userRole: log.user?.role || matchedUser?.role || '',
                source: log.ipAddress || 'system-log',
                target: log.details?.target || log.details?.path || '',
                summary:
                    typeof log.details === 'string'
                        ? log.details
                        : (log.details?.message || log.details?.remark || humanizeValue(log.action)),
                details: log.details || {},
            });
        });

        recentUsers.forEach((user) => {
            pushActivityEvent(events, {
                id: `user-${user._id}`,
                timestamp: user.createdAt,
                module: 'USERS',
                action: 'USER_CREATED',
                severity: 'INFO',
                userName: user.fullName || user.email || 'User',
                userRole: user.role || '',
                source: 'user-db',
                target: user.email || '',
                summary: `New ${humanizeValue(user.role || 'user')} account was created`,
                details: {
                    email: user.email || '',
                    branch: user.branch || '',
                    department: user.department || '',
                },
            });
        });

        attendanceDocs.forEach((doc) => {
            const trainerUser = findUserRecord(userLookups, doc.trainer?._id, doc.trainer?.email, doc.trainer);
            const suspiciousCount = (doc.records || []).filter((record) =>
                record.status === 'SUSPICIOUS' || record.isVpnDetected || record.isMultipleDevice
            ).length;

            const presentCount = (doc.records || []).filter((record) =>
                ['PRESENT', 'LATE', 'SUSPICIOUS'].includes(record.status)
            ).length;

            pushActivityEvent(events, {
                id: `attendance-${doc._id}`,
                timestamp: doc.updatedAt || doc.createdAt || doc.date,
                module: 'ATTENDANCE',
                action: 'ATTENDANCE_CAPTURED',
                severity: suspiciousCount > 0 ? 'WARNING' : 'INFO',
                userName: doc.trainer?.fullName || trainerUser?.fullName || 'Trainer',
                userRole: doc.trainer?.role || trainerUser?.role || 'TRAINER',
                source: 'attendance',
                target: doc.batch || '',
                summary: `${presentCount}/${(doc.records || []).length} users marked for ${doc.sessionTopic || doc.sessionType || 'session'}`,
                details: {
                    sessionType: doc.sessionType || '',
                    sessionTopic: doc.sessionTopic || '',
                    trainerStatus: doc.trainerStatus || '',
                    suspiciousCount,
                },
            });
        });

        batches.forEach((batch) => {
            const batchTrainer = findUserRecord(userLookups, batch.trainerId, batch.trainerEmail);
            pushActivityEvent(events, {
                id: `batch-${batch._id}`,
                timestamp: batch.updatedAt || batch.createdAt,
                module: 'ACADEMIC',
                action: batch.updatedAt && batch.createdAt && String(batch.updatedAt) !== String(batch.createdAt) ? 'BATCH_UPDATED' : 'BATCH_CREATED',
                severity: 'INFO',
                userName: batch.trainerName || batchTrainer?.fullName || 'Academic Team',
                userRole: batchTrainer?.role || 'TRAINER',
                source: 'academic-db',
                target: batch.batchCode || batch.batchName || '',
                summary: `${batch.batchName || batch.batchCode || 'Batch'} linked to ${batch.courseName || 'course'}`,
                details: {
                    batchCode: batch.batchCode || '',
                    batchName: batch.batchName || '',
                    courseName: batch.courseName || '',
                    status: batch.status || '',
                    totalStudents: batch.totalStudents || 0,
                },
            });
        });

        liveSessions.forEach((session) => {
            const sessionTrainer = findUserRecord(
                userLookups,
                session.trainerId,
                session.hostId,
                session.trainerEmail,
                session.hostEmail
            );

            pushActivityEvent(events, {
                id: `live-${session._id}`,
                timestamp: session.updatedAt || session.createdAt || session.startTime || session.date,
                module: 'LIVE',
                action: session.status ? `LIVE_${String(session.status).toUpperCase()}` : 'LIVE_SESSION_SAVED',
                severity: 'INFO',
                userName: session.trainerName || session.hostName || sessionTrainer?.fullName || 'Live Session',
                userRole: sessionTrainer?.role || 'TRAINER',
                source: 'academic-db',
                target: session.title || session.topic || session.roomName || '',
                summary: `${session.title || session.topic || 'Live session'} was updated`,
                details: {
                    batchName: session.batchName || '',
                    roomName: session.roomName || '',
                    status: session.status || '',
                },
            });
        });

        mockInterviews.forEach((interview) => {
            const resolvedCandidateName = resolveUserName(
                userLookups,
                interview.candidateName || interview.studentName,
                resolveUserLabelList(userLookups, interview.candidateIds || [], 'Candidate'),
                interview.candidateId,
                interview.studentId,
                interview.userId,
                interview.email
            );
            const interviewerName = resolveUserName(
                userLookups,
                interview.interviewerName,
                '',
                interview.interviewerId,
                interview.interviewerEmail
            );

            pushActivityEvent(events, {
                id: `interview-${interview._id}`,
                timestamp: interview.updatedAt || interview.createdAt || interview.interviewDate,
                module: 'INTERVIEW',
                action: 'MOCK_INTERVIEW_RECORDED',
                severity: Number(interview.aiScore || 0) < 40 ? 'WARNING' : 'INFO',
                userName: resolvedCandidateName,
                userRole: resolveUserRole(
                    userLookups,
                    interview.candidateRole || interview.studentRole,
                    'STUDENT',
                    interview.candidateId,
                    interview.studentId,
                    interview.userId,
                    interview.email,
                    ...(interview.candidateIds || [])
                ),
                source: 'academic-db',
                target: interview.position || interview.domain || '',
                summary: `Mock interview saved for ${resolvedCandidateName} with score ${Number(interview.aiScore || 0)}%`,
                details: {
                    aiScore: Number(interview.aiScore || 0),
                    interviewer: interviewerName || interview.interviewerName || '',
                    candidateId: interview.candidateId || interview.studentId || '',
                    candidateIds: interview.candidateIds || [],
                },
            });
        });

        testSubmissions.forEach((submission) => {
            const resolvedStudentName = resolveUserName(
                userLookups,
                submission.studentName,
                'Student',
                submission.studentId,
                submission.userId,
                submission.studentEmail,
                submission.email
            );

            pushActivityEvent(events, {
                id: `submission-${submission._id}`,
                timestamp: submission.updatedAt || submission.createdAt || submission.submittedAt,
                module: 'ASSESSMENT',
                action: 'TEST_SUBMISSION_RECORDED',
                severity: Number(submission.score || 0) < 35 ? 'WARNING' : 'INFO',
                userName: resolvedStudentName,
                userRole: resolveUserRole(
                    userLookups,
                    submission.studentRole,
                    'STUDENT',
                    submission.studentId,
                    submission.userId,
                    submission.studentEmail,
                    submission.email
                ),
                source: 'academic-db',
                target: submission.testName || submission.testId || '',
                summary: `Assessment submission saved for ${resolvedStudentName} with score ${Number(submission.score || 0)}%`,
                details: {
                    score: Number(submission.score || 0),
                    testId: submission.testId || '',
                    studentId: submission.studentId || submission.userId || '',
                },
            });
        });

        const sortedEvents = events
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 120);

        const now = Date.now();
        const moduleCounts = {};
        const uniqueUsers = new Set();
        let criticalCount = 0;
        let warningCount = 0;
        let infoCount = 0;
        let last24HoursCount = 0;

        sortedEvents.forEach((event) => {
            moduleCounts[event.module] = (moduleCounts[event.module] || 0) + 1;

            if (event.userName) {
                uniqueUsers.add(`${event.userName}-${event.userRole || ''}`);
            }

            if (event.severity === 'CRITICAL') criticalCount += 1;
            else if (event.severity === 'WARNING') warningCount += 1;
            else infoCount += 1;

            if (now - new Date(event.timestamp).getTime() <= 24 * 60 * 60 * 1000) {
                last24HoursCount += 1;
            }
        });

        const moduleBreakdown = Object.entries(moduleCounts)
            .map(([module, count]) => ({ module, count }))
            .sort((a, b) => b.count - a.count);

        res.json({
            generatedAt: new Date().toISOString(),
            summary: {
                totalEvents: sortedEvents.length,
                last24HoursCount,
                criticalCount,
                warningCount,
                infoCount,
                activeModules: moduleBreakdown.length,
                uniqueUsers: uniqueUsers.size,
            },
            moduleBreakdown,
            events: sortedEvents,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Get dashboard applications (Leads)
// @route   GET /api/admin/applications
router.get('/applications', async (req, res) => {
    try {
        const apps = [
            { id: 1, name: 'Karthik R.', course: 'Masters in AI', date: '2 Hours Ago', status: 'PENDING', statusColor: '#f59e0b' },
            { id: 2, name: 'Anjali Sharma', course: 'Full Stack Pro', date: '5 Hours Ago', status: 'INTERVIEW', statusColor: '#3b82f6' },
            { id: 3, name: 'Siddharth M.', course: 'AWS Cloud Eng', date: 'Today', status: 'VERIFIED', statusColor: '#10b981' },
        ];
        res.json(apps);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
