const express = require('express');

const feedController = require('../controllers/feed')

const router = express.Router();

router.get('/posts', feedController.getPosts);

router.post('/post', feedController.createPostValidator(), feedController.createPost);

router.get('/posts/:postId', feedController.getPost);

module.exports = router;