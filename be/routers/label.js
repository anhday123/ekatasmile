const express = require(`express`);

const router = express.Router();
const label = require(`../controllers/label`);
const { auth } = require(`../middleware/jwt`);

router.route(`/getlabel`).get(auth, label._get);
router.route(`/addlabel`).post(auth, label._create);
router.route(`/updatelabel/:label_id`).patch(auth, label._update);
router.route(`/delete`).delete(auth, label._delete);

module.exports = router;
