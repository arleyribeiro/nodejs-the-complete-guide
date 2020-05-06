const express = require('express');

const authContoller = require('../controllers/auth');

const router = express.Router();

router.put('/signup', authContoller.userValidator(), authContoller.signUp);

module.exports = router;