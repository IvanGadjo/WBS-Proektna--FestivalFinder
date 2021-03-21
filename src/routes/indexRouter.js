const express = require('express');

const router = express.Router();
const { ensureAuth } = require('../middleware/auth');

const User = require('../models/User');

router.get('/fetchUser', ensureAuth, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id).exec();
        res.json(currentUser);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
    }
});

module.exports = router;
