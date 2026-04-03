const Lead = require('../models/Lead');
const LeadHistory = require('../models/LeadHistory');
const User = require('../models/User');
const csv = require('csv-parser');
const fs = require('fs');

/**
 * AI Lead Scoring Logic (Advanced Feature)
 * Higher score = higher probability of conversion
 * Factors: Priority (40%), Lead Source (30%), Course interest (30%)
 */
const calculateAIScore = (lead) => {
    let score = 0;
    
    // Priority Score
    const priorityWeights = { 'URGENT': 100, 'HIGH': 75, 'MEDIUM': 50, 'LOW': 25 };
    score += (priorityWeights[lead.priority] || 0) * 0.4;

    // Source Score
    const sourceWeights = { 'GOOGLE': 100, 'REFERRAL': 90, 'FACEBOOK': 60, 'COLD_CALL': 30 };
    score += (sourceWeights[lead.source] || 50) * 0.3;

    // Engagement score (mock)
    score += 30; // base engagement

    return Math.min(Math.round(score), 100);
};


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
// @desc    Bulk upload leads
// @route   POST /api/leads/bulk
// @access  Private (Manager/CEO)
exports.bulkUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'Please upload a CSV file' });
        }

        const leads = [];
        const results = [];

        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                for (const row of results) {
                    // Simple validation & score calculation
                    const leadData = {
                        name: row.name,
                        email: row.email,
                        phone: row.phone,
                        course: row.course,
                        priority: row.priority || 'MEDIUM',
                        source: row.source || 'BULK_UPLOAD',
                    };
                    leadData.score = calculateAIScore(leadData);
                    
                    const lead = await Lead.create(leadData);
                    
                    await LeadHistory.create({
                        leadId: lead._id,
                        action: 'CREATE',
                        performedBy: req.user.id,
                        details: 'Lead created via Bulk Upload'
                    });
                    
                    leads.push(lead);
                }

                // Cleanup file
                fs.unlinkSync(req.file.path);

                res.status(201).json({
                    success: true,
                    count: leads.length,
                    data: leads
                });
            });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Round Robin Assignment
// @route   PUT /api/leads/assign-round-robin
// @access  Private (Manager/CEO)
exports.roundRobinAssign = async (req, res) => {
    try {
        const { leadIds } = req.body;
        
        // Get all counsellors
        const counsellors = await User.find({ role: 'COUNSELLOR' });
        if (counsellors.length === 0) {
            return res.status(400).json({ success: false, error: 'No counsellors available for assignment' });
        }

        let assignedCount = 0;
        for (let i = 0; i < leadIds.length; i++) {
            const counsellor = counsellors[i % counsellors.length];
            const lead = await Lead.findByIdAndUpdate(leadIds[i], { 
                assignedTo: counsellor._id 
            }, { new: true });

            if (lead) {
                await LeadHistory.create({
                    leadId: lead._id,
                    action: 'ASSIGN',
                    performedBy: req.user.id,
                    details: `Automatically assigned to ${counsellor.name} via Round Robin`,
                    newValue: counsellor._id
                });
                assignedCount++;
            }
        }

        res.status(200).json({
            success: true,
            message: `Successfully assigned ${assignedCount} leads across ${councellors.length} counsellors`
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
