const mongoose = require('mongoose');
const Festival = require('./Festival');

const { Schema } = mongoose;

const UserSchema = new Schema({
    googleId: {
        type: String,
        required: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    festivals: {
        type: [Festival.schema], 
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
  });

module.exports = mongoose.model('User', UserSchema);

