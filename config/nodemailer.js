const db = {
    config: require('../config/lowdb').config,
}

const nodemailer = require('nodemailer');

module.exports = {
    send: sendMail()
}

function sendMail(message) {
    console.log("send mail...");
    if (!message) {
        console.log("no message");
        return;
    }

    let transporter = nodemailer.createTransport({
        host: "hostname.com",
        port: 587,
        secure: false, // upgrade later with STARTTLS
        auth: {
            user: "my@hostname.com",
            pass: "Password!"
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: 'my@hostname.com', // sender address
        to: 'to@domain.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
}