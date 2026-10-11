// Bring in the DB connection and the Trip schema 
const mongoose = require('./db');
const Trip = mongoose.model('trips');  

// Read seed data from the JSON file
var fs = require('fs');
var trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));

// delete any existing recors, then insert the seed data
const seedDB = async () => {
    await Trip.deleteMany({});
    await Trip.insertMany(trips);
};

//Close the mongoDB connection and exit
seedDB().then(async () => {
    await mongoose.connection.close();
    process.exit(0);
});
