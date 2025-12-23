const mongoose = require('mongoose');

const opportunitySchema = mongoose.Schema({
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    date: {
        type: String, // Can be Date type, but String for flexibility in this MVP validation
        required: true,
    },
    skillsRequired: [String],
    contactInfo: String,
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open',
    },
}, {
    timestamps: true,
});

const Opportunity = mongoose.model('Opportunity', opportunitySchema);
module.exports = Opportunity;
