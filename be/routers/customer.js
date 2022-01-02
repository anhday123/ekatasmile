const express = require(`express`);

const router = express.Router();
const customer = require(`../controllers/customer`);
const { auth } = require(`../middleware/jwt`);

router.route(`/create`).post(auth, customer._create);
router.route(`/update/:customer_id`).patch(auth, customer._update);
router.route(`/`).get(auth, customer._get);
router.route(`/delete`).delete(auth, customer._delete);

module.exports = router;
