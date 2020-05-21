const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const Post = require("../models/post");
const User = require("../models/user");
const FeedController = require("../controllers/feed");
const StatusCode = require("../constants/statusCode");

const MONGODB_URI_TEST =
  "mongodb+srv://arley:9IaUYwLsVYJVj5RV@cluster0-mhqji.mongodb.net/testdb?retryWrites=true&w=majority";

describe("Feed Controller", function() {
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

  it("should add a created post to the posts of a the creator", function(done) {
    const req = {
      userId: '5c0f66b979af55031b34728a',
      body: {
        title: 'test post',
        content: 'test post'        
      },
      file: {
        path: 'dummypath'
      }
    };

    const res = {
      status: function() {
        return this;
      },
      json: function() {}
    };

    FeedController.createPost(req, res, () => {})
      .then(user => {
        expect(user).to.have.property("posts");
        expect(user.posts).to.have.length(1);
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
