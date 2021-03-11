const express = require('express');
const usersController = require('../controllers/usersController');

const usersRouter = express.Router();

function router() {
    const { searchFestivals } = usersController();
    usersRouter.route('/searchFestivals').get(searchFestivals);

    return usersRouter;
}

module.exports = router;
