
// core module
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// custom modules
const rootDir = require('./helper/path');
const routesUsers = require('./routes/users');

const app = express();

// Serving static files in the application that are access public
app.use(express.static(path.join(__dirname, 'public')));

/* Provides the following parsers: JSON, Raw, text and URL-encoded. 
It essentially makes it easier for us to access the Request Body objects, 
especially when it comes to our POST requests. */
app.use(bodyParser.urlencoded({extended: false}))
app.use('/users', routesUsers);


// Routes that no exists return page not found.
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(rootDir, 'views', '404.html'));
})

app.listen(3000);
