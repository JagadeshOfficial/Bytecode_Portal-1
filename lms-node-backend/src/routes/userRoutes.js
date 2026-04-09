const express = require('express');
const router = express.Router();
const User = require('../models/User');

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
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
