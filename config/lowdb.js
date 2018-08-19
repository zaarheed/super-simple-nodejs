const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const baseDbPath = "./database";
const apiKeys = low(new FileSync(`${baseDbPath}/api-keys.json`));
const users = low(new FileSync(`${baseDbPath}/users.json`));

module.exports = {
    apiKeys: apiKeys,
    users: users
}