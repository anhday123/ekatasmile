const express = require(`express`);

const router = express.Router();

router.use(`/authorization`, require(`./authorization`));
router.use(`/address`, require(`./address`));
router.use(`/user`, require(`./user`));
router.use(`/role`, require(`./role`));
router.use(`/action`, require(`./action`));
router.use(`/customer`, require(`./customer`));
router.use(`/branch`, require(`./branch`));
router.use(`/point-setting`, require(`./point-setting`));
router.use(`/store`, require(`./store`));
router.use(`/label`, require(`./label`));
router.use(`/supplier`, require(`./supplier`));
router.use(`/product`, require(`./product`));
router.use(`/topping`, require(`./topping`));
router.use(`/category`, require(`./category`));
router.use(`/tax`, require(`./tax`));
router.use(`/warranty`, require(`./warranty`));
router.use(`/promotion`, require(`./promotion`));
router.use(`/shipping-company`, require(`./shipping-company`));
router.use(`/order`, require(`./order`));
router.use(`/delivery`, require(`./delivery`));
router.use(`/statis`, require(`./statis`));
router.use(`/compare`, require(`./compare`));

module.exports = router;
