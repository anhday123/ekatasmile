const express = require(`express`);

const router = express.Router();
const label = require(`../controllers/label`);
const { auth } = require(`../middleware/jwt/jwt`);

router.route(`/getlabel`).get(auth, label.getLabelC);
router.route(`/addlabel`).post(auth, label.addLabelC);
router.route(`/updatelabel/:label_id`).patch(auth, label.updateLabelC);

module.exports = router;
