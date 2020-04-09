const db = require('../util/database');
const Cart = require('./cart');

const fetchAllSql = 'SELECT * FROM products';
const saveSql = '';
const findByIdSql = '';
const deleteByIdSql = '';

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id,
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute(saveSql);
  }

  static fetchAll() {
    return db.execute(fetchAllSql);
  }

  static findById(id) {
    return db.execute(findByIdSql);
  }

  static deleteById(id) {
    return db.execute(deleteByIdSql);
  }
};
