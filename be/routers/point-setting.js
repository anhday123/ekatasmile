const express = require(`express`);

const router = express.Router();
const point = require(`../controllers/point-setting`);
const { auth } = require(`../middleware/jwt`);

router.route(`/`).get(auth, point.getSettingC);
router.route(`/update/:point_setting_id`).patch(auth, point.updateSettingC);

module.exports = router;
