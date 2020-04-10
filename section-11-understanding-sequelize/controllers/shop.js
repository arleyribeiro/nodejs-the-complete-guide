const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProductById = (req, res, next) => {
  const productId = req.params.productId;
  Product.findByPk(productId)
  .then((product) => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: 'Details Product',
      path: '/products'
    });
  })
  .catch(err => {
    console.log(err)
  });
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  const cartProducts = [];
  Cart.getCart((cart) => {
    Product.findAll()
    .then(products => {
      for(product of products) {
        const productCart = cart.products.find(prod => prod.id === product.id);
        if (productCart) {
          cartProducts.push({productData: product, qty: productCart.qty});
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        prods: cartProducts
      });    
    })
    .catch((err) => {
      console.log(err);
    })
  })
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  })
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart',
    prods: []
  });
};

exports.postDeleteCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    console.log(product, prodId, req.body.productId)
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
