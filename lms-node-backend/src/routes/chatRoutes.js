const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const Message = require('../models/Message');

// @desc    Get a single chat detail
// @route   GET /api/chat/:id
router.get('/:id', async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id)
            .populate('participants', 'fullName email role profileImage');
        if (!chat) return res.status(404).json({ error: 'Chat not found' });
        res.status(200).json(chat);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Get all chats for a user
// @route   GET /api/chat
router.get('/', async (req, res) => {
    try {
        // In a real app, we'd filter by req.user.id
        // For now, let's return all to populate the UI easily
        const chats = await Chat.find().populate('participants', 'fullName email role profileImage').sort('-updatedAt');
        res.status(200).json(chats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Update a chat (Rename, Change Image)
// @route   PUT /api/chat/:id
router.put('/:id', async (req, res) => {
    try {
        console.log(`Update request for chat ${req.params.id}. Fields:`, Object.keys(req.body));
        const { name, image, description, category } = req.body;
        
        const updateData = {};
        if (name) updateData.name = name;
        if (image) updateData.image = image;
        if (description) updateData.description = description;
        if (category) updateData.category = category;

        const chat = await Chat.findByIdAndUpdate(req.params.id, updateData, { new: true })
            .populate('participants', 'fullName email role profileImage');
        
        if (!chat) return res.status(404).json({ error: 'Chat not found' });
        console.log('Chat updated successfully:', chat.name, chat.image ? 'IMAGE_PRESENT' : 'NO_IMAGE');
        res.status(200).json(chat);
    } catch (err) {
        console.error('Update Hub Error:', err);
        res.status(400).json({ error: err.message });
    }
});

// @desc    Archive/Unarchive a chat
// @route   PATCH /api/chat/:id/archive
router.patch('/:id/archive', async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id);
        if (!chat) return res.status(404).json({ error: 'Chat not found' });
        
        chat.isArchived = !chat.isArchived;
        await chat.save();
        
        res.status(200).json(chat);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Delete a chat
// @route   DELETE /api/chat/:id
router.delete('/:id', async (req, res) => {
    try {
        const chat = await Chat.findByIdAndDelete(req.params.id);
        if (!chat) return res.status(404).json({ error: 'Chat not found' });
        // Also delete associated messages
        await Message.deleteMany({ chat: req.params.id });
        res.status(200).json({ message: 'Chat and messages deleted successfully' });
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
            .populate('sender', 'fullName email role profileImage')
            .populate({
                path: 'parentMessage',
                populate: { path: 'sender', select: 'fullName' }
            })
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

        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'fullName email role profileImage')
            .populate({
                path: 'parentMessage',
                populate: { path: 'sender', select: 'fullName' }
            });
        res.status(201).json(populatedMessage);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// @desc    Delete a message
// @route   DELETE /api/chat/messages/:id
router.delete('/messages/:id', async (req, res) => {
    try {
        const { forEveryone, userId } = req.body;
        const message = await Message.findById(req.params.id);
        if (!message) return res.status(404).json({ error: 'Message not found' });

        if (forEveryone) {
            await Message.findByIdAndDelete(req.params.id);
        } else {
            // Soft delete for specific user
            await Message.findByIdAndUpdate(req.params.id, {
                $addToSet: { isDeletedFor: userId }
            });
        }
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
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
