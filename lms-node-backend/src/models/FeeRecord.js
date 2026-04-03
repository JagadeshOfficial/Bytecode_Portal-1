const mongoose = require('mongoose');

const FeeRecordSchema = new mongoose.Schema({
    studentEmail: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    balanceAmount: { type: Number, required: true },
    status: { type: String, enum: ['PAID', 'PARTIAL', 'PENDING'], default: 'PENDING' },
    lastPaymentDate: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FeeRecord', FeeRecordSchema);
