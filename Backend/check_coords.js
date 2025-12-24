const mongoose = require('mongoose');
const Opportunity = require('./models/Opportunity');
const dotenv = require('dotenv');

dotenv.config();

const checkCoordinates = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const opportunities = await Opportunity.find({});
        console.log(`Found ${opportunities.length} opportunities.`);

        opportunities.forEach(opp => {
            console.log(`Title: ${opp.title}`);
            console.log(`Location: ${opp.location}`);
            console.log(`Coordinates:`, JSON.stringify(opp.coordinates));
            console.log('---');
        });

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkCoordinates();
