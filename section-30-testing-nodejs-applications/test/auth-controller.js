const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const AuthController = require("../controllers/auth");
const StatusCode = require("../constants/statusCode");

const MONGODB_URI_TEST =
  "mongodb+srv://arley:9IaUYwLsVYJVj5RV@cluster0-mhqji.mongodb.net/testdb?retryWrites=true&w=majority";

describe("Auth Controller", function() {
  before(function(done) {
    mongoose
      .connect(MONGODB_URI_TEST, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => {
        const user = new User({
          email: "email@email.com",
          name: "test",
          password: "asdfasdf",
          posts: [],
          _id: "5c0f66b979af55031b34728a"
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });

  it("should throw an error if accessing the database fail", function(done) {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    const req = {
      body: {
        email: "a@a.com",
        password: "teste"
      }
    };
    AuthController.login(req, {}, () => {}).then(result => {
      expect(result).to.be.an("error");
      expect(result).to.have.property(
        "statusCode",
        StatusCode.INTERNAL_SERVER_ERROR
      );
      done();
    });

    User.findOne.restore();
  });

  it("should send a response with a valid user status for an existing user", function(done) {
    const req = {
      userId: "5c0f66b979af55031b34728a"
    };
    const res = {
      statusCode: StatusCode.INTERNAL_SERVER_ERROR,
      userStatus: null,
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.userStatus = data.status;
      }
    };
    AuthController.getUserStatus(req, res, () => {}).then(() => {
      expect(res.statusCode).to.be.equal(StatusCode.OK);
      expect(res.userStatus).to.be.equal("NEW_USER");
      done();
    });
  });

  after(function(done) {
    User.deleteMany({})
    .then(() => {
      return mongoose.disconnect();
    })
    .then(() => {
      done();
    });
  });
});
