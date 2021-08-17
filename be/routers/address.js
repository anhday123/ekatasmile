const express = require(`express`);

const router = express.Router();
const address = require(`../controllers/address`);

router.route(`/getward`).get(address.getWardC);
router.route(`/getdistrict`).get(address.getDistrictC);
router.route(`/getprovince`).get(address.getProvinceC);

module.exports = router;
