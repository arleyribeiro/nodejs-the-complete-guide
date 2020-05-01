const express = require('express');
const bodyParser = require('body-parser');

const feedsRoutes = require('./routes/feed');

const app = express();

// Setup app for application/json
app.use(bodyParser.json({ extended: true }));

// Set routes
app.use('/feed', feedsRoutes);

app.listen(3000);