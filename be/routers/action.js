const express = require(`express`);

const router = express.Router();
const action = require(`../controllers/action`);
const { auth } = require(`../middleware/jwt/jwt`);

router.route(`/getaction`).get(auth, action.getActionC);

module.exports = router;
