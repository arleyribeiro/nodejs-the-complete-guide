const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');

const ITEM_PER_PAGE = 2;

exports.getProducts = (req, res, next) => {

  const page = +req.query.page || 1;
  const skip = (page - 1) * ITEM_PER_PAGE;
  let totalItems = 0;

  Product.find()
  .countDocuments()
    .then(numDocuments => {
      totalItems = numDocuments;
      return Product.find()
          .skip(skip)
          .limit(ITEM_PER_PAGE);
    })
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        currentPage: page,
        hasNextPage: ITEM_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEM_PER_PAGE)
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProductById = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
  .then((product) => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: 'Details Product',
      path: '/products'
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  const skip = (page - 1) * ITEM_PER_PAGE;
  let totalItems = 0;

  Product.find()
  .countDocuments()
    .then(numDocuments => {
      totalItems = numDocuments;
      return Product.find()
          .skip(skip)
          .limit(ITEM_PER_PAGE);
    })
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        currentPage: page,
        hasNextPage: ITEM_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEM_PER_PAGE)
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
          prods: products
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteCart = (req, res, next) => {
  const prodId = req.body.productId;
  console.log("prodId: ", prodId)
  req.user.removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
          email: req.user.email,
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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports. getOrders = (req, res, next) => {
  Order
    .find({ "user.userId": req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('No order found.'));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized.'));
      }
      const fileName = `invoice-${orderId}.pdf`;
      const invoicePath = path.join('data', 'invoices', fileName);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Dispostion', `inline; filename=${fileName}`);
      const pdfDoc = new PDFDocument();
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);
      pdfDoc.fontSize(26).text('Invoice', {
        underline: true
      });
      pdfDoc.text("------------------------------------------------------");
      let totalPrice = 0;
      order.products.forEach(prod => {
        totalPrice += prod.product.price * prod.quantity;
        pdfDoc.fontSize(14).text(`${prod.product.title} - ${prod.quantity} x \$ ${prod.product.price}`);
      });

      pdfDoc.fontSize(26).text("------------------------------------------------------");
      pdfDoc.fontSize(26).text(`Total price: ${totalPrice}`)
      pdfDoc.end();
      /* 
      // aproach for tiny files - preloading files in memory - bad way for big files
      fs.readFile(invoicePath, (err, data) => {
        if (err) {
          next(err);
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Dispostion', `attachment; filename=${fileName}`);
        res.send(data);
      }); 

      // Streaming data - best way
      const file = fs.createReadStream(invoicePath);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Dispostion', `inline; filename=${fileName}`);
      file.pipe(res);*/
    })
    .catch(err => {
      next(err);
    });
}
