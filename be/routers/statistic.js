const express = require(`express`)

const router = express.Router()
const statistic = require(`../controllers/statistic`)
const { auth } = require(`../middleware/jwt`)

router.route(`/overview/chart`).get(auth, statistic.getChartC)
router.route(`/overview/top-sell`).get(auth, statistic.getTopSellC)
router.route(`/overview/today`).get(auth, statistic.getOverviewTodayC)
router.route(`/inventory`).get(auth, statistic.getInventoryC)
router.route(`/finance`).get(auth, statistic.getFinanceC)

module.exports = router
