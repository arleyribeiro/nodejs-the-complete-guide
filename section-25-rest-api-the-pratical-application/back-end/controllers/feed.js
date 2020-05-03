const { validationResult, body } = require("express-validator");

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

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
		const error = new Error('Validation failed, entered data is incorrect.');
		error.statusCode = StatusCode.UNPRECESSABLE_ENTITY;
		throw error;
  }
  const { title, content } = req.body;
  const imageUrl = "images/sun.jpeg";
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
			if (!err.statusCode) {
				err.statusCode = StatusCode.INTERNAL_SERVER_ERROR;
			}
			next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
  .then(post => {
    if (!post) {
      const error = new Error('Could not find post');
      error.statusCode = StatusCode.NOT_FOUND;
      throw error;
    }
    res.status(StatusCode.OK).json({
      message: 'Post fetched',
      post: post
    });
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = StatusCode.INTERNAL_SERVER_ERROR;
    }
    next(err);
  });
}

exports.createPostValidator = () => {
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
