const express = require(`express`);

const router = express.Router();
const tax = require(`../controllers/tax`);
const { auth } = require(`../middleware/jwt`);

router.route(`/gettax`).get(auth, tax._get);
router.route(`/addtax`).post(auth, tax._create);
router.route(`/updatetax/:tax_id`).patch(auth, tax._update);
router.route(`/delete`).delete(auth, tax._delete);

module.exports = router;
