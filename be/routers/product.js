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
router.route(`/deleteproduct`).delete(auth, product.deleteProductC);
router.route(`/getattribute`).get(auth, product.getAllAtttributeC);
router.route(`/unit`).get(auth, product.getAllUnitProductC);
router.route(`/unit/add`).post(auth, product.AddUnitProductC);
router.route(`/addfeedback`).post(auth, product.addFeedbackC);
router.route(`/deletefeedback`).delete(auth, product.deleteFeedbackC);
router.route(`/importfile`).post(auth, upload.single('file'), product.importFileC);

module.exports = router;
