const express = require(`express`);

const router = express.Router();
const warranty = require(`../controllers/warranty`);
const { auth } = require(`../middleware/jwt`);

router.route(`/getwarranty`).get(auth, warranty.getWarrantyC);
router.route(`/addwarranty`).post(auth, warranty.addWarrantyC);
router.route(`/updatewarranty/:warranty_id`).patch(auth, warranty.updateWarrantyC);
router.route(`/delete`).delete(auth, warranty._delete);

module.exports = router;
