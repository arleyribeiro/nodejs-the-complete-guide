const invalidInput = 'Invalid input.';
const emailInvalid = 'E-mail is invalid.';
const passwordInvalid = 'Password too short!';
const duplicateUser = 'User exists already!';

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
}

module.exports = ErrorMessage;