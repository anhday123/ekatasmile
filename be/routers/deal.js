const express = require(`express`);

const router = express.Router();
const deal = require(`../controllers/deal`);
const { auth } = require(`../middleware/jwt`);

router.route(`/getdeal`).get(auth, deal._get);
router.route(`/adddeal`).post(auth, deal._create);
router.route(`/updatedeal/:deal_id`).patch(auth, deal._update);
router.route(`/updatesaleofvalue`).patch(auth, deal._updateSaleOff);
router.route(`/delete`).delete(auth, deal._delete);

module.exports = router;
