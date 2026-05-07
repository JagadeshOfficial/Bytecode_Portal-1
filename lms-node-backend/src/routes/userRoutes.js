const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');

function normalizeRole(value) {
    return String(value || '').trim().toUpperCase();
}

async function resolveActingUser(req) {
    const actingUserId =
        req.body?.actingUserId ||
        req.query?.actingUserId ||
        req.headers['x-acting-user-id'];

    if (!actingUserId || !mongoose.Types.ObjectId.isValid(String(actingUserId))) {
        return null;
    }

    return User.findById(String(actingUserId));
}

function getActingRole(req, actingUser) {
    return normalizeRole(
        actingUser?.role ||
        req.body?.actingUserRole ||
        req.query?.actingUserRole ||
        req.headers['x-acting-user-role']
    );
}

// @desc    Get all users
// @route   GET /api/users
// @access  Private (should be, but for now Public to fix 404)
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        const mappedUsers = users.map(u => ({
            ...u.toObject(),
            id: u._id.toString()
        }));
        res.json(mappedUsers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Get single user
// @route   GET /api/users/:id
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        // Ensure all fields are present even if they are empty strings
        const userData = user.toObject();
        res.json({
            ...userData,
            id: userData._id.toString(),
            fullName: userData.fullName || '',
            email: userData.email || '',
            phoneNumber: userData.phoneNumber || '',
            branch: userData.branch || '',
            department: userData.department || '',
            userStatus: userData.userStatus || '',
            profileImage: userData.profileImage || ''
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Update single user
// @route   PUT /api/users/:id
router.put('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('+password');
        if (!user) return res.status(404).json({ error: 'User not found' });

        const actingUser = await resolveActingUser(req);
        const actingRole = getActingRole(req, actingUser);
        const targetRole = normalizeRole(user.role);

        if (actingRole === 'ADMIN' && targetRole === 'SUPER_ADMIN') {
            return res.status(403).json({ error: 'Admin cannot edit Super Admin accounts' });
        }

        const allowedFields = [
            'fullName',
            'email',
            'password',
            'phoneNumber',
            'branch',
            'department',
            'userStatus',
            'profileImage',
            'active',
            'attendanceRate',
            'isRestricted',
            'batchId',
            'batchCode',
            'batchName',
            'courseId',
            'courseName',
            'lastLoginIp',
            'lastLocation',
            'salary',
            'deductions',
            'leavesTotal',
            'leavesAccepted',
            'leavesRejected',
            'leaveHistory',
            'requirementRequests',
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field];
            }
        });

        const updatedUser = await user.save();
        res.json({
            ...updatedUser.toObject(),
            id: updatedUser._id.toString()
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Delete single user
// @route   DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const actingUser = await resolveActingUser(req);
        const actingRole = getActingRole(req, actingUser);
        const targetRole = normalizeRole(user.role);

        if (actingUser && String(actingUser._id) === String(user._id)) {
            return res.status(400).json({ error: 'You cannot delete your own account' });
        }

        if (targetRole === 'SUPER_ADMIN' && actingRole !== 'SUPER_ADMIN') {
            return res.status(403).json({ error: 'Only Super Admin can delete Super Admin accounts' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Assign a user to an academic batch and sync course details
// @route   PUT /api/users/:id/academic-assignment
router.put('/:id/academic-assignment', async (req, res) => {
    try {
        const { batchId } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const academicDb = mongoose.connection.useDb('academic-db');
        const userId = user._id.toString();

        await academicDb.collection('batches').updateMany(
            {},
            { $pull: { studentIds: userId, trainerIds: userId } }
        );

        await academicDb.collection('batches').updateMany(
            { trainerId: userId },
            { $unset: { trainerId: '', trainerName: '' } }
        );

        if (!batchId) {
            user.batchId = '';
            user.batchCode = '';
            user.batchName = '';
            user.courseId = '';
            user.courseName = '';

            const clearedUser = await user.save();
            return res.json({
                message: 'Academic assignment cleared',
                user: {
                    ...clearedUser.toObject(),
                    id: clearedUser._id.toString()
                }
            });
        }

        const batchQueryId = mongoose.Types.ObjectId.isValid(batchId)
            ? new mongoose.Types.ObjectId(batchId)
            : batchId;

        const batch = await academicDb.collection('batches').findOne({ _id: batchQueryId });
        if (!batch) {
            return res.status(404).json({ error: 'Batch not found' });
        }

        const isTrainer = user.role === 'TRAINER' || req.body.assignmentType === 'TRAINER';

        if (isTrainer) {
            await academicDb.collection('batches').updateOne(
                { _id: batchQueryId },
                {
                    $set: {
                        trainerId: userId,
                        trainerName: user.fullName
                    },
                    $addToSet: {
                        trainerIds: userId
                    }
                }
            );
        } else {
            await academicDb.collection('batches').updateOne(
                { _id: batchQueryId },
                {
                    $addToSet: {
                        studentIds: userId
                    }
                }
            );

            const refreshedBatch = await academicDb.collection('batches').findOne({ _id: batchQueryId });
            await academicDb.collection('batches').updateOne(
                { _id: batchQueryId },
                {
                    $set: {
                        totalStudents: (refreshedBatch?.studentIds || []).length
                    }
                }
            );
        }

        user.batchId = String(batch._id);
        user.batchCode = batch.batchCode || '';
        user.batchName = batch.batchName || batch.name || batch.batchCode || '';
        user.courseId = batch.courseId || '';
        user.courseName = batch.courseName || '';

        const updatedUser = await user.save();

        res.json({
            message: 'Academic assignment updated',
            user: {
                ...updatedUser.toObject(),
                id: updatedUser._id.toString()
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
