module.exports.getPromotion = [
    `promotion_id`,
    `business_id`,
    `creator_id`,
    `code`,
    `name`,
    `voucher`,
    `seach`,
    `page`,
    `page_size`,
    `today`,
    `yesterday`,
    `this_week`,
    `last_week`,
    `this_month`,
    `last_month`,
    `this_year`,
    `last_year`,
    `from_date`,
    `to_date`,
];

module.exports.addPromotion = [`code`, `name`, `type`, `value`, `limit`];
