const express = require(`express`);

const router = express.Router();
const product = require(`../controllers/product`);
const { auth } = require(`../middleware/jwt`);

const multer = require('multer');
const _storage = multer.memoryStorage();
const upload = multer({ storage: _storage });

router.route(`/getproduct`).get(auth, product.getProductC);
router.route(`/addproduct`).post(auth, product.addProductC);
router.route(`/updateproduct/:product_id`).patch(auth, product.updateProductC);
router.route(`/getattribute`).get(auth, product.getAllAtttributeC);
router.route(`/addfeedback`).post(auth, product.addFeedbackC);
router.route(`/importfile`).post(auth, upload.single('file'), product.importFileC);

module.exports = router;
