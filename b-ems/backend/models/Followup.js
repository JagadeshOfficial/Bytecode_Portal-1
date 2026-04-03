const mongoose = require('mongoose');

const FollowupSchema = new mongoose.Schema({
    leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead',
        required: true
    },
    scheduledAt: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        enum: ['CALL', 'EMAIL', 'WHATSAPP', 'MEETING'],
        default: 'CALL'
    },
    status: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'MISSED', 'CANCELLED'],
        default: 'PENDING'
    },
    notes: {
        type: String
    },
    reminderSent: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Followup', FollowupSchema);
