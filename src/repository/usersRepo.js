const mongoose = require('mongoose');
const debug = require('debug')('app:mongoose');
const User = require('../models/User');
const Festival = require('../models/Festival');

const getUserById = async (req) => {

    // this works only if the user is logged in
    const { id } = req.user;
    try {
        const res = await User.findById(id).exec();
        return res;
    } catch (error) {
        debug(error);
        return `Cannot with user with id:${id}`;
    }
};

const addFestivaltoUser = async (req) => {
    // ! Tuka e frkata, treba schemata da se smeni za da prima niza od websites, locations, dates, genres
    debug(req.body);

    const { name, date, website, image, genre, location } = req.body;
    const newFestival = new Festival({
        name,
        date,
        website,
        image,
        genre,
        location  
    });
    const { id } = req.params;
    const objectId = mongoose.Types.ObjectId(id);
    try {
        const currentUser = await User.findById(id).exec();
        currentUser.festivals.push(newFestival);
        const res = await User.findByIdAndUpdate(objectId, currentUser, { new: true }).exec();
        return res;
    } catch (error) {
        debug(error);
        return `cannot add the festival to the user with id:${id}`;
    }
};

const getFestivalsFromUser = async (req) => {

    const { id } = req.user;
    try {
        const user = await User.findById(id).exec();
        return user.festivals;
    } catch (error) {
        debug(error);
        return `Cannot with user with id:${id}`;
    }
};

const removeFestivalFromUser = async (req) => {
    const { id } = req.params;
    const { festivalId } = req.body;
    const objectId = mongoose.Types.ObjectId(id);
    try {
        const currentUser = await User.findById(id).exec();
        debug(currentUser);
        const index = currentUser.festivals.map(f => f.id).indexOf(festivalId);
        debug(index);
        currentUser.festivals.splice(index, 1);
        debug(currentUser);
        const res = await User.findByIdAndUpdate(objectId, currentUser, { new: true }).exec();
        return res;
    } catch (error) {
        debug(error);
        return `Cannot delete festival with the id:${id}`;
    }
};

module.exports.getUserById = getUserById;
module.exports.addFestivaltoUser = addFestivaltoUser;
module.exports.removeFestivalFromUser = removeFestivalFromUser;
module.exports.getFestivalsFromUser = getFestivalsFromUser;
