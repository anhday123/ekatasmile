const express = require(`express`);

const router = express.Router();
const delivery = require(`../controllers/deliverynote`);
const { auth } = require(`../middleware/jwt`);

router.route(`/getdelivery`).get(auth, delivery.getDeliveryC);
router.route(`/adddelivery`).post(auth, delivery.addDeliveryC);
router.route(`/updatedelivery/:delivery_id`).patch(auth, delivery.updateDeliveryC);

module.exports = router;
