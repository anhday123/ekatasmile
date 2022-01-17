const express = require(`express`);

const router = express.Router();
const setting = require(`../controllers/pointSetting`);
const { auth } = require(`../middleware/jwt`);

router.route(`/`).get(auth, setting._get);
router.route(`/create`).post(auth, setting._create);
router.route(`/update/:point_setting_id`).patch(auth, setting._update);
router.route(`/delete`).patch(auth, setting._delete);

module.exports = router;
