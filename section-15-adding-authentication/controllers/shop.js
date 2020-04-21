const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProductById = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
  .then((product) => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: 'Details Product',
      path: '/products',
      isAuthenticated: req.session.isLoggedIn
    });
  })
  .catch(err => {
    console.log(err)
  });
};

exports.getIndex = (req, res, next) => {
  Product.find()
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
  req.user
    .populate('cart.items.productId')
    .execPopulate()
      .then(user => {
        const products = user.cart.items;
        console.log("PRODUCTS: ", products)
        res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          prods: products,
          isAuthenticated: req.session.isLoggedIn
        });
      })
      .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postDeleteCart = (req, res, next) => {
  const prodId = req.body.productId;
  console.log("prodId: ", prodId)
  req.user.removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
  .populate('cart.items.productId')
  .execPopulate()
    .then(user => {
      const products = user.cart.items.map(p => {
        return { quantity: p.quantity, product: { ...p.productId._doc } }
      });
      console.log('products order: ', products)
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports. getOrders = (req, res, next) => {
  Order
    .find({ "user.userId": req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
    isAuthenticated: req.session.isLoggedIn
  });
};
