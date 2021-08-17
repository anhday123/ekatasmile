let nodemail = require(`nodemailer`);

let transporter = nodemail.createTransport({
    host: `smtp.gmail.com`,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
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

module.exports = { sendMail };
