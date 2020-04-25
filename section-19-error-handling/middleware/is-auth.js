module.exports = (req, res, next) => {
    console.log("IsAuth req.session.isLoggedIn: ", req.session.isLoggedIn)
    if (!req.session.isLoggedIn) {
        console.log("IsAuth req.session.isLoggedIn: ", req.session.isLoggedIn)
        return res.status(401).redirect('/login');
    }
    next();
}