const mongodb = require('mongodb')

const getDb = require('../util/database').getDb;

class User {
    constructor(username, email, id) {
        this.name = username;
        this.email = email;
        this._id = id ? new mongodb.ObjectID(id) : null;
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

    static findById (id) {
        const db = getDb();
        return db.collection('users')
            .findOne({ _id: new mongodb.ObjectID(id) })
            .then(user => {
                return user;
            })
            .catch(err => console.log(err));
    }
};

module.exports = User;