const mongoose = require('mongoose');

const LeadHistorySchema = new mongoose.Schema({
    leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['CREATE', 'UPDATE_STATUS', 'ASSIGN', 'REASSIGN', 'NOTE_ADDED', 'CALL_LOG', 'FOLLOWUP_SCHEDULED', 'CONVERTED', 'LOST']
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    details: {
        type: String,
        required: true
    },
    previousValue: {
        type: mongoose.Schema.Types.Mixed
    },
    newValue: {
        type: mongoose.Schema.Types.Mixed
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('LeadHistory', LeadHistorySchema);
