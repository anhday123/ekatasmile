const express = require(`express`);

const router = express.Router();
const customer = require(`../controllers/customer`);
const { auth } = require(`../middleware/jwt`);

router.route(`/getdeal`).get(auth, customer.getCustomerC);
router.route(`/adddeal`).post(auth, customer.addCustomerC);
router.route(`/updatedeal/:deal_id`).patch(auth, customer.updateCustomerC);

module.exports = router;
