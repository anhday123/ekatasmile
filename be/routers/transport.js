const express = require(`express`);

const router = express.Router();
const transport = require(`../controllers/transport`);
const { auth } = require(`../middleware/jwt/jwt`);

router.route(`/gettransport`).get(auth, transport.getTransportC);
router.route(`/addtransport`).post(auth, transport.addTransportC);
router
    .route(`/updatetransport/:transport_id`)
    .patch(auth, transport.updateTransportC);

module.exports = router;
