const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');
// const sendEmail = require('../utils/sendEmail');

// @desc    Apply for an opportunity
// @route   POST /api/applications
// @access  Private (Volunteer only)
const applyForOpportunity = async (req, res) => {
    const { opportunityId, notes } = req.body;

    try {
        const opportunity = await Opportunity.findById(opportunityId);

        if (!opportunity) {
            return res.status(404).json({ message: 'Opportunity not found' });
        }

        const alreadyApplied = await Application.findOne({
            volunteer: req.user._id,
            opportunity: opportunityId,
        });

        if (alreadyApplied) {
            return res.status(400).json({ message: 'You have already applied for this opportunity' });
        }

        const application = await Application.create({
            volunteer: req.user._id,
            opportunity: opportunityId,
            notes,
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get volunteer applications
// @route   GET /api/applications/my
// @access  Private (Volunteer only)
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ volunteer: req.user._id })
            .populate('opportunity', 'title organization location date status')
            .populate({
                path: 'opportunity',
                populate: {
                    path: 'organization',
                    select: 'name organizationName'
                }
            });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get applications for an opportunity (for Organization)
// @route   GET /api/applications/opportunity/:id
// @access  Private (Organization only)
const getOpportunityApplications = async (req, res) => {
    try {
        // Verify the opportunity belongs to this org
        const opportunity = await Opportunity.findById(req.params.id);
        if (!opportunity) {
            return res.status(404).json({ message: 'Opportunity not found' });
        }
        if (opportunity.organization.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to view these applications' });
        }

        const applications = await Application.find({ opportunity: req.params.id })
            .populate('volunteer', 'name email skills location');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Organization only)
const updateApplicationStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const application = await Application.findById(req.params.id).populate('opportunity');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Verify org owns the opportunity
        if (application.opportunity.organization.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this application' });
        }

        application.status = status;
        await application.save();

        if (status === 'accepted') {
            try {
                await sendEmail({
                    email: application.volunteer.email || 'volunteer@example.com', // fallback if email populating fails or schema issue
                    subject: 'Application Accepted!',
                    message: `Congratulations! Your application for "${application.opportunity.title}" has been accepted.`,
                });
            } catch (emailError) {
                console.error('Email send failed:', emailError);
                // Don't fail the request if email fails
            }
        }

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    applyForOpportunity,
    getMyApplications,
    getOpportunityApplications,
    updateApplicationStatus,
};
