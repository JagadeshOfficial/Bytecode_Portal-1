const express = require('express');
const router = express.Router();
const { getStats, getStudents, getCompanies } = require('../controllers/placementController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/stats', authorize('CEO', 'PLACEMENT_OFFICER'), getStats);
router.get('/students', authorize('PLACEMENT_OFFICER'), getStudents);
router.get('/companies', authorize('PLACEMENT_OFFICER'), getCompanies);

module.exports = router;
