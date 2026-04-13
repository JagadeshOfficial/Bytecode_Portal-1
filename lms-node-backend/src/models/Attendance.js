const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    batch: {
        type: String, // Can be Batch ID or Course ID
        required: true
    },
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    trainerStatus: {
        type: String,
        enum: ['PRESENT', 'ABSENT', 'ON_LEAVE'],
        default: 'PRESENT'
    },
    records: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED', 'SUSPICIOUS'],
            default: 'PRESENT'
        },
        loginTime: Date,
        logoutTime: Date,
        deviceInfo: {
            name: String,
            os: String,
            browser: String,
            fingerprint: String
        },
        ipAddress: String,
        location: {
            city: String,
            state: String,
            coordinates: [Number] // [lat, lng]
        },
        isVpnDetected: { type: Boolean, default: false },
        isMultipleDevice: { type: Boolean, default: false },
        remark: String
    }],
    sessionType: {
        type: String,
        enum: ['LECTURE', 'PRACTICAL', 'EXAM', 'WORKSHOP'],
        default: 'LECTURE'
    },
    sessionTopic: String,
    geoFenceEnabled: { type: Boolean, default: false },
    qrActive: { type: Boolean, default: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
