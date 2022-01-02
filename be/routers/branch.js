const express = require(`express`);

const router = express.Router();
const branch = require(`../controllers/branch`);
const { auth } = require(`../middleware/jwt`);

router.route(`/addbranch`).post(auth, branch._create);
router.route(`/updatebranch/:branch_id`).patch(auth, branch._update);
router.route(`/getbranch`).get(auth, branch._get);
router.route(`/delete`).delete(auth, branch._delete);

module.exports = router;
