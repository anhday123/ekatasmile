const express = require(`express`);

const router = express.Router();
const report = require(`../controllers/report`);
const { auth } = require(`../middleware/jwt`);

router.route(`/input-output-inventory`).get(auth, report._getIOIReport);
router.route(`/inventory`).get(auth, report._getInventoryReport);
// router.route(`/`).get(auth, report._get);

module.exports = router;
