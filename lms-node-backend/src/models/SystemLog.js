const mongoose = require('mongoose');

const SystemLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String, // e.g., 'ADMIN_APPROVAL', 'FAILED_LOGIN', 'GEO_FENCE_VIOLATION'
        required: true
    },
    module: {
        type: String, // 'ATTENDANCE', 'AUTH', 'ADMIN'
        required: true
    },
    details: mongoose.Schema.Types.Mixed,
    severity: {
        type: String,
        enum: ['INFO', 'WARNING', 'CRITICAL'],
        default: 'INFO'
    },
    ipAddress: String,
    deviceFingerprint: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SystemLog', SystemLogSchema);
