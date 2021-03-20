const express = require('express');
const usersController = require('../controllers/usersController');

const usersRouter = express.Router();

function router() {
    const { addFestivalToUser, removeFestivalFromUser, searchFestivals, } = usersController();
    usersRouter.route('/searchFestivals/:country/:genre').get(searchFestivals);
    usersRouter.route('/addFestival/:id').patch(addFestivalToUser);
    usersRouter.route('/removeFestival/:id').patch(removeFestivalFromUser);

    return usersRouter;
}

module.exports = router;
