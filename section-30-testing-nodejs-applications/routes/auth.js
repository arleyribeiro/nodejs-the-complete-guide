const express = require('express');

const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.put('/signup', authController.userValidator(), authController.signUp);

router.post('/login', authController.loginValidator(), authController.login);

router.post('/getUserStatus', isAuth, authController.getUserStatus);

router.put('/updateUserStatus', isAuth, authController.statusValidator(), authController.updateUserStatus);

module.exports = router;