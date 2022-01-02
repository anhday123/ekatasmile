const express = require(`express`);

const router = express.Router();
const supplier = require(`../controllers/supplier`);
const { auth } = require(`../middleware/jwt`);

router.route(`/getsupplier`).get(auth, supplier._get);
router.route(`/addsupplier`).post(auth, supplier._create);
router.route(`/updatesupplier/:supplier_id`).patch(auth, supplier._update);
router.route(`/delete`).delete(auth, supplier._delete);

module.exports = router;
