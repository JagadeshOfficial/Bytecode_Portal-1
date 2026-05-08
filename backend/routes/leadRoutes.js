const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
    getLeads, 
    getLead, 
    createLead, 
    updateLeadStatus, 
    assignLead, 
    getLeadHistory,
    bulkUpload,
    roundRobinAssign
} = require('../controllers/leadController');
const { protect, authorize } = require('../middleware/auth');

// Multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.use(protect);

router.get('/', getLeads);
router.post('/', createLead);
router.get('/:id', getLead);
router.put('/:id/status', updateLeadStatus);
router.put('/:id/assign', authorize('CEO', 'MANAGER', 'COUNSELLOR_LEAD'), assignLead);
router.get('/:id/history', getLeadHistory);

// Enterprise Operations
router.post('/bulk', authorize('CEO', 'MANAGER'), upload.single('file'), bulkUpload);
router.put('/assign-round-robin', authorize('CEO', 'MANAGER'), roundRobinAssign);

module.exports = router;

