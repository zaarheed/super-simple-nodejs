const router = require("express").Router();
const mailer = require('../config/nodemailer');

router.post('/', (req, res) => sendMail(req, res));
router.get('/', (req, res) => sendMail(req, res));

function sendMail(req, res) {
    console.log("send mail executed");
    mailer.send();
}

module.exports = router;