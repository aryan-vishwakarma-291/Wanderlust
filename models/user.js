const moongoose = require('mongoose');
const Schema = moongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default; // Import passport-local-mongoose plugin for user authentication

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});
// console.log(passportLocalMongoose); 
userSchema.plugin(passportLocalMongoose); // Add passport-local-mongoose plugin to user schema for authentication

module.exports = moongoose.model('User', userSchema); // Export User model based on user schema  