const express = require(`express`);
const router = express.Router();

const auth = require(`../controllers/authorization`);

router.route(`/login`).post(auth._login);
router.route(`/refreshtoken`).post(auth._refreshToken);
router.route(`/checkvertifylink`).post(auth._checkVerifyLink);
router.route(`/getotp`).post(auth._getOTP);
router.route(`/vertifyotp`).post(auth._verifyOTP);

module.exports = router;
