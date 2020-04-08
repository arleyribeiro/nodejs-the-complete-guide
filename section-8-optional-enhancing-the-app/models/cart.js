const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
  );

module.exports = class Cart { 
    static addProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                console.log(fileContent)
                if (fileContent)
                    cart = JSON.parse(fileContent);
            }
            const existingProductIndex = cart.products.findIndex(p => p.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updateProduct;
            if (existingProduct) {
                updateProduct = {...existingProduct};
                updateProduct.qty += 1;
                cart.products[existingProductIndex] = updateProduct;
            } else {
                updateProduct = { id: id, qty: 1 };
                cart.products = [...cart.products, updateProduct];
            }
            cart.totalPrice += productPrice;
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            });
        });
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return;
            }
            const updateCart = {...JSON.parse(fileContent)};
            const product = updateCart.products.findIndex(prod => prod.id === id);
            if (!product) {
                return;
            }
            const productQty = product.qty;
            updateCart.products = updateCart.products.filter(prod => { 
                prod.id !== id
            });
            updateCart.totalPrice -= productPrice * productQty;
            fs.writeFile(p, JSON.stringify(updateCart), err => {
                console.log(err);
            });
        })
    }

    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                cb(null);
            } else {
                const cart = {...JSON.parse(fileContent)};
                cb(cart);
            }
        })
    }
}