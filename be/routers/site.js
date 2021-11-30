const express = require(`express`);

const router = express.Router();
const site = require(`../controllers/site`);
const { auth } = require(`../middleware/jwt`);

router.route(`/`).get(auth, site._get);
router.route(`/create`).post(auth, site._create);
router.route(`/update/:site_id`).patch(auth, site._update);
router.route(`/delete`).delete(auth, site._delete);

module.exports = router;
