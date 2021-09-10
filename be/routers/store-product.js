const express = require(`express`);

const router = express.Router();
const sale = require(`../controllers/store-product`);
const { auth } = require(`../middleware/jwt/jwt`);

router.route(`/getproduct`).get(auth, sale.getSaleProductC);
router.route(`/updateproduct/:product_id`).patch(auth, sale.updateSaleProductC);

module.exports = router;
