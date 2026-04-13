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
            enum: ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'],
            default: 'PRESENT'
        },
        remark: String
    }],
    sessionType: {
        type: String,
        enum: ['LECTURE', 'PRACTICAL', 'EXAM', 'WORKSHOP'],
        default: 'LECTURE'
    },
    sessionTopic: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
