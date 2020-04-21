const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports. getLogin = (req, res, next) => {
    let message = req.flash('error');
    message = message.length > 0 ? message[0] : null;
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message
    });
};

exports. postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
    .then(user => {
        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }
        bcrypt.compare(password, user.password)
            .then(doMatch => {
                if (doMatch) {
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    return req.session.save(err => {
                        console.log(err);
                        res.redirect('/');
                    });
                } else {
                    res.redirect('/login');
                }
            })
            .catch(err => { 
                console.log(err);
                res.redirect('/login');
            });
    })
    .catch(err => console.log(err));
};

exports. postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}

exports. getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup'
    });
};

exports. postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.confirmPassword;

    User.findOne({ email: email })
    .then(userDoc => {
        if (userDoc) {
            return res.redirect('/');
        }
        return bcrypt.hash(password, 12)
            .then(hashPassword => {
                const user = new User({
                    email: email,
                    password: hashPassword,
                    cart: { items: [] }
                });
                return user.save();
            })
            .then(user => {
                if (user) {
                    res.redirect('/login')
                }
            });
    })
    .catch(err => console.log(err));
};
