const invalidInput = 'Invalid input.';

const emailInvalid = 'E-mail is invalid.';

const passwordInvalid = 'Password too short.';
const passwordIncorrect = 'Password is incorrect.'

const duplicateUser = 'User exists already.';
const userNotFound = 'User not found.'

class ErrorMessage {
  static get INVALID_INPUT() {
    return invalidInput;
  }

  static get EMAIL_INVALID() {
    return emailInvalid;
  }

  static get PASSWORD_INVALID() {
    return passwordInvalid;
  }

  static get DUPLICATE_USER() {
    return duplicateUser;
  }

  static get USER_NOT_FOUND() {
    return userNotFound;
  }

  static get PASSWORD_INCORRECT() {
    return passwordIncorrect;
  }
}

module.exports = ErrorMessage;