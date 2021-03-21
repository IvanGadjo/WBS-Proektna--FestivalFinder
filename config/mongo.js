const mongoose = require('mongoose');
const debug = require('debug')('app:mongo');

// eslint-disable-next-line consistent-return
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });
        return conn.connection.getClient();
        //console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        debug(err);
        process.exit(1);
    }
};

module.exports = connectDB;
