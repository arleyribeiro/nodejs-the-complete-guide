const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports = {
  createUser: async function({ userInput }, req) {
    const existngUser = await User.findOne({ email: userInput.email });
    if ( existngUser) {
      const error = new Error('User exists already!');
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