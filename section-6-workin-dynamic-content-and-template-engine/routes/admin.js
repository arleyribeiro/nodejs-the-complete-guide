const express = require('express');
const path = require('path');

const rootDir = require('../util/path');

const router = express.Router();

const products = [];

router.get('/add-product', (req, res, next) => {
    console.log('In the middleware');
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    res.render('add-product', {docTitle: 'Add Product'});
});

router.post('/add-product', (req, res, next) => {
    console.log("produtct: ", req.body);
    products.push({ title: req.body.title})
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    res.render('add-product', {docTitle: 'Add Product'});
});

exports.routes = router;
exports.products = products;