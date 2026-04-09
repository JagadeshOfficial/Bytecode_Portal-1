const FeeRecord = require('../models/FeeRecord');

// @desc    Get all fee records
// @route   GET /api/finance/fees
// @access  Private (Admin/Finance)
exports.getFeeRecords = async (req, res) => {
    try {
        const records = await FeeRecord.find();
        res.status(200).json(records);
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get student fee record
// @route   GET /api/finance/fees/my
// @access  Private (Student)
exports.getMyFees = async (req, res) => {
    try {
        const record = await FeeRecord.findOne({ studentEmail: req.user.email });
        if (!record) return res.status(404).json({ success: false, error: 'No fee record found' });
        res.status(200).json({ success: true, data: record });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Create fee record
// @route   POST /api/finance/fees
// @access  Private (Admin)
exports.createFeeRecord = async (req, res) => {
    try {
        const record = await FeeRecord.create(req.body);
        res.status(201).json({ success: true, data: record });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update payment status
// @route   PUT /api/finance/fees/:id
// @access  Private (Admin/Finance)
exports.updatePayment = async (req, res) => {
    try {
        const { paidAmount } = req.body;
        let record = await FeeRecord.findById(req.params.id);
        
        if (!record) return res.status(404).json({ success: false, error: 'Record not found' });

        record.paidAmount += paidAmount;
        record.balanceAmount = record.totalAmount - record.paidAmount;
        record.lastPaymentDate = Date.now();

        if (record.balanceAmount <= 0) {
            record.status = 'PAID';
        } else if (record.paidAmount > 0) {
            record.status = 'PARTIAL';
        }

        await record.save();
        res.status(200).json({ success: true, data: record });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
