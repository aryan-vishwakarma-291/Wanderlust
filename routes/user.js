const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Import User model
const wrapAsync = require("../utils/wrapAsync"); // Import wrapAsync utility for error handling
const passport = require("passport"); // Import Passport for authentication
const { saveRedirectUrl } = require('../middleware');
const userController = require('../controllers/users');
const user = require('../models/user');

router.route('/signup')
.get( userController.renderSignupForm )
.post( wrapAsync(userController.signup));

router.route('/login')
.get(userController.rederLoginForm)
.post( saveRedirectUrl, 
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), 
    // Authenticate user with Passport local strategy
    userController.login
); 

router.get('/logout' , userController.logout)

module.exports = router;