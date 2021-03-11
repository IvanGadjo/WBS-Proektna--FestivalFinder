const express = require('express');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');


const app = express();


// middlewate
app.use(morgan('tiny'));


app.get('/', (req, resp) => {
    resp.send('Welcome to Festival Finder!');
});


const port = 3000;
app.listen(port, () => {
    debug(`Running on port ${port}`);
});
