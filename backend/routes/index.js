// variables for routes
const path = require('path');

const proceedingsRoutes = require('./data');

const constructorMethod = (app) => {
    app.use('/data', proceedingsRoutes);
}

module.exports = constructorMethod;