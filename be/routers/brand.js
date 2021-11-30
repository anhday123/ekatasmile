const express = require(`express`);

const router = express.Router();
const brand = require(`../controllers/brand`);
const { auth } = require(`../middleware/jwt`);

router.route(`/create`).post(auth, brand.createBrandC);
router.route(`/update/:brand_id`).patch(auth, brand.updateBrandC);
router.route(`/`).get(auth, brand.getBrandC);
router.route(`/delete`).delete(auth, brand.deleteBrandC);

module.exports = router;
