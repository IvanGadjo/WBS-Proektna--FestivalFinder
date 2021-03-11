const express = require('express');
const usersController = require('../controllers/usersController');

const usersRouter = express.Router();

function router() {
    const { createNewUser, addFestivalToUser, removeFestivalFromUser, searchFestivals, } = usersController();
    usersRouter.route('/searchFestivals').get(searchFestivals);
    usersRouter.route('/createNewUser').post(createNewUser);
    usersRouter.route('/addFestival').patch(addFestivalToUser);
    usersRouter.route('/removeFestival').patch(removeFestivalFromUser);

    return usersRouter;
}

module.exports = router;
