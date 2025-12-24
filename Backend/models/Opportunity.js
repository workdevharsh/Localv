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
        type: String, // Keep the string address
        required: true,
    },
    coordinates: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere',
        },
    },
    category: {
        type: String,
        enum: ['Education', 'Health', 'Environment', 'Community', 'Other'],
        default: 'Other',
        required: true,
    },
    date: {
        type: String,
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
