const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const baseDbPath = "./database";
const apiKeys = low(new FileSync(`${baseDbPath}/api-keys.json`));

module.exports = {
    apiKeys: apiKeys
}