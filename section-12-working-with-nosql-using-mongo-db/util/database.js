const MongoClient = require('mongodb').MongoClient;

const mongoConnect = (callback) => {
    const uri = "mongodb+srv://@cluster0-mhqji.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect()
        .then(result => {
            console.log('Connected');
            callback(result);
        })
        .catch(err => console.log(err));
}

module.exports = mongoConnect;