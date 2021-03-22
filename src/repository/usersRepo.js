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
        const currentUser = await User.findById(id);
        currentUser.festivals.push(newFestival);
        const res = await User.findByIdAndUpdate(objectId, currentUser, { new: true }).exec();
        return res;
    } catch (error) {
        debug(error);
        return `cannot add the festival to the user with id:${id}`;
    }
};

const removeFestivalFromUser = async (req) => {
    const { id } = req.params;
    const { festivalId } = req.body;
    const objectId = mongoose.Types.ObjectId(id);
    try {
        const currentUser = await User.findById(id);
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
