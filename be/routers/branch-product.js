const express = require(`express`);

const router = express.Router();
const product = require(`../controllers/branch-product`);
const { auth } = require(`../middleware/jwt`);

router.route(`/getproduct`).get(auth, product.getProductC);
router.route(`/addproduct`).post(auth, product.addProductC);
router.route(`/updateproduct/:_id`).patch(auth, product.updateProductC);
router.route(`/deleteproduct`).delete(auth, product.deleleProductC);

module.exports = router;
