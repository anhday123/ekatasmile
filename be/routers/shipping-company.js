const express = require(`express`);

const router = express.Router();
const shippingCompany = require(`../controllers/shipping-company`);
const { auth } = require(`../middleware/jwt`);

router.route(`/create`).post(auth, shippingCompany._create);
router.route(`/update/:shipping_company_id`).patch(auth, shippingCompany._update);
router.route(`/`).get(auth, shippingCompany._get);
router.route(`/delete`).delete(auth, shippingCompany._delete);

module.exports = router;
