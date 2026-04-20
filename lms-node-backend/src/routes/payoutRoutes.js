const express = require('express');
const router = express.Router();
const Payout = require('../models/Payout');

// @desc    Get all payouts
// @route   GET /api/payouts
router.get('/', async (req, res) => {
    try {
        const payouts = await Payout.find().sort({ payoutDate: -1 });
        res.json(payouts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Get payouts for a specific user
// @route   GET /api/payouts/user/:userId
router.get('/user/:userId', async (req, res) => {
    try {
        const payouts = await Payout.find({ userId: req.params.userId }).sort({ payoutDate: -1 });
        res.json(payouts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Create a new payout
// @route   POST /api/payouts
router.post('/', async (req, res) => {
    try {
        const payout = new Payout(req.body);
        const savedPayout = await payout.save();
        res.status(201).json(savedPayout);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// @desc    Delete a payout record
// @route   DELETE /api/payouts/:id
router.delete('/:id', async (req, res) => {
    try {
        await Payout.findByIdAndDelete(req.params.id);
        res.json({ message: 'Payout record deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
