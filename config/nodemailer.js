const nodemailer = require('nodemailer');

module.exports = {
    send: sendMail()
}

function sendMail(message) {
    
    if (!message) {
        return;
    }

    let transporter = nodemailer.createTransport({
        host: "hostname.com",
        port: 587,
        secure: false,
        auth: {
            user: "my@hostname.com",
            pass: "Password!"
        }
    });
    
    let mailOptions = {
        from: 'my@hostname.com',
        to: message.to,
        subject: message.subject,
        text: message.text,
        html: message.html
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
    });
}