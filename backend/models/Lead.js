const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a lead name'],
        trim: true
    },
    email: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number']
    },
    course: {
        type: String,
        required: [true, 'Please specify the course']
    },
    location: {
        type: String,
        trim: true
    },
    priority: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
        default: 'MEDIUM'
    },
    status: {
        type: String,
        enum: ['NEW', 'CONTACTED', 'FOLLOW-UP', 'INTERESTED', 'DEMO', 'CONVERTED', 'LOST'],
        default: 'NEW'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    score: {
        type: Number,
        default: 0
    },
    source: {
        type: String,
        default: 'MANUAL'
    },
    notes: [String],
    lastContactDate: {
        type: Date
    },
    nextFollowupDate: {
        type: Date
    },
    isSpam: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Lead', LeadSchema);
