const express = require(`express`);

const router = express.Router();
const statis = require(`../controllers/statis`);
const { auth } = require(`../middleware/jwt/jwt`);

router.route(`/getstatis`).get(auth, statis.getStatisC);

module.exports = router;
