const mongoose = require('mongoose')
const debug = require('debug')('app:mongoose');
const User = require('../models/user');
const Festival = require('../models/festival');


const createNewUser = async(email, festivals) => {
    const newUser = new User({
        email,
        festivals
    });
    try {
        const result = await newUser.save();
        return result;
    }
    catch(error) {
        debug(error)
        return error;
    }
}

const getUserById = async(req) => {
    const { id } = req.params;
    try {
        const res = await User.findById(id).exec();
        return res;
    }
    catch(error) {
        debug(error)
        return `Cannot with user with id:${id}`
    }
}

const addFestivaltoUser = async(req) => {
    const { name, date, website, image, genre, location} = req.body
    const newFestival = new Festival({
        name: name,
        date: date,
        website: website,
        image: image,
        genre: genre,
        location: location
    });
    const { id } = req.params
    const objectId = mongoose.Types.ObjectId(id);
    try {
        const currentUser = await User.findById(id);
        currentUser.festivals.push(newFestival)
        const res = User.findByIdAndUpdate(objectId, currentUser, { new: true }).exec();
        return res;
    }
    catch(error) {
        debug(error);
        return `cannot add the festival to the user with id:${id}`
    }
}

