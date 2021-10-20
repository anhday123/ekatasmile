const moment = require(`moment`);

const mail = require(`./nodemailer`);

let sendOTP = async (email) => {
    let otpCode = String(Math.random()).substr(2, 6);
    await mail.sendMail(
        email,
        `Mã xác thực`,
        `<div>
            Mã xác thực của bạn là:<br/>
            <b>${otpCode}</b><br/>
            Create by Viesoftware.
        </div>`
    );
    return {
        email: email,
        otp_code: otpCode,
    };
};

module.exports = { sendOTP };
