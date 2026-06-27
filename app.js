if(process.env.NODE_ENV != "production") {
  require('dotenv').config();
}

const express = require('express'); // Import Express
const app = express(); // Create Express app
const mongoose = require('mongoose'); // Import Mongoose
const Listing = require('./models/listing'); // Import Listing model
const path = require('path'); // Import path module
const { url } = require('inspector'); // Import url module
const methodoverride = require('method-override'); // Import method-override
const ejsMate = require('ejs-mate'); // Import ejs-mate for layouts
const wrapAsync = require("./utils/wrapAsync") //
const ExpressError = require("./utils/ExpressError"); // Custom error class
const { listingSchema } = require('./schema'); // Import Joi schema for validation
const listingRouter = require("./routes/listing"); // Import listing router
const userRouter = require("./routes/user"); // Import user router
const dbUrl = process.env.ATLASDB_URL;
const session = require("express-session"); // Import express-session for session management
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash"); // Import connect-flash for flash messages
const passport = require("passport"); // Import Passport for authentication
const LocalStrategy = require("passport-local"); // Import Passport-Local strategy
const User = require("./models/user"); // Import User model
main().then(() => { // Connect to MongoDB
    console.log("Connected to MongoDB");
    })  
    .catch(err => {
        console.log(err);
    });

app.set('view engine', 'ejs'); // Set EJS as templating engine
app.set('views', path.join(__dirname, 'views')); // Set views directory
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(methodoverride('_method')); // Middleware to support PUT and DELETE methods
app.engine('ejs', ejsMate); // Use ejs-mate for EJS templates
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});
store.on("error" , () => {
  console.log("ERROR in mongo Session store" ,err);
});
app.use(session({ // Configure session middleware
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false ,maxAge:7 * 24 * 60 * 60 * 1000} // Set secure to false for development and maxAge to 10 seconds for testing
})); // Configure session middleware



app.use(flash()); // Use flash middleware
app.use(passport.initialize()); // Initialize Passport
app.use(passport.session()); // Use Passport session middleware 
passport.use(new LocalStrategy(User.authenticate())); // Configure Passport to use local strategy with User model
passport.serializeUser(User.serializeUser()); // Configure Passport to serialize user
passport.deserializeUser(User.deserializeUser()); // Configure Passport to deserialize user

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});
app.use(listingRouter); // Use the imported listing router
app.use(userRouter); // Use the imported user router

async function main() { // MongoDB connection string
  await mongoose.connect(dbUrl);
}



const validateListing = (req, res, next) => { // Middleware to validate listing data using Joi
   let {error} = listingSchema.validate(req.body);
  if(error) {
    let errMsg = error.details.map(el => el.message).join(","); // Create error message from Joi validation errors
    throw new ExpressError(400 ,errMsg); 
  } else{
    next();
  } 
}


app.get('/test' , (req, res) => { // Test route
  req.session.test ? req.session.test++ : req.session.test = 1; // Increment test session variable
  res.send(`Test session value: ${req.session.test}`); // Send test session value in response
});

app.all( "*any", (req,res,next) => {
  next(new ExpressError(404,"Page Not Found!"))
});

app.use((err,req,res,next) => {
  let {statusCode = 500 , message = "something went wrong"} = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs" , {message});
}); 

app.listen(8080, () => { // Start server
  console.log('Server is running on port 8080');
});