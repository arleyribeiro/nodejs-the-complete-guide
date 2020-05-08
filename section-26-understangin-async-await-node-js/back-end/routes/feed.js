const express = require('express');

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/posts', isAuth, feedController.getPosts);

router.post('/post', isAuth, feedController.PostValidator(), feedController.createPost);

router.get('/posts/:postId', isAuth, feedController.getPost);

router.put('/post/:postId', isAuth, feedController.PostValidator(), feedController.updatePost);

router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;