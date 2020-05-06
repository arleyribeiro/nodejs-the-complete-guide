const { body } = require("express-validator");
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const ValidationHelper = require('../util/validationHelper');
const StatusCode = require('../constants/statusCode');

exports.signUp = (req, res, next) => {
  ValidationHelper.validationResult(req, 'validation failed');
  const { email, name, password } = req.body;


  bcrypt.hash(password, 12)
  .then(hashPassword => {
    const user = new User();
    user.email = email;
    user.name = name;
    user.password = hashPassword;
    return user.save();
  })
  .then(result => {
    res.status(StatusCode.CREATED).json({
      message: 'user created',
      userId: result._id
    });
  })
  .catch(err => {
    ValidationHelper.internalServerError(err, next);
  });
};

exports.userValidator = () => {
  return [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value })
            .then(userDoc => {
              if (userDoc) {
                return Promise.reject('Email address already exists!');
              }
            })
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 3}),
    body('name')
      .trim()
      .not()
      .isEmpty()
  ];
};