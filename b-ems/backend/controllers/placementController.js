const Student = require('../models/Student');
const Company = require('../models/Company');

// @desc    Get placement overview stats
// @route   GET /api/placement/stats
// @access  Private (Placement Officer/CEO/Manager)
exports.getStats = async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const eligibleStudents = await Student.countDocuments({ isEligible: true });
        const placedStudents = await Student.countDocuments({ placementStatus: 'PLACED' });
        const totalCompanies = await Company.countDocuments({ status: 'ACTIVE' });

        res.status(200).json({
            success: true,
            data: {
                totalStudents,
                eligibleStudents,
                placedStudents,
                totalCompanies,
                avgPackage: '8.5 LPA' // Mock stat
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get all eligible students
// @route   GET /api/placement/students
// @access  Private
exports.getStudents = async (req, res) => {
    try {
        const students = await Student.find({ isEligible: true });
        res.status(200).json({ success: true, count: students.length, data: students });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get all hiring companies
// @route   GET /api/placement/companies
// @access  Private
exports.getCompanies = async (req, res) => {
    try {
        const companies = await Company.find({ status: 'ACTIVE' });
        res.status(200).json({ success: true, count: companies.length, data: companies });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
