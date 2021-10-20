const express = require(`express`);

const router = express.Router();
const customer = require(`../controllers/customer`);
const { auth } = require(`../middleware/jwt`);

router.route(`/getcustomer`).get(auth, customer.getCustomerC);
router.route(`/addcustomer`).post(auth, customer.addCustomerC);
router.route(`/updatecustomer/:customer_id`).patch(auth, customer.updateCustomerC);

module.exports = router;
