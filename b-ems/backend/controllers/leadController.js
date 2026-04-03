const Lead = require('../models/Lead');
const LeadHistory = require('../models/LeadHistory');
const User = require('../models/User');

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
exports.getLeads = async (req, res) => {
    try {
        let query;

        // Role-based filtering
        if (req.user.role === 'CEO' || req.user.role === 'MANAGER' || req.user.role === 'COUNSELLOR_LEAD') {
            query = Lead.find().populate('assignedTo', 'name email');
        } else {
            query = Lead.find({ assignedTo: req.user.id }).populate('assignedTo', 'name email');
        }

        const leads = await query;

        res.status(200).json({
            success: true,
            count: leads.length,
            data: leads
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
exports.getLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id).populate('assignedTo', 'name email');

        if (!lead) {
            return res.status(404).json({ success: false, error: 'Lead not found' });
        }

        // Check ownership if not admin/manager
        if (!['CEO', 'MANAGER', 'COUNSELLOR_LEAD'].includes(req.user.role) && lead.assignedTo.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to view this lead' });
        }

        res.status(200).json({ success: true, data: lead });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
exports.createLead = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;

        const lead = await Lead.create(req.body);

        // Track history
        await LeadHistory.create({
            leadId: lead._id,
            action: 'CREATE',
            performedBy: req.user.id,
            details: 'Lead created manually'
        });

        res.status(201).json({ success: true, data: lead });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update lead status
// @route   PUT /api/leads/:id/status
// @access  Private
exports.updateLeadStatus = async (req, res) => {
    try {
        let lead = await Lead.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({ success: false, error: 'Lead not found' });
        }

        const oldStatus = lead.status;
        lead.status = req.body.status;
        await lead.save();

        // Track history
        await LeadHistory.create({
            leadId: lead._id,
            action: 'UPDATE_STATUS',
            performedBy: req.user.id,
            details: `Status changed from ${oldStatus} to ${req.body.status}`,
            previousValue: oldStatus,
            newValue: req.body.status
        });

        res.status(200).json({ success: true, data: lead });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Assign lead
// @route   PUT /api/leads/:id/assign
// @access  Private (Manager/Lead)
exports.assignLead = async (req, res) => {
    try {
        let lead = await Lead.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({ success: false, error: 'Lead not found' });
        }

        const oldAssignee = lead.assignedTo;
        lead.assignedTo = req.body.userId;
        await lead.save();

        // Track history
        await LeadHistory.create({
            leadId: lead._id,
            action: 'ASSIGN',
            performedBy: req.user.id,
            details: `Lead assigned to User ${req.body.userId}`,
            previousValue: oldAssignee,
            newValue: req.body.userId
        });

        res.status(200).json({ success: true, data: lead });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get lead history
// @route   GET /api/leads/:id/history
// @access  Private
exports.getLeadHistory = async (req, res) => {
    try {
        const history = await LeadHistory.find({ leadId: req.params.id })
            .populate('performedBy', 'name role')
            .sort('-timestamp');

        res.status(200).json({ success: true, data: history });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
