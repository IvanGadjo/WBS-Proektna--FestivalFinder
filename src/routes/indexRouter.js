const express = require('express');
const debug = require('debug')('app:indexRouter');

const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const usersController = require('../controllers/usersController');




const { getUserById } = usersController();


router.get('/fetchUser', ensureAuth, async (req, res) => {
    try {
        getUserById(req, res);
    } catch (err) {
        debug(err);
    }
});

module.exports = router;
