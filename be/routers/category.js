const express = require(`express`);

const router = express.Router();
const category = require(`../controllers/category`);
const { auth } = require(`../middleware/jwt`);

router.route(`/getcategory`).get(auth, category._get);
router.route(`/addcategory`).post(auth, category._create);
router.route(`/updatecategory/:category_id`).patch(auth, category._update);
router.route(`/delete`).delete(auth, category._delete);

module.exports = router;
