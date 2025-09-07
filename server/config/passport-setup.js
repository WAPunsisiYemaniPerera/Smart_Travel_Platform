// server/config/passport-setup.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        // User details are retrieved from Google in the profile
        try {
           
            // Checks if a user with this googleId already exists in our database
            let user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                // If the user exists, log him in.
                return done(null, user);
            } else {
                // If the user does not exist, a new user is created
                const newUser = new User({
                    googleId: profile.id,
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    // Google login does not have a password, but our model requires a username
                });
                await newUser.save();
                return done(null, newUser);
            }
        } catch (error) {
            return done(error, null);
        }
    })
);