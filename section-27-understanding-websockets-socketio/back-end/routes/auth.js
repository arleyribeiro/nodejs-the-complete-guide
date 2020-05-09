const express = require('express');

const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.put('/signup', authController.userValidator(), authController.signUp);

router.post('/login', authController.loginValidator(), authController.login);

router.post('/status', isAuth, authController.getUserStatus);

router.put('/status', isAuth, authController.statusValidator(), authController.updateUserStatus);

module.exports = router;