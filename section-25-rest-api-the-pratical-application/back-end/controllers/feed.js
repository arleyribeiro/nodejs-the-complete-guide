const { validationResult, body } = require("express-validator");
const fs = require('fs');
const path = require('path');

const Post = require("../models/post");
const StatusCode = require('../constants/statusCode');

const validationResultPost = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
		const error = new Error('Validation failed, entered data is incorrect.');
		error.statusCode = StatusCode.UNPRECESSABLE_ENTITY;
		throw error;
  }
};

const validateDataError = (data, message, statusCode) => {
  if (!data) {
    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;
  }
};

const internalServerError = (err, next) => {
  if (!err.statusCode) {
    err.statusCode = StatusCode.INTERNAL_SERVER_ERROR;
  }
  next(err);
};

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Post.find()
  .countDocuments()
  .then(count => {
    totalItems = count;
    const skip = (currentPage - 1) * perPage;
    return Post
            .find()
            .skip(skip)
            .limit(perPage);
    
  })
    .then(posts => {
      validateDataError(posts, 'Could not find post', StatusCode.NOT_FOUND);
      res.status(StatusCode.OK)
        .json({
          message: 'Fetched posts successfully.',
          posts: posts,
          totalItems: totalItems
        })
    })
    .catch(err => {
      internalServerError(err, next);
    });
};

exports.createPost = (req, res, next) => {
  validationResultPost(req);
  validateDataError(req.file);

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
      res.status(StatusCode.CREATED).json({ 
        message: "Post created successfully!", 
        post: result 
      });
    })
    .catch(err => {
      internalServerError(err, next);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
  .then(post => {
    validateDataError(post, 'Could not find post', StatusCode.NOT_FOUND);
    res.status(StatusCode.OK).json({ 
      message: "Post fetched!", 
      post: post 
    });
  })
  .catch(err => {
    internalServerError(err, next);
  });
}

exports.updatePost = (req, res, next) => {
  validationResultPost(req);

  const { title, content, image, creator } = req.body;
  const imageUrl = image;
  if (req.file) {
    imageUrl = req.file.path;
  }

  validateDataError(imageUrl, 'No image picked', StatusCode.UNPRECESSABLE_ENTITY);

  Post.findById(postId)
  .then(post => {
    validateDataError(post, 'Could not find post', StatusCode.NOT_FOUND);

    if (imageUrl != post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.imageUrl = imageUrl;
    post.content = content;
    return post.save();
  })
  .then(result => {
    res.status(StatusCode.OK).json({ 
      message: "Post updated!", 
      post: result 
    });
  })
  .catch(err => {
    internalServerError(err, next);
  });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      validateDataError(post, 'Could not find post', StatusCode.NOT_FOUND);
      clearImage(post.imageUrl);
      return Post.findByIdAndDelete(postId);
    })
    .then(result => {
      res.status(StatusCode.OK).json({ 
        message: "Deleted post!"
      });
    })
    .catch(err => {
      internalServerError(err, next);
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
