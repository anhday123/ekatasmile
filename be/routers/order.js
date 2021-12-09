const express = require(`express`);

const router = express.Router();
const order = require(`../controllers/order`);
const { auth } = require(`../middleware/jwt`);

router.route(`/getorder`).get(auth, order.getOrderC);
router.route(`/addorder`).post(auth, order.addOrderC);
router.route(`/updateorder/:order_id`).patch(auth, order.updateOrderC);
router.route('/delete').delete(auth, order._delete);

module.exports = router;
