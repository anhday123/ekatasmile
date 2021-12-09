const express = require(`express`);

const router = express.Router();
const deal = require(`../controllers/deal`);
const { auth } = require(`../middleware/jwt`);

router.route(`/getdeal`).get(auth, deal.getDealC);
router.route(`/adddeal`).post(auth, deal.addDealC);
router.route(`/updatedeal/:deal_id`).patch(auth, deal.updateDealC);
router.route(`/updatesaleofvalue`).patch(auth, deal.updateSaleOff);
router.route(`/deletedeal`).delete(auth, deal.deleteDealC);

module.exports = router;
