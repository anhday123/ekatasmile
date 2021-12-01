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
router.use(`/deal`, require(`./deal`));
router.use(`/label`, require(`./label`));
router.use(`/blog`, require(`./blog`));
router.use(`/table`, require(`./table`));
router.use(`/supplier`, require(`./supplier`));
router.use(`/product`, require(`./product`));
router.use(`/brand`, require(`./brand`));
router.use(`/deal`, require(`./deal`));
router.use(`/topping`, require(`./topping`));
router.use(`/category`, require(`./category`));
router.use(`/tax`, require(`./tax`));
router.use(`/warranty`, require(`./warranty`));
router.use(`/promotion`, require(`./promotion`));
router.use(`/shippingcompany`, require(`./shipping-company`));
router.use(`/order`, require(`./order`));
router.use(`/delivery`, require(`./delivery`));
router.use(`/statis`, require(`./statis`));
router.use(`/compare`, require(`./compare`));
router.use(`/channel`, require(`./channel`));
router.use(`/upload`, require(`./upload`));

module.exports = router;
