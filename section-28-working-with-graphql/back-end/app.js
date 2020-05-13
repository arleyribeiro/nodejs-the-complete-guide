const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const graphqlHttp = require('express-graphql');

const StatusCode = require('./constants/statusCode');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

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

app.use('/graphql', graphqlHttp({
  schema: graphqlSchema,
  rootValue: graphqlResolver,
  graphiql: true,
  formatError(err) {
    if (!err.originalError) {
      return err;
    }
    const data = err.originalError.data;
    const message = err.message || 'An error ocurred!';
    const code = err.originalError.code || 500;
    return { message: message, status: code, data: data };
  }
}));

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