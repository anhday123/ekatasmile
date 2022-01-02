const express = require(`express`);

const router = express.Router();
const order = require(`../controllers/order`);
const { auth } = require(`../middleware/jwt`);

router.route(`/create`).post(auth, order.addOrderC);
router.route(`/update/:order_id`).patch(auth, order.updateOrderC);
router.route(`/`).get(auth, order.getOrderC);
router.route('/delete').delete(auth, order._delete);

module.exports = router;
