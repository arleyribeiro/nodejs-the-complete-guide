const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

/*
const mongodb = require('mongodb')

const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
    constructor(username, email, id, cart) {
        this.name = username;
        this.email = email;
        this._id = id ? new mongodb.ObjectID(id) : null;
        this.cart = cart;
    }

    save() {
        const db = getDb();
        let dbOp;
        if (this._id) {
            dbOp = db.collection('users')
                     .updateOne({ _id: new mongodb.ObjectID(id) }, { $set: this });
        } else {
            dbOp = db.collection('users')
                    .insertOne(this);
        }
        return dbOp
                .then(user => {
                    return user;
                })
                .catch(err => console.log(err));
    }

    addToCart (product) {
        const db = getDb();
        let quantity = 1;
        let updatedCartItems = [];
        let cartProductIndex;
        if (this.cart && this.cart.items) {
            cartProductIndex = this.cart.items.findIndex(cp => {
                return cp.productId.toString() === product._id.toString();
            });
            updatedCartItems = [ ...this.cart.items];
        }
        if (cartProductIndex >= 0) {
            quantity += this.cart.items[cartProductIndex].quantity;
            updatedCartItems[cartProductIndex].quantity = quantity;
        } else {
            updatedCartItems.push({ productId: new ObjectId(product._id), quantity: quantity })
        }
        const updatedCart = { items: updatedCartItems };
        return db.collection('users')
            .updateOne({ _id: this._id }, { $set: {cart: updatedCart }})
            .then(user => {
                return user;
            })
            .catch(err => console.log(err));
    }

    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(p => p.productId);
        return  db.collection('products')
                .find({_id: { $in: productIds } })
                .toArray()
                .then(products => {
                    return products.map(product => {
                        return { 
                            ...product, 
                            quantity: this.cart.items.find(i => {
                                return i.productId.toString() === product._id.toString();
                            }).quantity
                        };
                    })
                })
                .catch(err => console.log(err));
    }

    static findById (id) {
        const db = getDb();
        return db.collection('users')
            .findOne({ _id: new mongodb.ObjectID(id) })
            .then(user => {
                return user;
            })
            .catch(err => console.log(err));
    }

    deleteItemFromCart (productId) {
        const db = getDb();
        const updatedItemsCart = this.cart.items.filter(product => {
            return product.productId.toString() !== productId.toString();
        });

        return db
            .collection('users')
            .updateOne(
                { _id: this._id }, 
                { $set: { cart: { items: updatedItemsCart } } }
            );
    }

    addOrder () {
        const db = getDb();
        return this.getCart()
            .then(products => {
                const order = { 
                    user: {
                        _id: this._id,
                        name: this.name
                    },
                    items: products
                };
                return db.collection('orders').insertOne(order);
            })
            .then(() => {
                this.cart = { items: [] };
                return db
                        .collection('users')
                        .updateOne(
                            { _id: this._id }, 
                            { $set: { cart: { items: [] } } }
                        );
            })
            .catch(err => console.log(err));
    }

    getOrders () {
        const db = getDb();
        return db.collection('orders')
            .find({ 'user._id': this._id })
            .toArray()
            .then((orders) => {
                return orders;
            })
            .catch(err => console.log(err));
    }
};
*/
module.exports = mongoose.model('User', userSchema);