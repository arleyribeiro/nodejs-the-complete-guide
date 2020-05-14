const User = require('../models/user');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const StatutsCode = require('../constants/statusCode');
const ErrorMessage = require('../constants/errorMessage');

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
  }
};