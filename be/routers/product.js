const express = require(`express`);

const router = express.Router();
const product = require(`../controllers/product`);
const { auth } = require(`../middleware/jwt`);

router.route(`/getproduct`).get(auth, product.getProductC);
router.route(`/addproduct`).post(auth, product.addProductC);
router.route(`/updateproduct/:product_id`).patch(auth, product.updateProductC);
router.route(`/getattribute`).get(auth, product.getAllAtttributeC);
router.route(`/addfeddback`).get(auth, product.addFeedbackC);

module.exports = router;
