const googlePlaceDetails = require('./google-place-details');

module.exports = function (app, db) {
    googlePlaceDetails(app, db);
    // Other route groups could go here, in the future
};