const express = require(`express`);

const router = express.Router();
const report = require(`../controllers/report`);
const { auth } = require(`../middleware/jwt`);

router.route(`/order`).get(auth, report._getOrderReport);
router.route(`/inventory`).get(auth, report._getInventoryReport);
router.route(`/input-output-inventory`).get(auth, report._getIOIReport);

module.exports = router;
