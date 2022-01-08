const express = require(`express`);

const router = express.Router();
const appinfo = require(`../controllers/appinfo`);
const { auth } = require(`../middleware/jwt`);

// router.route(`/appinfo`).get(auth, action._get);
router.route(`/checkbusiness`).post(auth, appinfo._get);

module.exports = router;
