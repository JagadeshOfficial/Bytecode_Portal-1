const mongoose = require('mongoose');

const PayoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: String,
    month: {
        type: String,
        required: true // e.g. "April 2026"
    },
    grossAmount: {
        type: Number,
        required: true
    },
    deductions: {
        type: Number,
        default: 0
    },
    netAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['PAID', 'PENDING', 'PROCESSING', 'FAILED'],
        default: 'PAID'
    },
    payoutDate: {
        type: Date,
        default: Date.now
    },
    transactionId: String,
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Payout', PayoutSchema);
