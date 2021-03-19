const express = require('express');
const debug = require('debug')('app');
const morgan = require('morgan');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const connectDB = require('./config/mongo');

const app = express();

//Load config
dotenv.config({ path: './config/config.env' });

// Passport config
require('./src/auth/passport')(passport);

connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('tiny'));

// Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    // store value to be added later for mongo connection
  }));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, resp) => {
    resp.send('Welcome to Festival Finder!');
});
app.use('/auth', require('./src/routes/authRouter'));

app.use('/user', require('./src/routes/usersRouter'));

const port = 3000;
app.listen(port, () => {
    debug(`Running on port ${port}`);
});
