const express = require(`express`);

const router = express.Router();
const order = require(`../controllers/order`);
const { auth } = require(`../middleware/jwt`);

router.route(`/getorder`).get(auth, order.getOrderC);
router.route(`/addorder`).post(auth, order.addOrderC);
router.route(`/enum/status/create`).post(auth, order.createStatusOrderC);
router.route(`/enum/status`).get(auth, order.getAllStatusOrderC);
router.route(`/enum/reasonrefund/create`).post(auth, order.createReasonRefundOrderC);
router.route(`/enum/reasonrefund`).get(auth, order.getAllReasonRefundOrderC);
router.route(`/updateorder/:order_id`).patch(auth, order.updateOrderC);
router.route('/delete').delete(auth, order._delete);

module.exports = router;
