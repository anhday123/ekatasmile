const express = require(`express`);

const router = express.Router();
const action = require(`../controllers/action`);
const { auth } = require(`../middleware/jwt`);

router.route(`/getaction`).get(auth, action._get);

module.exports = router;
