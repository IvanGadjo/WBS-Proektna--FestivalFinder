const express = require('express');
const passport = require('passport');

const router = express.Router();

// auth with google
// GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

