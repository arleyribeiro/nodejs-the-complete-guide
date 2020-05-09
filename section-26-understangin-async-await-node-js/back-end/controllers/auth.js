const { body } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const ValidationHelper = require('../util/validationHelper');
const StatusCode = require('../constants/statusCode');

exports.signUp = async (req, res, next) => {
  ValidationHelper.validationResult(req, 'validation failed');
  const { email, name, password } = req.body;
  try{
    const hashPassword = await bcrypt.hash(password, 12);
    const user = new User();
    user.email = email;
    user.name = name;
    user.password = hashPassword;
    await user.save();
    res.status(StatusCode.CREATED).json({
      message: 'user created',
      userId: result._id
    });
  } catch(err) {
    ValidationHelper.internalServerError(err, next);
  }
};

exports.login = async (req, res, next) => {
  ValidationHelper.validationResult(req);

  const { email, password } = req.body;
  let loadedUser;
  try {
    const user = await User.findOne({ email: email })
    ValidationHelper.validateDataError(user, 'A user with this email could not be found.', StatusCode.NOT_FOUND);
    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);
    ValidationHelper.validateDataError(isEqual, 'Wrong password', StatusCode.UNAUTHORIZED);
    const token = jwt.sign({
        email: loadedUser.email,
        userId: loadedUser._id.toString()        
      }, 
      'somesupersecret',
      { expiresIn: '1h'}
    );
    
    res.status(StatusCode.OK).json({
      message: 'Logged with successfully',
      token: token
    });
  } catch(err) {
    ValidationHelper.internalServerError(err);
  }

}

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

exports.loginValidator = () => {
  return [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 3})
  ];
}