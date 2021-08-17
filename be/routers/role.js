const express = require(`express`);

const router = express.Router();
const role = require(`../controllers/role`);
const { auth } = require(`../middleware/jwt/jwt`);

router.route(`/getrole`).get(auth, role.getRoleC);
router.route(`/addrole`).post(auth, role.addRoleC);
router.route(`/updaterole/:role_id`).patch(auth, role.updateRoleC);

module.exports = router;
