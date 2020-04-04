const path = require('path');

// This property returns an object that contains the reference of main module.
module.exports = path.dirname(process.mainModule.filename);