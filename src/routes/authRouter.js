const express = require('express');
const passport = require('passport');

const router = express.Router();

// auth with google
// GET /auth/google
// using the google strategy created in passport.js
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/');
    });
