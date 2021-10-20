const express = require(`express`);

const router = express.Router();
const sale = require(`../controllers/store-product`);
const { auth } = require(`../middleware/jwt`);

router.route(`/getproduct`).get(auth, sale.getSaleProductC);
router.route(`/updateproduct/:product_id`).patch(auth, sale.updateSaleProductC);
router.route(`/deleteproduct`).delete(auth, sale.deleleProductC);

module.exports = router;
