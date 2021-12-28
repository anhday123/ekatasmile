const express = require(`express`);

const router = express.Router();
const table = require(`../controllers/table`);
const { auth } = require(`../middleware/jwt`);

router.route(`/gettable`).get(auth, table.getTableC);
router.route(`/addtable`).post(auth, table.addTableC);
router.route(`/updatetable/:table_id`).patch(auth, table.updateTableC);
router.route(`/delete`).delete(auth, table._delete);

module.exports = router;
