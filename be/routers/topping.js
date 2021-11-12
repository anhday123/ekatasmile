const express = require(`express`);

const router = express.Router();
const topping = require(`../controllers/topping`);
const { auth } = require(`../middleware/jwt`);

router.route(`/gettopping`).get(auth, topping.getToppingC);
router.route(`/addtopping`).post(auth, topping.addToppingC);
router.route(`/updatetopping/:topping_id`).patch(auth, topping.updateToppingC);

module.exports = router;
