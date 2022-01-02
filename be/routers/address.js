const express = require(`express`);

const router = express.Router();
const address = require(`../controllers/address`);

router.route(`/getward`).get(address._getWard);
router.route(`/getdistrict`).get(address._getDistrict);
router.route(`/getprovince`).get(address._getProvince);
router.route(`/getcountry`).get(address._getCountry);

module.exports = router;
