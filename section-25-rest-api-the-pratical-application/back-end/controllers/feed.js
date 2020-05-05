const { validationResult, body } = require("express-validator");
const fs = require('fs');
const path = require('path');

const Post = require("../models/post");
const StatusCode = require('../constants/statusCode');

exports.getPosts = (req, res, next) => {

  Post.find()
    .then(posts => {
      if (!posts) {
        const error = new Error('Not found');
        throw error;
      }
      res.status(StatusCode.OK)
        .json({
          message: 'Fetched posts successfully.',
          posts: posts
        })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = StatusCode.INTERNAL_SERVER_ERROR;
      }
      next(err);
    });
};

const validationResultPost = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
		const error = new Error('Validation failed, entered data is incorrect.');
		error.statusCode = StatusCode.UNPRECESSABLE_ENTITY;
		throw error;
  }
};

const postNotFoundError = (post) => {
  if (!post) {
    const error = new Error('Could not find post');
    error.statusCode = StatusCode.NOT_FOUND;
    throw error;
  }
};

const internalServerError = err => {
  if (!err.statusCode) {
    err.statusCode = StatusCode.INTERNAL_SERVER_ERROR;
  }
  next(err);
};

const resPost = (res, message, statusCode, result) => {
  res.status(statusCode).json({
    message: message,
    post: result
  });
};

exports.createPost = (req, res, next) => {
  validationResultPost(req);

  if (!req.file) {
		const error = new Error('No image provided.');
		error.statusCode = StatusCode.UNPRECESSABLE_ENTITY;
		throw error;
  }

  const { title, content } = req.body;
  const imageUrl = req.file.path;
  const creator = { name: "dummy" };

  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: creator
  });

  post
    .save()
    .then(result => {
      resPost(res, "Post created successfully!", StatusCode.CREATED, result);
    })
    .catch(err => {
      internalServerError(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
  .then(post => {
    postNotFoundError(post);
    resPost(res, "Post fetched.", StatusCode.OK, post);
  })
  .catch(err => {
    internalServerError(err);
  });
}

exports.updatePost = (req, res, next) => {
  validationResultPost(req);

  const { title, content, image, creator } = req.body;
  const imageUrl = image;
  if (req.file) {
    imageUrl = req.file.path;
  }

  if (!imageUrl) {
    const error = new Error('No image picked.');
    error.statusCode = StatusCode.UNPRECESSABLE_ENTITY;
    throw error;
  }

  Post.findById(postId)
  .then(post => {
    postNotFoundError(post);

    if (imageUrl != post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.imageUrl = imageUrl;
    post.content = content;
    return post.save();
  })
  .then(result => {
    resPost(res, "Post updated!", StatusCode.OK, result);
  })
  .catch(err => {
    internalServerError(err);
  });
};

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};

exports.PostValidator = () => {
  return [
    body("title", "title invalid")
      .isString()
      .isLength({ min: 5 })
      .trim(),
    body("content", "Content invalid")
      .isString()
      .isLength({ min: 5 })
      .trim()
  ];
};
