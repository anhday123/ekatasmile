const express = require(`express`);

const router = express.Router();
const user = require(`../controllers/user`);
const { auth } = require(`../middleware/jwt`);

router.route(`/getuser`).get(auth, user.getUserC);
router.route(`/register`).post(user.registerC);
router.route(`/adduser`).post(auth, user.addUserC);
router.route(`/updateuser/:user_id`).patch(auth, user.updateUserC);
router.route(`/forgotpassword`).post(user.forgotPassword);
router.route(`/delete`).delete(auth, user._delete);

module.exports = router;
