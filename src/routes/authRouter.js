const express = require('express');
const passport = require('passport');

const router = express.Router();

// Auth with Google
// Using the Google Strategy created in passport.js
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// Google auth callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/');
    });

// Logout user
// passport middleware provides a logout method within the request object once we log in
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
