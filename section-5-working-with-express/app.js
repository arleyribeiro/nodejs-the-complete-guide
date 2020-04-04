const expresss = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = expresss();

const rootDir = require('./util/path');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({extended: false}));
app.use(expresss.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use('/shop', shopRoutes);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(rootDir, 'views', '404.html'));
})

app.listen(3000);