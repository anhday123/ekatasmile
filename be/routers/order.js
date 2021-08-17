const express = require(`express`);

const router = express.Router();
const order = require(`../controllers/order`);
const { auth } = require(`../middleware/jwt/jwt`);

router.route(`/getorder`).get(auth, order.getOrderC);
router.route(`/addorder`).post(auth, order.addOrderC);
router.route(`/updateorder/:order_id`).patch(auth, order.updateOrderC);

module.exports = router;
