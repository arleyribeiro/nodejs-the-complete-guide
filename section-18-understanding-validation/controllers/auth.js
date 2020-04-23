const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const secureRandom = require('secure-random');
const { validationResult } = require('express-validator');
const { check, body } = require('express-validator')

const User = require('../models/user');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'coursenodejstest@gmail.com',
           pass: ''
       }
   });

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    message = message.length > 0 ? message[0] : null;
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message,
        oldInput: {
            email: "",
            password: ""
        }
    });
};

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    console.log("errors", errors)
    if (!errors.isEmpty()) {
        let errorMessage = {};
        errors.array().forEach(error => {
            errorMessage[error.param] = error.msg;
        })
        console.log("errorMessage", errorMessage)
        return res
                .status(402)
                .render('auth/login', {
                    path: '/login',
                    pageTitle: 'Login',
                    errorMessage: errorMessage,
                    oldInput: {
                        email: email ? email : "",
                        password: password ? password : ""
                    }
                });
    }
 User.findOne({ email: email})
 .then(user => {
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
                req.flash('error', 'Invalid email or password.');
                res.redirect('/login');
            }
        })
        .catch(err => { 
            console.log(err);
            res.redirect('/login');
        });
    })
    .catch(err => { 
        console.log(err);
        res.redirect('/login');
    });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    message = message.length > 0 ? message[0] : null;
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message,
        oldInput: {
            email: "",
            password: "",
            confirmPassword: ""
        }
    });
};

exports.postSignup = (req, res, next) => {
    const { email, password, confirmPassword } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let errorMessage = {};
        errors.array().forEach(error => {
            errorMessage[error.param] = error.msg;
        })
        console.log("errorMessage", errorMessage)
        return res
                .status(402)
                .render('auth/signup', {
                    path: '/signup',
                    pageTitle: 'Signup',
                    errorMessage: errorMessage,
                    oldInput: {
                        email: email,
                        password: password,
                        confirmPassword: confirmPassword
                    }
                });
    }
 
    bcrypt
        .hash(password, 12)
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
                res.redirect('/login');
                return transporter.sendMail({
                    to: email,
                    from: 'coursenodejstest@gmail.com',
                    subject: 'Signup succeeded!',
                    html: '<h1>You successfully signed up!</h1>'
                }, (err, info) => {
                    if (err) {
                        console.log(err);                            
                    } else {
                        console.log(info);
                    }
                });
            }
        });
};

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    message = message.length > 0 ? message[0] : null;
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset password',
        errorMessage: message        
    })
};

exports.postReset = (req, res, next) => {
    const buffer = secureRandom(32, {type: 'Buffer'});
    if (buffer) {
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email  })
            .then((user) => {
                if (!user) {
                    req.flash('error', 'No account with that email found.');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save()
                    .then(result => {
                        res.redirect('/');                    
                        return transporter.sendMail({
                            to: req.body.email,
                            from: 'coursenodejstest@gmail.com',
                            subject: 'Reset!',
                            html: `<p> You required a password reset</p>
                                    <p> Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>`
                        }, (err, info) => {
                            if (err) {
                                console.log(err);                            
                            } else {
                                console.log(info);
                            }
                        });
                    })
            })            
            .catch(err => console.log(err));
    } else {
        return res.redirect('/reset');
    }
};

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
        if (!user) {
            return res.redirect('/');
        }
        let message = req.flash('error');
        message = message.length > 0 ? message[0] : null;
        res.render('auth/new-password', {
            path: '/new-password',
            pageTitle: 'New Password',
            errorMessage: message,
            userId: user._id.toString(),
            passwordToken: token
        });
    })
    .catch(err => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
    const { userId, newPassword, passwordToken } = req.body;

    let resetUser;
    User.findOne({ _id: userId, resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
        resetUser = user;
        return bcrypt.hash(newPassword, 12);
    })
    .then(hashPassword => {
        resetUser.password = hashPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
    })
    .then(() => {
        res.redirect('/login');
    })
    .catch(err => console.log(err));
};

exports.validateSignUp = () => {
    return [
        check('email')
            .isEmail()
            .withMessage("Please enter a valid email.")
            .custom((value, { req }) => {
                return User
                        .findOne({ email: value })
                        .then(userDoc => {
                            if (userDoc) {
                                return Promise.redirect('E-mail exists already pick a different one.');
                            }
                        });
            }),
        body('password',
            'Please enter a password with only numbers and text and at least 5 characters.'
            )
            .isLength({ min: 2})
            .isAlphanumeric(),
        body('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords have to match!')
                }
                return true;
            })
    ];
}

exports.validateLogin = () => {
    return [
        body('email')
            .isEmail()
            .withMessage("Please enter a valid email.")
            .custom((value, { req }) => {
                return User
                        .findOne({ email: value })
                        .then(user => {
                            if (!user) {
                                return Promise.reject('Please enter a valid email.');
                            }
                        });
            }),
            body('password',
            'Please enter a valid password.'
            )
            .isLength({ min: 2})
            .isAlphanumeric()
    ];
}