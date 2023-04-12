// variables for routes
const path = require('path');

const proceedingsRoutes = require('./data');
const challengeRoutes = require('./challenges');
const constructorMethod = (app) => {
    app.use('/data', proceedingsRoutes);
    app.use('/challenge', challengeRoutes);
}

module.exports = constructorMethod;