const express = require('express');
const router = express.Router();
const { getLeads, getLead, createLead, updateLeadStatus, assignLead, getLeadHistory } = require('../controllers/leadController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getLeads);
router.post('/', createLead);
router.get('/:id', getLead);
router.put('/:id/status', updateLeadStatus);
router.put('/:id/assign', authorize('CEO', 'MANAGER', 'COUNSELLOR_LEAD'), assignLead);
router.get('/:id/history', getLeadHistory);

module.exports = router;
