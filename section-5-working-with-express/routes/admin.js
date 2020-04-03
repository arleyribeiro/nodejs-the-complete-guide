const express = require('express');
const path = require('path');

const rootDir = require('../util/path');

const router = express.Router();

router.get('/add-product', (req, res, next) => {
    console.log('In the middleware');
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

router.post('/add-product', (req, res, next) => {
    console.log("produtct: ", req.body);
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

module.exports = router;