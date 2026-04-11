const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.ObjectId,
        ref: 'Chat',
        required: true
    },
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['TEXT', 'FILE', 'AI', 'SYSTEM'],
        default: 'TEXT'
    },
    status: {
        type: String,
        enum: ['SENT', 'DELIVERED', 'SEEN'],
        default: 'SENT'
    },
    fileName: String,
    fileUrl: String,
    fileSize: String,
    reactions: [{
        emoji: String,
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    }],
    isPinned: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Message', MessageSchema);
