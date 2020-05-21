const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddleware = require('../middleware/is-auth');

describe('Auth Middleware', function() {
  it('should throw an error if no authorization header is present', function() {
    const req = {
      get: function(headerName) {
        return null;
      }
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Not authenticaded.');
  });
  
  it('should throw an error if no authorization header is only one string', function() {
    const req = {
      get: function(headerName) {
        return 'unittest';
      }
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it('should yield a userId after decoding the token', function() {
    const req = {
      get: function(headerName) {
        return 'Bearer unittest';
      }
    };

    sinon.stub(jwt, 'verify');
    jwt.verify.returns({ userId: '123' });
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property('userId');
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore();
  });

  it('should throw an error if the token cannot be verified', function() {
    const req = {
      get: function(headerName) {
        return 'Bearer unittest';
      }
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });
});