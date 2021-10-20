const express = require(`express`);

const router = express.Router();
const statis = require(`../controllers/statis`);
const { auth } = require(`../middleware/jwt`);

router.route(`/getoverview`).get(auth, statis.getOverviewC);
router.route(`/getinventory`).get(auth, statis.getInventoryC);
router.route(`/getfinance`).get(auth, statis.getFinanceC);

module.exports = router;
