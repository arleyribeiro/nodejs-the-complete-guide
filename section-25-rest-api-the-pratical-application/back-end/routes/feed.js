const express = require('express');

const feedController = require('../controllers/feed')

const router = express.Router();

router.get('/posts', feedController.getPosts);

router.post('/post', feedController.PostValidator(), feedController.createPost);

router.get('/posts/:postId', feedController.getPost);

router.put('/post/:postId', feedController.PostValidator(), feedController.updatePost);

router.delete('/post/:postId', feedController.deletePost);

module.exports = router;