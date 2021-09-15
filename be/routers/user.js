const express = require(`express`);

const router = express.Router();
const user = require(`../controllers/user`);
const { auth } = require(`../middleware/jwt/jwt`);
const { otp } = require(`../middleware/otp/otp`);

router.route(`/getuser`).get(auth, user.getUserC);
router.route(`/register`).post(user.registerC);
router.route(`/adduser`).post(auth, user.addUserC);
router.route(`/updateuser/:user_id`).patch(auth, user.updateUserC);
router.route(`/activeuser`).post(otp, user.activeUser);
router.route(`/forgotpassword`).post(otp, user.forgotPassword);
router.route(`/deleteuser`).delete(otp, user.deleleUserC);

module.exports = router;
