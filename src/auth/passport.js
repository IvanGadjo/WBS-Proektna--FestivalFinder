const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/user');

// eslint-disable-next-line func-names
module.exports = function (passport) {
    passport.use(
        new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback'  
        },
    async (accessToken, refreshToken, profile, done) => {
        // eslint-disable-next-line no-console
        console.log(profile);
    })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
         User.findById(id, (err, user) => done(err, user));
    });

};
