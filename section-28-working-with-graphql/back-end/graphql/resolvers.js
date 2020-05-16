const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const StatutsCode = require('../constants/statusCode');
const ErrorMessage = require('../constants/errorMessage');
const ValidatorHelper = require('../util/validationHelper');
const User = require('../models/user');
const Post = require('../models/post');

const POST_PER_PAGE = 2;

module.exports = {
  createUser: async function({ userInput }, req) {

    const errors = []
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: ErrorMessage.EMAIL_INVALID });
    }
    if (validator.isEmpty(userInput.password) ||
        validator.isLength(userInput.password, { min: 5})) {
          errors.push({ message: ErrorMessage.PASSWORD_INVALID });
    }
    if (errors.length > 0) {
      const error = new Error(ErrorMessage.INVALID_INPUT);
      error.data = errors;
      error.code = StatutsCode.UNPRECESSABLE_ENTITY;
      throw error;
    }
    const existngUser = await User.findOne({ email: userInput.email });
    if ( existngUser) {
      const error = new Error(ErrorMessage.DUPLICATE_USER);
      throw error;
    }
    const hashPassword = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashPassword
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },

  login: async function ({ email, password}) {
    const user = await User.findOne({ email: email });
    ValidatorHelper.validateDataError(user, ErrorMessage.USER_NOT_FOUND, StatutsCode.NOT_FOUND);

    const isEqual = await bcrypt.compare(password, user.password);
    ValidatorHelper.validateDataError(isEqual, ErrorMessage.PASSWORD_INCORRECT, StatutsCode.NOT_FOUND);

    const token = jwt.sign({
      userId: user._id.toString(),
      email: user.email
    }, 'somesupersecret', { expiresIn: '1h' });
    return { token: token, userId: user._id.toString() };
  },

  createPost: async function({ postInput }, req) {
    ValidatorHelper.validateDataError(req.isAuth, ErrorMessage.UNAUTHORIZED, StatutsCode.UNAUTHORIZED);
    const errors = []
    if (validator.isEmpty(postInput.title) || !validator.isLength(postInput.title, { min: 5})) {
      errors.push({ message: ErrorMessage.TITLE_INVALID });
    }

    if (!validator.isEmpty(postInput.imageUrl)) {
      errors.push({ message: ErrorMessage.IMAGE_URL_INVALID });
    }

    if (validator.isEmpty(postInput.content)|| !validator.isLength(postInput.content, { min: 5})) {
      errors.push({ message: ErrorMessage.CONTENT_INVALID });
    }

    if (errors.length > 0) {
      const error = new Error(ErrorMessage.INVALID_INPUT);
      error.data = errors;
      error.code = StatutsCode.UNPRECESSABLE_ENTITY;
      throw error;
    }

    const user = await User.findById(req.userId);

    ValidatorHelper.validateDataError(user, ErrorMessage.USER_NOT_FOUND, StatutsCode.NOT_FOUND);
    
    const post = new Post({
      title: postInput.title,
      content: postInput.content,
      imageUrl: postInput.imageUrl,
      creator: user
    });
    const createdPost = await post.save();
    user.posts.push(createdPost);
    await user.save();
    return { 
      ...createdPost._doc, 
      _id: createdPost._id.toString(), 
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString()
    }
  },
  posts: async function ({ page }, req) {
    ValidatorHelper.validateDataError(req.isAuth, ErrorMessage.UNAUTHORIZED, StatutsCode.UNAUTHORIZED);
    const totalPosts = await Post.find().countDocuments();

    page = !page ? 1 : page;
    const skip = (page - 1) * POST_PER_PAGE;
    const posts = await Post.find()
      .skip(skip)
      .limit(POST_PER_PAGE)
      .sort({ createdAt: -1 })
      .populate('creator');
    const result = {
      posts: posts.map(p => {
        return {
          ...p._doc,
          _id: p._id.toString(),
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString()
        }
      }),
      totalPosts: totalPosts
    }
    return result;
  }
};