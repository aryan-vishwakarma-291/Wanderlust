const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => { // Signup form route
    res.render("users/signup.ejs"); // Render signup form
}

module.exports.signup = async (req, res) => { // Signup form submission route
    try {  let { username, email, password } = req.body; // Extract form data
    const newUser = new User({ username, email }); // Create new user instance
    const registeredUser = await User.register(newUser, password); // Register user with password
    // console.log(registeredUser); // Log registered user'
    req.login(registeredUser , (err) => {
        if(err) {
            return next(err);
        }
        req.flash('success', 'Welcome to Wanderlust!'); // Flash success message
        res.redirect('/listings'); // Redirect to listings page
        });
   
    } catch (e) {
        req.flash('error', e.message); // Flash error message if registration fails
        res.redirect('/signup'); // Redirect back to signup form
    }  
}

module.exports.rederLoginForm =  (req, res) => { // Login form route
    res.render("users/login.ejs"); // Render login form
}

module.exports.login = async (req, res) => {
        req.flash('success', 'Welcome back!'); // Flash success message on successful login
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl) // Redirect to listings page
    }
module.exports.logout = (req,res,next) => {
    req.logOut((err) => {
        if(err) {
            return next(err);
        }
    req.flash("success" , "You are logged Out")
    res.redirect("/listings");
    })
}