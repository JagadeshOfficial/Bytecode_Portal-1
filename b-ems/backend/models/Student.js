const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    course: String,
    batch: String,
    cgpa: Number,
    isEligible: { type: Boolean, default: true },
    placementStatus: { type: String, enum: ['UNPLACED', 'PLACED', 'PENDING'], default: 'UNPLACED' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', StudentSchema);
