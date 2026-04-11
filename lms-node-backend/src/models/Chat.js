const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ['DIRECT', 'CHANNEL', 'GROUP', 'BROADCAST'],
        default: 'DIRECT'
    },
    participants: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }],
    admins: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    lastMessage: {
        text: String,
        sender: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    },
    category: {
        type: String,
        enum: ['OFFICIAL', 'CHANNELS', 'TEAM', 'SYSTEM'],
        default: 'CHANNELS'
    },
    description: String,
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Chat', ChatSchema);
