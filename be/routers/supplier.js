const express = require(`express`);

const router = express.Router();
const supplier = require(`../controllers/supplier`);
const { auth } = require(`../middleware/jwt`);

router.route(`/getsupplier`).get(auth, supplier.getSupplierC);
router.route(`/addsupplier`).post(auth, supplier.addSupplierC);
router.route(`/updatesupplier/:supplier_id`).patch(auth, supplier.updateSupplierC);

module.exports = router;
