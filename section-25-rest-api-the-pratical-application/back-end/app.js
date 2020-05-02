const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const feedsRoutes = require('./routes/feed');

const app = express();

const MONGODB_URI = "mongodb+srv://arley:9IaUYwLsVYJVj5RV@cluster0-mhqji.mongodb.net/postdb?retryWrites=true&w=majority";

// Setup app for application/json
app.use(bodyParser.json({ extended: true }));

// Set CORSS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Set routes
app.use('/feed', feedsRoutes);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
      app.listen(8080);
  })
  .catch(err => console.log(err));