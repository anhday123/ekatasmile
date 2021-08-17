const express = require(`express`);

const router = express.Router();
const warranty = require(`../controllers/warranty`);
const { auth } = require(`../middleware/jwt/jwt`);

router.route(`/getwarranty`).get(auth, warranty.getWarrantyC);
router.route(`/addwarranty`).post(auth, warranty.addWarrantyC);
router
    .route(`/updatewarranty/:warranty_id`)
    .patch(auth, warranty.updateWarrantyC);

module.exports = router;
