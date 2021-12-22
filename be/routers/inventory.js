const express = require(`express`);

const router = express.Router();
const inventory = require(`../controllers/inventory`);
const { auth } = require(`../middleware/jwt`);

const multer = require('multer');
const _storage = multer.memoryStorage();
const upload = multer({ storage: _storage });

router.route(`/import`).post(auth, inventory._importOrder);
router.route(`/import/file`).post(auth, upload.single('file'), inventory._importOrderFile);
router.route(`/transport/file`).post(auth, upload.single('file'), inventory._transportOrderFile);

module.exports = router;
