const apiKeys = require('./api-keys');
const router = require("express").Router();
const users = require('./users');
const mail = require('./mail');

router.use("/api-keys", apiKeys);
router.use("/users", users);
router.use("/mail", mail);

module.exports = router;