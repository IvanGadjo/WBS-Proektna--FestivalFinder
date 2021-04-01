const express = require('express');
const debug = require('debug')('app');
const morgan = require('morgan');
const dotenv = require('dotenv');
const session = require('express-session');
const cors = require('cors');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const connectDB = require('./config/mongo');

const app = express();

//Load config
dotenv.config({ path: './config/config.env' });

// Passport config
require('./src/auth/passport')(passport);

const clientP = connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('tiny'));

app.use(cors({ origin: 'http://localhost:3000',  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE', credentials: true }));

// Sessions
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      clientPromise: clientP,
    }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', require('./src/routes/indexRouter'));

app.use('/auth', require('./src/routes/authRouter'));

app.use('/user', require('./src/routes/usersRouter')());


app.listen(process.env.PORT_NM, () => {
  debug(`Running on port ${process.env.PORT_NM}`);
});
