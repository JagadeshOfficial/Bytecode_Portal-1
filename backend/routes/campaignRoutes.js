const express = require('express');
const router = express.Router();
const { getCampaigns, createCampaign } = require('../controllers/campaignController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', authorize('CEO', 'MANAGER', 'MARKETING_LEAD', 'MARKETING_EMPLOYEE'), getCampaigns);
router.post('/', authorize('CEO', 'MANAGER', 'MARKETING_LEAD'), createCampaign);

module.exports = router;
