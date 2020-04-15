const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const errorController = require('./controllers/error');
// const User = require('./models/user')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    /*User.findById('5e9453098af0b4312725d6f3')
    .then(user => {
        req.user = new User(user.name, user.email, user._id, user.cart);
        next();
    })
    .catch(err => console.log(err));*/
    next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

const uri = "mongodb+srv://arley:9IaUYwLsVYJVj5RV@cluster0-mhqji.mongodb.net/shop?retryWrites=true&w=majority";
mongoose
    .connect(uri)
    .then(() => {
        app.listen(3000);
    })
    .catch(err => console.log(err));