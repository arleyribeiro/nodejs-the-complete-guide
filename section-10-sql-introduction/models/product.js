const db = require('../util/database');
const Cart = require('./cart');

const fetchAllSql = 'SELECT * FROM products';
const findByIdSql = 'SELECT * FROM products WHERE products.id = ?';
const deleteByIdSql = '';
const saveSql = 'INSERT INTO node_complete.products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)';

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id,
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute(saveSql, [this.title, this.price, this.description, this.imageUrl]);
  }

  static fetchAll() {
    return db.execute(fetchAllSql);
  }

  static findById(id) {
    return db.execute(findByIdSql, [id]);
  }

  static deleteById(id) {
    return db.execute(deleteByIdSql);
  }
};
