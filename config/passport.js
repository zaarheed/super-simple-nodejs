const db = {
    users: require('../config/lowdb').users,
    apiKeys: require('../config/lowdb').apiKeys
}

const _ = require('lodash');
const jwt = require('jsonwebtoken');
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const passportHeaderApiKey = require('passport-headerapikey');
const passport = require('passport');

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
    secretOrKey: 'tasmanianDevil'
}

const apiKeyMiddleware = passport.authenticate('headerapikey', { session: false });
const jwtMiddleware = passport.authenticate('jwt', { session: false });

module.exports = {
    apiKeyStrategy: apiKeyStrategy(),
    jwtStrategy: jwtStrategy(),
    apiKeyMiddleware: apiKeyMiddleware,
    jwtMiddleware: jwtMiddleware,
    jwtSecretOrKey: "tasmanianDevil"
}

function jwtStrategy() {
    let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {

        var users = db.users.get('users').value();

        // usually this would be a database call:
        var user = users[_.findIndex(users, {
            unique: jwt_payload.unique
        })];

        
        if (user) {
            next(null, user);
        } else {
            next(null, false);
        }
    });

    return strategy;
}

function apiKeyStrategy() {
    let strategy = new passportHeaderApiKey.HeaderAPIKeyStrategy({
            header: 'Authorization',
            prefix: 'Api-Key '
        },
        false,
        function (apikey, done) {

            let apiKey = db.apiKeys.get('apiKeys').find({ key: apikey }).value();

            if (!apiKey) { return done(null, false)}

            return done(null, true);
        }
    );

    return strategy;
}