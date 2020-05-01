const express = require('express');
const bodyParser = require('body-parser');

const feedsRoutes = require('./routes/feed');

const app = express();

// Setup app for application/json
app.use(bodyParser.json({ extended: true }));

// Set CORS errors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Set routes
app.use('/feed', feedsRoutes);

app.listen(3000);