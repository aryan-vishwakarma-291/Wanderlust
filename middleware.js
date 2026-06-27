const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError"); // Custom error class
const { listingSchema } = require('./schema');

module.exports.isLoggedIn = (req, res, next) => { // Middleware to check if user is logged in
  if (!req.isAuthenticated()) { // If user is not authenticated
    req.session.redirectUrl = req.originalUrl;
    req.flash('error', 'You must be signed in first!'); // Flash error message
    return res.redirect('/login'); // Redirect to login page
    } 
    next(); // If user is authenticated, proceed to the next middleware or route handle
}

module.exports.saveRedirectUrl = (req,res,next) => {
  if(req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = async (req,res,next) => {
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error" , "You are not the Owner of this Listing");
    return res.redirect(`/listings/${id}`); 
  }
  next()
}

module.exports.validateListing = (req, res, next) => { // Middleware to validate listing data using Joi
   let {error} = listingSchema.validate(req.body);
  if(error) {
    let errMsg = error.details.map(el => el.message).join(","); // Create error message from Joi validation errors
    throw new ExpressError(400 ,errMsg); 
  } else{
    next();
  } 
}