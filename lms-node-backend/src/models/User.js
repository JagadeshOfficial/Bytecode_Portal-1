const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, trim: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['SUPER_ADMIN', 'ADMIN', 'EMPLOYEE', 'STUDENT'], default: 'STUDENT' },
    branch: String,
    department: String,
    userStatus: { type: String, default: 'Present' },
    phoneNumber: String,
    profileImage: String,
    active: { type: Boolean, default: true },
    salary: Number,
    attendanceRate: { type: Number, default: 0 },
    leavesTotal: { type: Number, default: 0 },
    leavesAccepted: { type: Number, default: 0 },
    leavesRejected: { type: Number, default: 0 },
    leaveHistory: [String],
    requirementRequests: [String],
    createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
});

// Method to compare passwords
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
