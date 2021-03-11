const express = require('express');
const debug = require('debug')('app');
const morgan = require('morgan');
const usersRouter = require('./src/routes/usersRouter')();

const app = express();


// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('tiny'));


app.get('/', (req, resp) => {
    resp.send('Welcome to Festival Finder!');
});

app.use('/user', usersRouter);

const port = 3000;
app.listen(port, () => {
    debug(`Running on port ${port}`);
});
