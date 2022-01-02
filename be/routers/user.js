const express = require(`express`);

const router = express.Router();
const user = require(`../controllers/user`);
const { auth } = require(`../middleware/jwt`);

router.route(`/getuser`).get(auth, user._get);
router.route(`/register`).post(user._register);
router.route(`/adduser`).post(auth, user._create);
router.route(`/updateuser/:user_id`).patch(auth, user._update);
// router.route(`/forgotpassword`).post(user.forgotPassword);
router.route(`/delete`).delete(auth, user._delete);

module.exports = router;
