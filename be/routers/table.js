const express = require(`express`);

const router = express.Router();
const table = require(`../controllers/table`);
const { auth } = require(`../middleware/jwt`);

router.route(`/gettable`).get(auth, table._get);
router.route(`/addtable`).post(auth, table._create);
router.route(`/updatetable/:table_id`).patch(auth, table._update);
router.route(`/delete`).delete(auth, table._delete);

module.exports = router;
