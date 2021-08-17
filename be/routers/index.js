const express = require(`express`);

const router = express.Router();

router.use(`/authorization`, require(`./authorization`));
router.use(`/address`, require(`./address`));
router.use(`/user`, require(`./user`));
router.use(`/role`, require(`./role`));
router.use(`/permission`, require(`./permission`));
router.use(`/action`, require(`./action`));
router.use(`/customer`, require(`./customer`));
router.use(`/store`, require(`./store`));
router.use(`/branch`, require(`./branch`));
router.use(`/warehouse`, require(`./warehouse`));
router.use(`/supplier`, require(`./supplier`));
router.use(`/product`, require(`./product`));
router.use(`/saleproduct`, require(`./saleproduct`));
router.use(`/category`, require(`./category`));
router.use(`/tax`, require(`./tax`));
router.use(`/warranty`, require(`./warranty`));
router.use(`/promotion`, require(`./promotion`));
router.use(`/payment`, require(`./payment`));
router.use(`/transport`, require(`./transport`));
router.use(`/order`, require(`./order`));
router.use(`/delivery`, require(`./delivery`));

module.exports = router;
