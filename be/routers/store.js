const express = require(`express`);

const router = express.Router();
const store = require(`../controllers/store`);
const { auth } = require(`../middleware/jwt`);

router.route(`/getstore`).get(auth, store.getStoreC);
router.route(`/addstore`).post(auth, store.addStoreC);
router.route(`/updatestore/:store_id`).patch(auth, store.updateStoreC);

module.exports = router;
