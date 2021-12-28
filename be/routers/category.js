const express = require(`express`);

const router = express.Router();
const category = require(`../controllers/category`);
const { auth } = require(`../middleware/jwt`);

router.route(`/getcategory`).get(auth, category.getCategoryC);
router.route(`/addcategory`).post(auth, category.addCategoryC);
router.route(`/updatecategory/:category_id`).patch(auth, category.updateCategoryC);
router.route(`/delete`).delete(auth, category._delete);

module.exports = router;
