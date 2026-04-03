const Campaign = require('../models/Campaign');
const Lead = require('../models/Lead');

// @desc    Get all campaigns with performance stats
// @route   GET /api/campaigns
// @access  Private (Marketing/CEO/Manager)
exports.getCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find();
        
        // Enrich with real-time lead counts from Lead model
        const enrichedCampaigns = await Promise.all(campaigns.map(async (camp) => {
            const leadCount = await Lead.countDocuments({ source: camp.source });
            const conversionCount = await Lead.countDocuments({ source: camp.source, status: 'CONVERTED' });
            
            return {
                ...camp._doc,
                leadCount,
                conversionCount,
                roi: camp.spent > 0 ? (conversionCount * 500 / camp.spent).toFixed(1) : 0 // Mock ROI calculation
            };
        }));

        res.status(200).json({ success: true, count: enrichedCampaigns.length, data: enrichedCampaigns });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Create new campaign
// @route   POST /api/campaigns
// @access  Private (Marketing Lead/Manager)
exports.createCampaign = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;
        const campaign = await Campaign.create(req.body);
        res.status(201).json({ success: true, data: campaign });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
