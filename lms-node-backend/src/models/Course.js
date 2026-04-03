const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: [true, 'Please add a course title'], trim: true },
    tech: { type: String, required: true },
    duration: String,
    description: String,
    price: { type: Number, required: true },
    image: String,
    tags: [String],
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    mentor: String,
    modules: [String],
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', CourseSchema);
