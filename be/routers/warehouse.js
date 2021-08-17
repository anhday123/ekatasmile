const express = require(`express`);

const router = express.Router();
const warehouse = require(`../controllers/warehouse`);
const { auth } = require(`../middleware/jwt/jwt`);

router.route(`/getwarehouse`).get(auth, warehouse.getWarehouseC);
router.route(`/addwarehouse`).post(auth, warehouse.addWarehouseC);
router
    .route(`/updatewarehouse/:warehouse_id`)
    .patch(auth, warehouse.updateWarehouseC);

module.exports = router;
