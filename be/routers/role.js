const express = require(`express`);

const router = express.Router();
const role = require(`../controllers/role`);
const { auth } = require(`../middleware/jwt`);

router.route(`/getrole`).get(auth, role._get);
router.route(`/addrole`).post(auth, role._create);
router.route(`/updaterole/:role_id`).patch(auth, role._update);
router.route(`/delete`).delete(auth, role._delete);

module.exports = router;
