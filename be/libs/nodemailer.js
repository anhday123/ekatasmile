let nodemail = require(`nodemailer`);

let transporter = nodemail.createTransport({    
    host: "smtpout.secureserver.net",  
    secure: true,
    secureConnection: false, // TLS requires secureConnection to be false
    tls: {
        ciphers:'SSLv3'
    },
    requireTLS:true,
    port: 465,
    debug: true,
    auth: {
        user: "support@networkdemo.site",
        pass: "u$65lxw0d8" 
    }
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
