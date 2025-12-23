const mongoose = require('mongoose');

const applicationSchema = mongoose.Schema({
    volunteer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    opportunity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Opportunity',
        required: true,
    },
    status: {
        type: String,
        enum: ['applied', 'accepted', 'rejected'],
        default: 'applied',
    },
    resume: String, // Link to resume or text
    notes: String,
}, {
    timestamps: true,
});

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
