const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
  constructor(title, price, description, imageUrl, id) {
    this._id = id;
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }
  save () {
    const db = getDb();
    let result;
    if (this._id) {
      result = db
                .collection('products')
                .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this });
    } else {
      result = db.collection('products').insertOne(this);
    }
    return result
      .then(product => {
        console.log(product)
      })
      .catch(err => console.log(err));
  }

  static fetchAll () {
    const db = getDb();
    return db.collection('products')
      .find()
      .toArray()
      .then(products => {
        console.log(products)
        return products;
      })
      .catch(err => console.log(err));
  }

  static findById (prodId) {
    const db = getDb();
    return db.collection('products')
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then(product => {
        return product;
      })
      .catch(err => console.log(err));
  }

  static delete (prodId) {
    const db = getDb();
    return db.collection('products')
      .delete({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then(result => {

      })
      .catch(err => console.log(err));
  }

}

module.exports = Product;