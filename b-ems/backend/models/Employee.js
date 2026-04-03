const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    employeeId: {
        type: String,
        required: true,
        unique: true
    },
    performanceScore: {
        type: Number,
        default: 0
    },
    conversionRate: {
        type: Number,
        default: 0
    },
    totalLeadsAssigned: {
        type: Number,
        default: 0
    },
    totalConversions: {
        type: Number,
        default: 0
    },
    attendance: [{
        date: { type: Date, default: Date.now },
        status: { type: String, enum: ['PRESENT', 'ABSENT', 'LATE', 'LEAVE'], default: 'PRESENT' }
    }],
    leaves: [{
        startDate: Date,
        endDate: Date,
        type: { type: String, enum: ['SICK', 'CASUAL', 'EARNED'], default: 'CASUAL' },
        reason: String,
        status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' }
    }],
    joiningDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Employee', EmployeeSchema);
