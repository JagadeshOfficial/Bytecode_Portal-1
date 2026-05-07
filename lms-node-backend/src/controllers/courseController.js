const mongoose = require('mongoose');
const Course = require('../models/Course');

exports.getCourses = async (req, res) => {
    try {
        const db = mongoose.connection.useDb('course-db');
        const courses = await db.collection('courses').find().toArray();
        const mappedCourses = courses.map(c => ({
            ...c,
            id: c._id.toString()
        }));
        res.status(200).json(mappedCourses);
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res) => {
    try {
        const db = mongoose.connection.useDb('course-db');
        const course = await db.collection('courses').findOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
        if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
        res.status(200).json({ success: true, data: { ...course, id: course._id.toString() } });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Admin)
exports.createCourse = async (req, res) => {
    try {
        const db = mongoose.connection.useDb('course-db');
        const result = await db.collection('courses').insertOne(req.body);
        res.status(201).json({ success: true, data: { ...req.body, id: result.insertedId.toString() } });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Admin)
exports.updateCourse = async (req, res) => {
    try {
        const db = mongoose.connection.useDb('course-db');
        const result = await db.collection('courses').findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(req.params.id) },
            { $set: req.body },
            { returnDocument: 'after' }
        );
        if (!result) return res.status(404).json({ success: false, error: 'Course not found' });
        res.status(200).json({ success: true, data: { ...result, id: result._id.toString() } });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Admin)
exports.deleteCourse = async (req, res) => {
    try {
        const db = mongoose.connection.useDb('course-db');
        const result = await db.collection('courses').deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
        if (result.deletedCount === 0) return res.status(404).json({ success: false, error: 'Course not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
