const express = require(`express`);

const router = express.Router();
const statistic = require(`../controllers/statistic`);
const { auth } = require(`../middleware/jwt`);

router.route(`/overview`).get(auth, statistic.getOverviewC);
router.route(`/inventory`).get(auth, statistic.getInventoryC);
router.route(`/finance`).get(auth, statistic.getFinanceC);

module.exports = router;
