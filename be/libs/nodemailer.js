const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
var path = require('path');
let nodemailer = require(`nodemailer`);
require('dotenv').config();
let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendMail = (address, subject, content) => {
    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: address,
        subject: subject,
        html: content,
    };
    return transporter.sendMail(mailOptions);
};

const sendMailThanksOrder = async (address, content, business_name) => {
    var buffer = await readFile(path.join(__dirname, '../templates_mail/order.html'), 'utf8');
    var contentMail = buffer.toString();
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: address,
        subject: content,
        html: contentMail,
    });
};

module.exports = { sendMail, sendMailThanksOrder };
