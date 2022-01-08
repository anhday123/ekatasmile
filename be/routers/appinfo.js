const express = require(`express`);

const router = express.Router();
const appInfo = require(`../controllers/appinfo`);
const { auth } = require(`../middleware/jwt`);

router.route(`/`).get(auth, appInfo._getAppInfo);
router.route(`/update`).patch(auth, appInfo._updateAppInfo);
router.route(`/checkdomain`).post(appInfo._checkDomain);

module.exports = router;
