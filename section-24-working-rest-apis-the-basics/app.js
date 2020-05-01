const express = require('express');

const feedsRoutes = require('./routes/feed');

const app = express();

app.use('/feed', feedsRoutes);

app.listen(3000);