const express = require(`express`);

const router = express.Router();

const auth = require(`../controllers/authorization`);

router.route(`/login`).post(auth.loginC);
router.route(`/refreshtoken`).post(auth.refreshTokenC);
router.route(`/checkvertifylink`).post(auth.checkLinkVertifyC);
router.route(`/getotp`).post(auth.getOTPC);
router.route(`/vertifyotp`).post(auth.vertifyOTPC);

module.exports = router;
