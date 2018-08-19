const db = {
    apiKeys: require('../config/lowdb').apiKeys
}
const axios = require('axios');
const shortid = require('shortid');
const _ = require('lodash');
const router = require("express").Router();

router.post('/', (req, res) => addApiKey(req, res));
router.get('/', (req, res) => getAllApiKeys(req, res));
router.put('/', (req, res) => updateApiKey(req, res));
router.get('/:unique', (req, res) => getApiKey(req, res));
router.delete('/:unique', (req, res) => deleteApiKey(req, res));

function addApiKey(req, res) {

    try {
        db.apiKeys.defaults({ apiKeys: [] })
        .write();

        let unique = req.body.unique ? req.body.unique : shortid.generate();

        db.apiKeys.get('apiKeys')
        .push({
            unique: unique,
            client: req.body.client ? req.body.client : null,
            description: req.body.description ? req.body.description : null,
            disabled: req.body.disabled ? req.body.disabled : false,
            key: req.body.key ? req.body.key : null,
            secret: req.body.secret ? req.body.secret : null,
            username: req.body.username ? req.body.username : (req.body.client ? req.body.client : null),
            lastUpdated: getTime(),
            lastUsed: null
        })
        .write();

        return res.json(unique);
    }
    catch (exception) {
        console.error("Error in addApiKey", exception);
        return res.status(500).json("error")
    }
}

function deleteApiKey(req, res) {
    let unique = req.params.unique;

    if (!unique) {
        return res.status(500).json("unique not supplied");
    }

    try {
        db.apiKeys.get('apiKeys')
        .remove({ unique: unique })
        .write()
    }
    catch (error) {
        console.error("Error in deleteApiKey", exception);
        return res.status(500).json("error")
    }

    return res.json("success");
}

function getAllApiKeys(req, res) {

    if (req.query.filterType != null) {
        return getFilteredApiKeys(req, res);
    }

    return res.json(db.apiKeys.get('apiKeys'));
}

function getApiKey(req, res) {
    let unique = req.params.unique;

    if (!unique) {
        return res.status(500).json("unique not supplied");
    }

    let apiKey = db.apiKeys.get('apiKeys').find({ unique: unique }).value();

    return res.json(apiKey);
}

function updateApiKey(req, res) {
    let unique = req.body.unique;

    if (!unique) {
        return res.status(500).json("unique not supplied");
    }

    let apiKey = db.apiKeys.get('apiKeys').find({ unique: unique }).value();

    if (apiKey) {
        _.forOwn(req.body, function (value, key) {
            if (apiKey.hasOwnProperty(key)) {
                user[key] = req.body[key];
            }
        });

        apiKey.lastUpdated = getTime();

        db.users.get('apiKeys')
        .find({ unique: req.body.unique })
        .assign(apiKey)
        .write();

        return res.status(200).json("success");
    }
    else {
        return res.status(404).json("existing record not found");
    }
}

function getFilteredApiKeys(req, res) {
    let filters = [];
    filters["filterType"] = req.query.filterType;
    filters["key"] = req.query.search;
    filters["client"] = req.query.search;
    filters["secret"] = req.query.search;

    let apiKeys = db.apiKeys.get('apiKeys').value();

    let filteredByKey = [];
    if (filters["key"] != null) {
        filteredByKey = _.filter(apiKeys, function(key) {
            if (key.key.toLowerCase().indexOf(filters["key"].toLowerCase()) == -1) {
                return false;
            }

            return true;
        });
    }

    let filteredByClient = [];
    if (filters["client"]) {
        filteredByClient = _.filter(apiKeys, function(key) {
            if (key.client.toLowerCase().indexOf(filters["client"].toLowerCase()) == -1) {
                return false;
            }

            return true;
        });
    }

    let filteredBySecret = [];
    if (filters["cuisine"]) {
        filteredBySecret = _.filter(apiKeys, function(key) {
            
            if (key.secret.toLowerCase().indexOf(filters["secret"].toLowerCase()) == -1) {
                return false;
            }

            return true;
        });
    }

    let filteredApiKeys = [];

    if (filteredByKey.length > 0) {
        filteredApiKeys = _.union(filteredApiKeys, filteredByKey);
    }

    if (filteredByClient.length > 0) {
        filteredApiKeys = _.union(filteredApiKeys, filteredByClient);
    }

    if (filteredBySecret.length > 0) {
        filteredApiKeys = _.union(filteredApiKeys, filteredBySecret);
    }

    return res.json(filteredApiKeys);
}


function getTime() {
    var date = new Date();
    return date.toISOString();
}

module.exports = router;