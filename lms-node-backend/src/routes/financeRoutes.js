const express = require('express');
const router = express.Router();
const { 
    getFeeRecords, 
    getMyFees, 
    createFeeRecord, 
    updatePayment 
} = require('../controllers/financeController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/fees', authorize('ADMIN', 'SUPER_ADMIN', 'FINANCE'), getFeeRecords);
router.get('/fees/my', authorize('STUDENT'), getMyFees);
router.post('/fees', authorize('ADMIN', 'SUPER_ADMIN'), createFeeRecord);
router.put('/fees/:id', authorize('ADMIN', 'SUPER_ADMIN', 'FINANCE'), updatePayment);

module.exports = router;
