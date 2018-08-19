const apiKeys = require('./api-keys');
const router = require("express").Router();
const users = require('./users');

router.use("/api-keys", apiKeys);
router.use("/users", users);

module.exports = router;