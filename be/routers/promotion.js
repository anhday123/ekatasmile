const express = require(`express`);

const router = express.Router();
const promotion = require(`../controllers/promotion`);
const { auth } = require(`../middleware/jwt`);

router.route(`/getpromotion`).get(auth, promotion._get);
router.route(`/addpromotion`).post(auth, promotion._create);
router.route(`/updatepromotion/:promotion_id`).patch(auth, promotion._update);
router.route(`/checkvoucher`).post(auth, promotion._checkVoucher);
router.route(`/delete`).delete(auth, promotion._delete);

module.exports = router;
