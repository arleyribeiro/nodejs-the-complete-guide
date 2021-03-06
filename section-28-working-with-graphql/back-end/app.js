const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const graphqlHttp = require("express-graphql");
const path = require("path");


const StatusCode = require("./constants/statusCode");
const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");
const auth = require("./middleware/auth");
const FunctionHelper = require('./util/functionHelper');

const app = express();

const MONGODB_URI =
  "mongodb+srv://arley:9IaUYwLsVYJVj5RV@cluster0-mhqji.mongodb.net/postdb?retryWrites=true&w=majority";

// Setup for uploading files
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    return cb(null, true);
  } else {
    cb(null, false);
  }
};

// Setup app for application/json
app.use(bodyParser.json({ extended: true }));
app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter
  }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

// Set CORSS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // This a trick for graphql, browser send it a options request first
  if (req.method === "OPTIONS") {
    return res.sendStatus(StatusCode.OK);
  }
  next();
});

app.use(auth);

app.put("/post-image", (req, res, next) => {
  if (!req.isAuth) {
    throw new Error('Not authenticated!');
  }
  if (!req.file) {
    return res.status(StatusCode.OK).json({ message: "No file provided!" });
  }
  if (req.body.oldPath) {
    FunctionHelper.clearImage(req.body.oldPath);
  }
  return res
    .status(StatusCode.CREATED)
    .json({ message: "File stored", filePath: req.file.path });
});

app.use(
  "/graphql",
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || "An error ocurred!";
      const code = err.originalError.code || StatusCode.INTERNAL_SERVER_ERROR;
      return { message: message, status: code, data: data };
    }
  })
);

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