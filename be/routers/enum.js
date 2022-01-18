const express = require(`express`);

const router = express.Router();
const _enum = require(`../controllers/enum`);
const { auth } = require(`../middleware/jwt`);

router.route(`/order`).get(auth, _enum._getEnumOrderStatus);
router.route(`/payment`).get(auth, _enum._getEnumPaymentStatus);
router.route(`/shipping`).get(auth, _enum._getEnumShippingStatus);
router.route(`/importorder`).get(auth, _enum._getEnumImportOrderStatus);
router.route(`/transportorder`).get(auth, _enum._getEnumTransportOrderStatus);

module.exports = router;
