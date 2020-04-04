const expresss = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const rootDir = require('./util/path');
const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = expresss();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({extended: false}));
app.use(expresss.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use('/shop', shopRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', {docTitle: 'Page Not Found'});
})

app.listen(3000);