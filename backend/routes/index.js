// variables for routes
const path = require('path');

// const frontendRoute = require('../../frontend/build');
const proceedingsRoutes = require('./proceedings');
// const mailingRoutes = require('./mailingList');

const constructorMethod = (app) => {
    // app.use('/home', proceedingsRoutes);
    // app.use('/committee', proceedingsRoutes);
    app.use('/proceedings', proceedingsRoutes);
    // app.use('/mailing_list', mailingRoutes);
    
    // app.use('*', (req, res) => {
    //     res.sendStatus(404);
    // });
}

module.exports = constructorMethod;