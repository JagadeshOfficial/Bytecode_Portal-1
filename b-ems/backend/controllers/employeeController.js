const User = require('../models/User');
const Employee = require('../models/Employee');
const Lead = require('../models/Lead');

// @desc    Get all employees with their user details
// @route   GET /api/employees
// @access  Private (Manager/CEO)
exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().populate('userId', 'name email role');
        res.status(200).json({ success: true, count: employees.length, data: employees });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get employee performance stats
// @route   GET /api/employees/performance
// @access  Private (Manager/CEO)
exports.getPerformance = async (req, res) => {
    try {
        const employees = await Employee.find().populate('userId', 'name role');
        
        // Dynamic performance calculation (mock logic for demo)
        const performanceData = await Promise.all(employees.map(async (emp) => {
            const leadsCount = await Lead.countDocuments({ assignedTo: emp.userId });
            const convertedCount = await Lead.countDocuments({ assignedTo: emp.userId, status: 'CONVERTED' });
            
            const rate = leadsCount > 0 ? (convertedCount / leadsCount) * 100 : 0;
            
            return {
                id: emp._id,
                name: emp.userId.name,
                role: emp.userId.role,
                leads: leadsCount,
                conversions: convertedCount,
                rate: rate.toFixed(1),
                score: Math.min(Math.round(rate + (leadsCount * 0.5)), 100) // Productivity score
            };
        }));

        res.status(200).json({ success: true, data: performanceData });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Mark attendance
// @route   POST /api/employees/:id/attendance
// @access  Private
exports.markAttendance = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ success: false, error: 'Employee not found' });

        employee.attendance.push({
            date: new Date(),
            status: req.body.status || 'PRESENT'
        });

        await employee.save();
        res.status(200).json({ success: true, data: employee });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
