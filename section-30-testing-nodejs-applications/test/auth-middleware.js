const authMiddleware = require('../middleware/is-auth');
const expect = require('chai').expect;

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
});