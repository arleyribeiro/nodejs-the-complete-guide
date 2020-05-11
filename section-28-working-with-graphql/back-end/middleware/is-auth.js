const jwt = require('jsonwebtoken');
const ValidationHelper = require('../util/validationHelper');
const StatusCode = require('../constants/statusCode');

module.exports = (req, res, next) => {
  const authorization = req.get('Authorization');  
  if (!authorization) {
    ValidationHelper.validateDataError(authorization, 'Not authenticaded.', StatusCode.UNAUTHORIZED);
  } 

  const token = authorization.split(' ')[1];
  let decodetoken;
  try{
    decodetoken = jwt.verify(token, 'somesupersecret');
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  ValidationHelper.validateDataError(decodetoken, 'Not authenticaded.', StatusCode.UNAUTHORIZED);
  req.userId = decodetoken.userId;
  next();
};