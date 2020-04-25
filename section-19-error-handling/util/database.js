const MongoClient = require('mongodb').MongoClient;

let _db;

const mongoConnect = callback => {
    const uri = "mongodb+srv://arley:9IaUYwLsVYJVj5RV@cluster0-mhqji.mongodb.net/shop?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect()
        .then(client => {
            console.log('Connected');
            _db = client.db();
            callback();
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found!'
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;