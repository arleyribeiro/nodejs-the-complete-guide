const bcrypt = require('bcryptjs');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const secureRandom = require('secure-random');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'coursenodejstest@gmail.com',
           pass: ''
       }
   });

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
                    req.flash('error', 'Invalid email or password.');
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
    let message = req.flash('error');
    message = message.length > 0 ? message[0] : null;
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message
    });
};

exports. postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.confirmPassword;

    User.findOne({ email: email })
    .then(userDoc => {
        if (userDoc) {
            req.flash('error', 'E-mail exists already pick a different one.');
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
            })
            .catch(err => {
              console.log(err);
            });
    })
    .catch(err => console.log(err));
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

exports. getNewPassword = (req, res, next) => {
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

exports. postNewPassword = (req, res, next) => {
    const userId = req.body.userId;
    const newPassword = req.body.password;
    const passwordToken = req.body.passwordToken;
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
