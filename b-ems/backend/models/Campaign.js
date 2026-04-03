const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a campaign name'],
        trim: true
    },
    source: {
        type: String,
        required: true,
        enum: ['FACEBOOK', 'INSTAGRAM', 'GOOGLE', 'LINKEDIN', 'EMAIL', 'OTHER']
    },
    status: {
        type: String,
        enum: ['LIVE', 'PAUSED', 'COMPLETED', 'DRAFT'],
        default: 'DRAFT'
    },
    budget: {
        type: Number,
        default: 0
    },
    spent: {
        type: Number,
        default: 0
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Campaign', CampaignSchema);
