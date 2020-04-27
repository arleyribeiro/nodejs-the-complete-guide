const { validationResult, body } = require('express-validator')

const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product
    .find({ userId: req.user._id })
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
      console.log("getproducts", products)
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    errorMessage: [],
    hasError: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, image, price, description } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      let errorMessage = {};
      errors.array().forEach(error => {
          errorMessage[error.param] = error.msg;
      })
      console.log("errorMessage", errorMessage)
      return res
              .status(422)
              .render('admin/edit-product', {
                  pageTitle: 'Add Product',
                  path: '/admin/add-product',
                  errorMessage: errorMessage,
                  editing: false,
                  hasError: true,
                  product: {
                    title: title,
                    imageUrl: image,
                    price: price,
                    description: description
                  }
              });
  }

  const product = new Product({
    title: title, 
    price: price, 
    description: description, 
    imageUrl: imageUrl,
    userId: req.user
  });

  product
    .save()
      .then(result => {
        console.log("Created", result)
        res.redirect('/admin/products');
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  console.log(editMode)
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product
    .findById(prodId)
    .then(product => {
        if (!product) {
          return res.redirect('/');
        }
        res.render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing: editMode,
          product: product,
          errorMessage: [],
          hasError: true
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, price, description } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      let errorMessage = {};
      errors.array().forEach(error => {
          errorMessage[error.param] = error.msg;
      })
      console.log("errorMessage", errorMessage)
      return res
              .status(422)
              .render('admin/edit-product', {
                  pageTitle: 'Edit Product',
                  path: '/admin/edit-product',
                  errorMessage: errorMessage,
                  hasError: true,
                  editing: true,
                  product: {
                    _id: productId,
                    title: title,
                    imageUrl: imageUrl,
                    price: price,
                    description: description
                  }
              });
  }

  Product
    .findById(productId)
    .then(product => {
      console.log("PRODUCT", product, productId)
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = title;
      product.imageUrl = image;
      product.price = price;
      product.description = description;

      return product.save();
    })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  console.log('delete', prodId)
  Product.deleteOne({_id: prodId, userId: req.user._id })
    .then((result) => {
      res.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.validateProduct = () => {
  return [
    body('title', 'Please enter a valid title just letter and digits')
      .isString()
      .isLength({ min: 3})
      .trim(),
    body('price', 'Price is invalid').isFloat(),
    body('description')
      .isLength({min: 5, max: 1000})
      .withMessage('Description is more characters with permited.')
  ];
}