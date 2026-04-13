const mongoose = require('mongoose');

const CallSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.ObjectId,
        ref: 'Chat',
        required: true
    },
    initiator: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: ['AUDIO', 'VIDEO'],
        default: 'AUDIO'
    },
    status: {
        type: String,
        enum: ['RINGING', 'ACTIVE', 'ENDED', 'MISSED', 'REJECTED'],
        default: 'RINGING'
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    endedAt: Date,
    duration: Number
}, {
    timestamps: true
});

module.exports = mongoose.model('Call', CallSchema);
