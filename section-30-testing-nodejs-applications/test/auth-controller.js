const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const User = require('../models/user');
const AuthController = require('../controllers/auth');
const StatusCode = require('../constants/statusCode');

describe('Auth Controller - Login', function() {
  it('should throw an error if accessing the database fail', function (done) {
    sinon.stub(User, 'findOne');
    User.findOne.throws();

    const req = {
      body: {
        email: 'a@a.com',
        password: 'teste'
      }
    }
    AuthController.login(req, {}, () => {}).then(result => {
      expect(result).to.be.an('error');
      expect(result).to.have.property('statusCode', StatusCode.INTERNAL_SERVER_ERROR);
      done();
    })

    User.findOne.restore();
  })
});