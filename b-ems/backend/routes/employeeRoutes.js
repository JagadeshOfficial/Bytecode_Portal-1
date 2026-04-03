const express = require('express');
const router = express.Router();
const { getEmployees, getPerformance, markAttendance } = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', authorize('CEO', 'MANAGER'), getEmployees);
router.get('/performance', authorize('CEO', 'MANAGER'), getPerformance);
router.post('/:id/attendance', markAttendance);

module.exports = router;
