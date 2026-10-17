const mongoose = require('mongoose');
const Trip = require('../models/db').model('trips'); // register model
const Model = mongoose.model('trips');

// GET: /trips - lists all the trips
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsList = async (req, res) => {
    try {
        const q = await Model
            .find({}) // No filter, return all records
            .exec();

        // Uncomment the following line to show the result of query
        // on the console
        // console.log(q);

        if (!q || q.length === 0) { // Database returned no data
            return res
                .status(404)
                .json({ message: 'No trips found' });
        } else { // Return resulting trip list
            return res
                .status(200)
                .json(q);
        }
    } catch (err) { // Database or query error
        return res
            .status(500)
            .json(err);
    }
};

// GET: /trips/:tripCode - returns a single trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsFindByCode = async (req, res) => {
    try {
        const q = await Model
            .find({ 'code': req.params.tripCode }) // Return the trip matching the code
            .exec();

        if (!q || q.length === 0) { // Database returned no data
            return res
                .status(404)
                .json({ message: 'Trip not found' });
        } else { // Return the matching trip
            return res
                .status(200)
                .json(q);
        }
    } catch (err) { // Database or query error
        return res
            .status(500)
            .json(err);
    }
};

// POST: /trips - Adds a new Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsAddTrip = async (req, res) => {
    try {
        const newTrip = new Trip({
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description
        });

        const q = await newTrip.save();

        // Return the new trip
        return res
            .status(201)
            .json(q);
    } catch (err) { // Validation or database error
        return res
            .status(400)
            .json(err);
    }
};

// PUT: /trips/:tripCode - Updates a Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsUpdateTrip = async (req, res) => {
    try {
        const q = await Model
            .findOneAndUpdate(
                { 'code': req.params.tripCode },
                {
                    code: req.body.code,
                    name: req.body.name,
                    length: req.body.length,
                    start: req.body.start,
                    resort: req.body.resort,
                    perPerson: req.body.perPerson,
                    image: req.body.image,
                    description: req.body.description
                },
                { new: true } // Return the updated document
            )
            .exec();

        if (!q) { // Database returned no data
            return res
                .status(404)
                .json({ message: 'Trip not found' });
        } else { // Return resulting updated trip
            return res
                .status(201)
                .json(q);
        }
    } catch (err) { // Validation or database error
        return res
            .status(400)
            .json(err);
    }
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip
};