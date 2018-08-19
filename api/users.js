const db = {
    users: require('../config/lowdb').users
}
const axios = require('axios');
const shortid = require('shortid');
const _ = require('lodash');
const router = require("express").Router();

router.get('/roles', (req, res) => getUserRoles(req, res));
router.post('/', (req, res) => addUser(req, res));
router.get('/', (req, res) => getAllUsers(req, res));
router.put('/', (req, res) => updateUser(req, res));
router.get('/:unique', (req, res) => getUser(req, res));
router.delete('/:unique', (req, res) => deleteUser(req, res));

function getAllUsers(req, res) {
    return res.json(db.users.get('users'));
}

function getUserRoles(req, res) {
    let userRoles = db.users.get('roles').value();

    return res.json(userRoles);
}

function updateUser(req, res) {
    let unique = req.body.unique;

    if (!unique) {
        return res.status(500).json("Unique not supplied.");
    }

    let user = db.users.get('users').find({ unique: unique }).value();

    if (user) {
        _.forOwn(req.body, function (value, key) {
            if (user.hasOwnProperty(key)) {
                user[key] = req.body[key];
            }
        });

        db.users.get('users')
        .find({ unique: req.body.unique })
        .assign(user)
        .write();

        return res.status(200).json("updated");
    }
    else {
        return res.status(404).json("existing record not found");
    }
}

function getUser(req, res) {
    let unique = req.params.unique;

    if (!unique) {
        return res.status(500).json("Unique not supplied.");
    }

    let user = db.users.get('users').find({ unique: unique }).value();

    return res.json(user);
}

function addUser(req, res) {

    if (!req.body.username) {
        return res.status(500).json("Username not supplied.")
    }

    try {
        db.users.defaults({ users: [] })
        .write();

        let unique = req.body.unique ? req.body.unique : shortid.generate();

        db.users.get('users')
        .push({
            unique: unique,
            firstName: req.body.firstName ? req.body.firstName : null,
            lastName: req.body.lastName ? req.body.lastName : null,
            nickname: req.body.nickname ? req.body.nickname : `${req.body.firstName} ${req.body.lastName}`,
            username: req.body.username ? req.body.username : null,
            email: req.body.email ? req.body.email : null,
            telephone: req.body.telephone ? req.body.telephone : null,
            password: req.body.password ? req.body.password : `HalalFood2018`,
            city: req.body.city ? req.body.city : null,
            country: req.body.country ? req.body.country : null,
            cards: [],
            paypal: req.body.paypal ? req.body.paypal : null,
            address: req.body.address ? req.body.address : {
                addressLine1: null,
                addressLine2: null,
                town: null,
                city: null,
                state: null,
                country: null,
                deliveryInstructions: null,
                contact: null
            },
            instagram: req.body.instagram ? req.body.instagram : null,
            roles: req.body.roles ? req.body.roles : [],
            verified: req.body.verified ? req.body.verified : false,
            lastUpdated: getTime()
        })
        .write();
        return res.json(unique);
    }
    catch (exception) {
        console.log("Error in addUser", exception);
        return res.status(500).json("There was an error!")
    }

    return res.json("success");
}

function deleteUser(req, res) {
    let unique = req.params.unique;

    if (!unique) {
        return res.status(500).json("Unique not supplied.");
    }

    try {
        db.users.get('users')
        .remove({ unique: unique })
        .write()
    }
    catch (error) {
        console.log("Error in deleteUser", exception);
        return res.status(500).json("There was an error!")
    }

    return res.json("success");
}

function getTime() {
    var date = new Date();
    return date.toUTCString();
}

module.exports = router;