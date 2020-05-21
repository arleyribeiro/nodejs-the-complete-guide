const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');

const feedsRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const StatusCode = require('./constants/statusCode');

const app = express();

const MONGODB_URI = "mongodb+srv://arley:9IaUYwLsVYJVj5RV@cluster0-mhqji.mongodb.net/postdb?retryWrites=true&w=majority";

// Setup for uploading files
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.minetype === 'image/png' || 
      file.minetype === 'image/jpg' || 
      file.minetype === 'image/jpeg') {
    return cb(null, true);
  } else {
    cb(null, false);
  }
}


// Setup app for application/json
app.use(bodyParser.json({ extended: true }));
app.use(multer({
  storage: fileStorage,
  fileFilter: fileFilter
}).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Set CORSS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Set routes
app.use('/feed', feedsRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || StatusCode.INTERNAL_SERVER_ERROR;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message: message,
    data: data
  });
});

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
      app.listen(8080);
  })
  .catch(err => console.log(err));