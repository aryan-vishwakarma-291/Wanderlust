const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing');

main().then(() => { // Connect to MongoDB
    console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.log(err);
    });

async function main() { // MongoDB connection string
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async () => {
    await Listing.deleteMany({}); // Clear existing listings
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "6a2998539bdeb06e60b9543e",
    }));
    await Listing.insertMany(initData.data); // Insert sample listings
    console.log("Database initialized with sample listings.");
};

initDB();