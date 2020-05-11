const { body } = require("express-validator");
const fs = require('fs');
const path = require('path');

const Post = require("../models/post");
const StatusCode = require('../constants/statusCode');
const ValidationHelper = require('../util/validationHelper');
const User = require('../models/user');
const io = require('../socket');

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  try {    
    const perPage = 2;
    const skip = (currentPage - 1) * perPage;
    let totalItems = await Post
                            .find()
                            .countDocuments();
    let posts = await Post 
                        .find()
                        .populate('creator')
                        .skip(skip)
                        .limit(perPage);

      ValidationHelper.validateDataError(posts, 'Could not find post', StatusCode.NOT_FOUND);
      res.status(StatusCode.OK)
        .json({
          message: 'Fetched posts successfully.',
          posts: posts,
          totalItems: totalItems
        });
    } catch(err) {
      ValidationHelper.internalServerError(err, next);
    }
};

exports.createPost = async (req, res, next) => {
  try {
    ValidationHelper.validationResult(req, 'Validation failed, entered data is incorrect.');
    ValidationHelper.validateDataError(req.file);

    const { title, content } = req.body;
    const imageUrl = req.file.path;

    const post = new Post({
      title: title,
      content: content,
      imageUrl: imageUrl,
      creator: req.userId
    });
    const result = await post.save();
    if (result) {
      const user = await User.findById(req.userId);
      user.posts.push(post);
      result = await user.save();
      io.getIO().emit('posts', { action: 'create', post: { ...post._doc, creator: { _id: req.userId, name: user.name }}});
      res.status(StatusCode.CREATED).json({ 
        message: "Post created successfully!", 
        post: post,
        creator: { _id: user._id, name: user.name }
      });
    }
  } catch(err) {
      ValidationHelper.internalServerError(err, next);
  }
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {    
    const post = await Post.findById(postId);
    ValidationHelper.validateDataError(post, 'Could not find post', StatusCode.NOT_FOUND);
    res.status(StatusCode.OK).json({ 
      message: "Post fetched!", 
      post: post 
    });  
  } catch(err) {
    ValidationHelper.internalServerError(err, next);
  }
}

exports.updatePost = async (req, res, next) => {
  try {
    ValidationHelper.validationResult(req, 'Validation failed, entered data is incorrect.');

    const { title, content, image, creator } = req.body;
    const imageUrl = image;
    if (req.file) {
      imageUrl = req.file.path;
    }
    ValidationHelper.validateDataError(imageUrl, 'No image picked', StatusCode.UNPRECESSABLE_ENTITY);
    const post = await Post.findById(postId).populate('creator');

    ValidationHelper.validateDataError(post, 'Could not find post', StatusCode.NOT_FOUND);

    if (post.creator._id.toString() !== req.userId.toString()) {
      ValidationHelper.validateDataError(null, 'Not authorized!', StatusCode.FORBIDDEN);
    }

    if (imageUrl != post.imageUrl) {
      clearImage(post.imageUrl);
    }

    post.title = title;
    post.imageUrl = imageUrl;
    post.content = content;
    const result = await post.save();
    io.getIO().emit('posts', { action: 'update', post: result });

    res.status(StatusCode.OK).json({ 
      message: "Post updated!", 
      post: result 
    });
  } catch(err) {
    ValidationHelper.internalServerError(err, next);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    ValidationHelper.validateDataError(post, 'Could not find post', StatusCode.NOT_FOUND);

    if (post.creator.toString() !== req.userId.toString()) {
      ValidationHelper.validateDataError(null, 'Not authorized!', StatusCode.FORBIDDEN);
    }  

    clearImage(post.imageUrl);
    let result = await Post.findByIdAndDelete(postId);
    const user = await User.findById(req.userId);
    user.post.pull(postId);
    result = await user.save();
    res.status(StatusCode.OK).json({ 
      message: "Deleted post!"
    });
  } catch (err) {
    ValidationHelper.internalServerError(err, next);
  }
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
