const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Import Mongoose
const { url } = require('inspector'); // Import url module
const methodoverride = require('method-override'); // Import method-override
const ejsMate = require('ejs-mate'); // Import ejs-mate for layouts


const path = require('path'); // Import path module
const Listing = require('../models/listing');
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError"); // Custom error class
const { listingSchema } = require('../schema'); // Import Joi schema for validation
const {isLoggedIn, isOwner , validateListing} = require("../middleware"); // Import custom middleware to check if user is logged in
const listingController = require("../controllers/listings");
const multer  = require('multer') //requere multer
const {storage} = require("../cloudConfig")
const upload = multer({ storage }) //takes files from form and save it in uploads named folder




router.route('/listings')
//index route to get all listings
.get(wrapAsync(listingController.index)) 
// create route to add a new listing to the database
.post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));

//new listing route to create a new listing
router.get('/listings/new', isLoggedIn, listingController.renderNewForm);

router.route('/listings/:id')
// show route to get a specific listing by ID
.get( wrapAsync(listingController.showListing))
// update route to update a specific listing in the database
.put( isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
// delete route to delete a specific listing from the database
.delete( isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

 
// edit route to get the edit form for a specific listing
router.get('/listings/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router; 