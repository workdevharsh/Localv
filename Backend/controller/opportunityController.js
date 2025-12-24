const Opportunity = require('../models/Opportunity');

// @desc    Create a new opportunity
// @route   POST /api/opportunities
// @access  Private (Organization only)
const createOpportunity = async (req, res) => {
    const { title, description, location, date, skillsRequired, contactInfo, category } = req.body;

    try {
        let coordinates = { type: 'Point', coordinates: [0, 0] }; // Default

        // Attempt to geocode the location string
        if (location) {
            try {
                const axios = require('axios');
                const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                    params: {
                        q: location,
                        format: 'json',
                        limit: 1
                    },
                    headers: {
                        'User-Agent': 'VolunteerConnectApp/1.0' // Required by Nominatim
                    }
                });

                if (response.data && response.data.length > 0) {
                    const { lat, lon } = response.data[0];
                    coordinates.coordinates = [parseFloat(lon), parseFloat(lat)];
                }
            } catch (geoError) {
                console.error('Geocoding error:', geoError.message);
                // Continue without coordinates if geocoding fails
            }
        }

        const opportunity = new Opportunity({
            organization: req.user._id,
            title,
            description,
            location,
            coordinates,
            category: category || 'Other',
            date,
            skillsRequired,
            contactInfo,
        });

        const createdOpportunity = await opportunity.save();
        res.status(201).json(createdOpportunity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all opportunities
// @route   GET /api/opportunities
// @access  Public
const getOpportunities = async (req, res) => {
    try {
        const opportunities = await Opportunity.find().populate('organization', 'name organizationName');
        res.json(opportunities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get opportunity by ID
// @route   GET /api/opportunities/:id
// @access  Public
const getOpportunityById = async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id).populate('organization', 'name organizationName');
        if (opportunity) {
            res.json(opportunity);
        } else {
            res.status(404).json({ message: 'Opportunity not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update opportunity
// @route   PUT /api/opportunities/:id
// @access  Private (Organization only)
// @desc    Update opportunity
// @route   PUT /api/opportunities/:id
// @access  Private (Organization only)
const updateOpportunity = async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);

        if (opportunity) {
            if (opportunity.organization.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to update this opportunity' });
            }

            // Check if location changed to re-geocode
            if (req.body.location && req.body.location !== opportunity.location) {
                try {
                    const axios = require('axios');
                    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                        params: {
                            q: req.body.location,
                            format: 'json',
                            limit: 1
                        },
                        headers: {
                            'User-Agent': 'VolunteerConnectApp/1.0'
                        }
                    });

                    if (response.data && response.data.length > 0) {
                        const { lat, lon } = response.data[0];
                        opportunity.coordinates = { type: 'Point', coordinates: [parseFloat(lon), parseFloat(lat)] };
                    }
                } catch (geoError) {
                    console.error('Geocoding error:', geoError.message);
                }
            }

            opportunity.title = req.body.title || opportunity.title;
            opportunity.description = req.body.description || opportunity.description;
            opportunity.location = req.body.location || opportunity.location;
            opportunity.category = req.body.category || opportunity.category;
            opportunity.date = req.body.date || opportunity.date;
            opportunity.skillsRequired = req.body.skillsRequired || opportunity.skillsRequired;
            opportunity.contactInfo = req.body.contactInfo || opportunity.contactInfo;
            opportunity.status = req.body.status || opportunity.status;

            const updatedOpportunity = await opportunity.save();
            res.json(updatedOpportunity);
        } else {
            res.status(404).json({ message: 'Opportunity not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete opportunity
// @route   DELETE /api/opportunities/:id
// @access  Private (Organization only)
const deleteOpportunity = async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);

        if (opportunity) {
            if (opportunity.organization.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to delete this opportunity' });
            }

            await opportunity.deleteOne();
            res.json({ message: 'Opportunity removed' });
        } else {
            res.status(404).json({ message: 'Opportunity not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOpportunity,
    getOpportunities,
    getOpportunityById,
    updateOpportunity,
    deleteOpportunity,
};
