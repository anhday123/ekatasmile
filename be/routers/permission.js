const express = require(`express`);

const router = express.Router();
const permission = require(`../controllers/permission`);
const { auth } = require(`../middleware/jwt/jwt`);

router.route(`/getpermission`).get(auth, permission.getPermissionC);
router.route(`/addpermission`).post(auth, permission.addPermissionC);
router.route(`/getmenu`).get(auth, permission.getMenuC);
router.route(`/addmenu`).post(auth, permission.addMenuC);

module.exports = router;
