const express = require('express');
const path = require('path');

// Get root directory
const rootDir = require('../helper/path');

/* A router object is an isolated instance of middleware and routes. 
You can think of it as a “mini-application,” capable only of performing middleware and routing functions. 
Every Express application has a built-in app router. */
const router = express.Router();

router.get('/', (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'index.html'));
});

router.get('/users', (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'users.html'));
});

module.exports = router;