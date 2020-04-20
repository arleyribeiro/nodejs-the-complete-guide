const User = require('../models/user');

exports. getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
};

exports. postLogin = (req, res, next) => {    
    User.findById('5e981b3639f1061f258aa9ae')
    .then(user => {
        req.session.isLoggedIn = true;
        req.session.user = user;
        res.redirect('/');
    })
    .catch(err => console.log(err));
};

exports. postLogOut = (req, res, next) => {
    req.session.isLoggedIn = false;
    res.redirect('/logout');
}