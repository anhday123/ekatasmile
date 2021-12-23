const express = require(`express`);

const router = express.Router();
const inventory = require(`../controllers/inventory`);
const { auth } = require(`../middleware/jwt`);

const multer = require('multer');
const _storage = multer.memoryStorage();
const upload = multer({ storage: _storage });

router.route(`/import`).get(auth, inventory._getImportOrder);
router.route(`/import/create`).post(auth, inventory._createImportOrder);
router.route(`/import/create/file`).post(auth, upload.single('file'), inventory._createImportOrderFile);
router.route(`/import/update/:order_id`).patch(auth, inventory._updateImportOrder);

router.route(`/transport/file`).post(auth, upload.single('file'), inventory._createTransportOrderFile);

module.exports = router;
