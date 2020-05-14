const invalidInput = 'Invalid input.';

const emailInvalid = 'E-mail is invalid.';

const passwordInvalid = 'Password too short.';
const passwordIncorrect = 'Password is incorrect.'

const duplicateUser = 'User exists already.';
const userNotFound = 'User not found.'

const titleInvalid = 'Title is invalid.';
const imageUrlInvalid = 'Image url no picked.';
const contentInvalid = 'Content is invalid.';

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

  static get TITLE_INVALID() {
    return titleInvalid;
  }

  static get CONTENT_INVALID() {
    return contentInvalid;
  }

  static get IMAGE_URL_INVALID() {
    return imageUrlInvalid;
  }
}

module.exports = ErrorMessage;