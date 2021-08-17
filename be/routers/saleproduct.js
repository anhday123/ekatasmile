const express = require(`express`);

const router = express.Router();
const sale = require(`../controllers/saleproduct`);
const { auth } = require(`../middleware/jwt/jwt`);

router.route(`/getsaleproduct`).get(auth, sale.getSaleProductC);
router
    .route(`/updatesaleproduct/:product_id`)
    .patch(auth, sale.updateSaleProductC);

module.exports = router;
