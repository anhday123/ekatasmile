const express = require(`express`);

const router = express.Router();
const promotion = require(`../controllers/promotion`);
const { auth } = require(`../middleware/jwt/jwt`);

router.route(`/getpromotion`).get(auth, promotion.getPromotionC);
router.route(`/addpromotion`).post(auth, promotion.addPromotionC);
router
    .route(`/updatepromotion/:promotion_id`)
    .patch(auth, promotion.updatePromotionC);
router.route(`/usevoucher`).post(auth, promotion.useVoucherC);

module.exports = router;
