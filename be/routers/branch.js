const express = require(`express`);

const router = express.Router();
const branch = require(`../controllers/branch`);
const { auth } = require(`../middleware/jwt`);

router.route(`/getbranch`).get(auth, branch.getBranchC);
router.route(`/addbranch`).post(auth, branch.addBranchC);
router.route(`/updatebranch/:branch_id`).patch(auth, branch.updateBranchC);
router.route(`/delete`).delete(auth, branch._delete);

module.exports = router;
