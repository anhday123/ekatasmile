const express = require(`express`);

const router = express.Router();
const shippingCompany = require(`../controllers/shipping-company`);
const { auth } = require(`../middleware/jwt`);

router.route(`/getshippingcompany`).get(auth, shippingCompany.getShippingCompanyC);
router.route(`/addshippingcompany`).post(auth, shippingCompany.addShippingCompanyC);
router.route(`/updateshippingcompany/:shipping_company_id`).patch(auth, shippingCompany.updateShippingCompanyC);
router.route(`/delete`).delete(auth, shippingCompany._delete);

module.exports = router;
