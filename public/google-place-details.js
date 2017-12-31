const axios = require('axios');

module.exports = function (app, db) {
    app.get('/googleplace/:id', (req, res) => getGooglePlaceDetails(req, res));
};

function getGooglePlaceDetails(req, res) {

    axios.get('https://maps.googleapis.com/maps/api/place/details/json?placeid=' + req.params.id + '&key=YOUR_KEY_HERE')
    .then(function (response) {

        switch (response.data.status) {
            case "OK":
                res.send(response.data.result);
                break;
            case "INVALID_REQUEST":
                res.status(400).send("Invalid request!");
                break;
            default:
                res.status(500).send("There was an error!");
                break;
        }        
    })
    .catch(function (error) {
        res.status(500).send("There was an error!")
    });
}