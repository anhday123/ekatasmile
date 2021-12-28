const express = require(`express`);

const router = express.Router();
const tax = require(`../controllers/tax`);
const { auth } = require(`../middleware/jwt`);

router.route(`/gettax`).get(auth, tax.getTaxC);
router.route(`/addtax`).post(auth, tax.addTaxC);
router.route(`/updatetax/:tax_id`).patch(auth, tax.updateTaxC);
router.route(`/delete`).delete(auth, tax._delete);

module.exports = router;
