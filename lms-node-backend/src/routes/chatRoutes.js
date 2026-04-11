const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const Message = require('../models/Message');

// @desc    Get all chats for a user
// @route   GET /api/chat
router.get('/', async (req, res) => {
    try {
        // In a real app, we'd filter by req.user.id
        // For now, let's return all to populate the UI easily
        const chats = await Chat.find().populate('participants', 'name email').sort('-updatedAt');
        res.status(200).json(chats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Create a new chat
// @route   POST /api/chat
router.post('/', async (req, res) => {
    try {
        const chat = await Chat.create(req.body);
        res.status(201).json(chat);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// @desc    Get messages for a chat
// @route   GET /api/chat/:id/messages
router.get('/:id/messages', async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.id })
            .populate('sender', 'name email')
            .sort('createdAt');
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Send a message
// @route   POST /api/chat/:id/messages
router.post('/:id/messages', async (req, res) => {
    try {
        const message = await Message.create({
            chat: req.params.id,
            ...req.body
        });
        
        // Update last message in Chat
        await Chat.findByIdAndUpdate(req.params.id, {
            lastMessage: {
                text: message.text,
                sender: message.sender,
                timestamp: message.createdAt
            }
        });

        const populatedMessage = await Message.findById(message._id).populate('sender', 'name email');
        res.status(201).json(populatedMessage);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// @desc    Add member to chat
// @route   POST /api/chat/:id/members
router.post('/:id/members', async (req, res) => {
    try {
        const { userId } = req.body;
        const chat = await Chat.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { participants: userId } },
            { new: true }
        ).populate('participants', 'fullName email role');
        res.status(200).json(chat);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// @desc    Remove member from chat
// @route   DELETE /api/chat/:id/members/:userId
router.delete('/:id/members/:userId', async (req, res) => {
    try {
        const chat = await Chat.findByIdAndUpdate(
            req.params.id,
            { 
                $pull: { 
                    participants: req.params.userId,
                    admins: req.params.userId 
                } 
            },
            { new: true }
        ).populate('participants', 'fullName email role');
        res.status(200).json(chat);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// @desc    Promote to Admin
// @route   POST /api/chat/:id/admins
router.post('/:id/admins', async (req, res) => {
    try {
        const { userId } = req.body;
        const chat = await Chat.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { admins: userId } },
            { new: true }
        ).populate('participants', 'fullName email role');
        res.status(200).json(chat);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// @desc    Demote from Admin
// @route   DELETE /api/chat/:id/admins/:userId
router.delete('/:id/admins/:userId', async (req, res) => {
    try {
        const chat = await Chat.findByIdAndUpdate(
            req.params.id,
            { $pull: { admins: req.params.userId } },
            { new: true }
        ).populate('participants', 'fullName email role');
        res.status(200).json(chat);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
