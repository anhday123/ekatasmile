const express = require(`express`);

const router = express.Router();
const address = require(`../controllers/address`);

router.route(`/getward`).get(address.getWardC);
router.route(`/getdistrict`).get(address.getDistrictC);
router.route(`/getprovince`).get(address.getProvinceC);
router.route(`/getcountry`).get(address.getCountryC);

module.exports = router;
