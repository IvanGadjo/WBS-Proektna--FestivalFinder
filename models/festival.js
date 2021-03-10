const mongoose = require('mongoose');

const { Schema } = mongoose;

const FestivalSchema = new Schema({
    name: {type: String, required: true},
    date: {type: Date, requred: false},
    website: {type: String},
    image: {type: String},
    genre: {type: String}
})

module.exports = mongoose.model('Festival', FestivalSchema)