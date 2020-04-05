const fs = require('fs');
const path = require('path');


const pathFile = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');
module.exports = class Product {
    constructor(title) {
        this.title = title;
    }
    save() {
        console.log('pahtfile: ', pathFile)
        fs.readFile(pathFile, (err, fileContent) => {
            let products = [];
            if (!err) {
                products = JSON.parse(fileContent);
            }
            console.log(err);
            products.push(this);
            fs.writeFile(pathFile, JSON.stringify(products), err => {
                console.log(err);
            });
        });
    }

    static fetchAll(cb) {
        fs.readFile(pathFile, (err, fileContent) => {
            if (err) {
                cb([]);
            }
            if (fileContent)
                cb(JSON.parse(fileContent));
        });
    }
}