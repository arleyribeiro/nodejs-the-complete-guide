exports. getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
};

exports. postLogin = (req, res, next) => {
    res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');
    res.redirect('/');
};

exports. postLogOut = (req, res, next) => {
    res.setHeader('Set-Cookie', 'loggedIn=false');
    res.redirect('/logout');
}