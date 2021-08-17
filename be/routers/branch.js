const express = require(`express`);

const router = express.Router();
const branch = require(`../controllers/branch`);
const { auth } = require(`../middleware/jwt/jwt`);

router.route(`/getbranch`).get(auth, branch.getBranchC);
router.route(`/addbranch`).post(auth, branch.addBranchC);
router.route(`/updatebranch/:branch_id`).patch(auth, branch.updateBranchC);

module.exports = router;
