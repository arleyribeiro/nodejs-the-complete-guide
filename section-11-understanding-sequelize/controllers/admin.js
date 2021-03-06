const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  /* this method was created by sequelize, relationship, belongsTo or hasMany */
  req.user.createProduct({
    title: title,
    description: description,
    price: price,
    imageUrl: imageUrl
  })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  console.log(editMode)
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  req.user
    .getProducts({ where: { id: prodId } }) //this method was created by sequelize, relationship, belongsTo or hasMany
      .then(products => {
        const product = products[0];
        if (!product) {
          return res.redirect('/');
        }
        res.render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing: editMode,
          product: product
        });
      })
      .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
      .then(products => {
        res.render('admin/products', {
          prods: products,
          pageTitle: 'Admin Products',
          path: '/admin/products'
        });
      })
      .catch(err => console.log(err));
};


exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  Product.findByPk(prodId)
    .then(product => {
      product.title = title,
      product.imageUrl = imageUrl,
      product.description = description,
      product.price = price
      return product.save();
    })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));  
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  console.log('delete', prodId)
  Product.findByPk(prodId)
  .then((product) => {
    return product.destroy(product.id);
  })
  .then((result) => {
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err));
  res.redirect('/admin/products');
};