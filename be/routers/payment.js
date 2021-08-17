const express = require(`express`);

const router = express.Router();
const payment = require(`../controllers/payment`);
const { auth } = require(`../middleware/jwt/jwt`);

router.route(`/getpayment`).get(auth, payment.getPaymentC);

module.exports = router;
