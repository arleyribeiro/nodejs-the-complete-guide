const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.put('/signup', authController.userValidator(), authController.signUp);

router.post('/login', authController.loginValidator(), authController.login);

module.exports = router;