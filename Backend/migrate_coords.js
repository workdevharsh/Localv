const mongoose = require('mongoose');
const Opportunity = require('./models/Opportunity');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const migrateCoordinates = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const opportunities = await Opportunity.find({});
        console.log(`Found ${opportunities.length} opportunities to check.`);

        for (const opp of opportunities) {
            // Check if coordinates are missing or default [0,0]
            const hasCoords = opp.coordinates &&
                opp.coordinates.coordinates &&
                (opp.coordinates.coordinates[0] !== 0 || opp.coordinates.coordinates[1] !== 0);

            if (!hasCoords && opp.location) {
                console.log(`Geocoding: ${opp.title} (${opp.location})...`);

                try {
                    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                        params: {
                            q: opp.location,
                            format: 'json',
                            limit: 1
                        },
                        headers: {
                            'User-Agent': 'VolunteerConnectApp/1.0'
                        }
                    });

                    await delay(1000); // Respect Nominatim rate limit (1 req/sec)

                    if (response.data && response.data.length > 0) {
                        const { lat, lon } = response.data[0];
                        opp.coordinates = {
                            type: 'Point',
                            coordinates: [parseFloat(lon), parseFloat(lat)]
                        };

                        // Also set a default category if missing
                        if (!opp.category) opp.category = 'Other';

                        await opp.save();
                        console.log(`Updated: ${opp.title} -> [${lon}, ${lat}]`);
                    } else {
                        console.log(`Could not find coordinates for: ${opp.location}`);
                    }
                } catch (err) {
                    console.error(`Error geocoding ${opp.title}:`, err.message);
                }
            } else {
                console.log(`Skipping: ${opp.title} (already has coords or no location)`);
            }
        }

        console.log('Migration completed.');
        process.exit();
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateCoordinates();
