const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const session = require('express-session')

const errorController = require('./controllers/error');
const User = require('./models/user')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ 
        secret: 'my secret but that is not secret', 
        resave: false, 
        saveUninitialized: false
    })
);

app.use((req, res, next) => {
    User.findById('5e981b3639f1061f258aa9ae')
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

const uri = "mongodb+srv://arley:9IaUYwLsVYJVj5RV@cluster0-mhqji.mongodb.net/shop?retryWrites=true&w=majority";
mongoose
    .connect(uri)
    .then(() => {
        User
            .findOne()
            .then(user => {
                if (!user) {
                    const user = new User({
                        name: 'admin',
                        email: 'a@a.com',
                        cart: {
                            items: []
                        }
                    });
                    user.save();
                }
            })
        app.listen(3000);
    })
    .catch(err => console.log(err));