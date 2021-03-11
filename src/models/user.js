const mongoose = require('mongoose');
const festival = require('./festival');

const { Schema } = mongoose;

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    festivals: { type: [festival.schema], default: [] }
});

module.exports = mongoose.model('User', UserSchema);
