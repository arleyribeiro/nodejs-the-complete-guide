const jwt = require('jsonwebtoken');
const ValidationHelper = require('../util/validationHelper');
const StatusCode = require('../constants/statusCode');

module.exports = (req, res, next) => {
  const authorization = req.get('Authorization');  

  if (!authorization) {
    req.isAuth = false;
    return next();
  } 

  const token = authorization.split(' ')[1];
  let decodetoken;
  try{
    decodetoken = jwt.verify(token, 'somesupersecret');
  } catch (err) {
    req.isAuth = false;
    return next();
  }

  if (!decodetoken) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.userId = decodetoken.userId;
  next();
};