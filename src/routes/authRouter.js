const express = require('express');
const passport = require('passport');

const router = express.Router();

// Auth with Google
// Using the Google Strategy created in passport.js
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// Google auth callback
router.get('/google/callback', passport.authenticate('google', { successRedirect: `${process.env.CLIENT_URL}`, failureRedirect: `${process.env.CLIENT_URL}` }));


router.get('/login/success', (req, res) => {
    if (req.user) {
        res.json({
         message: 'User Authenticated',
         user: req.user
       });
    } else 
        res.status(400).json({
        message: 'User Not Authenticated',
        user: null
    });
 });

// Logout user
// passport middleware provides a logout method within the request object once we log in
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
