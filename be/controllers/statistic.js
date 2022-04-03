const moment = require(`moment-timezone`)
const TIMEZONE = process.env.TIMEZONE
const { ObjectId } = require('mongodb')
const crypto = require(`crypto`)
const client = require(`../config/mongodb`)
const DB = process.env.DATABASE
const { stringHandle } = require('../utils/string-handle')

let getOverviewTodayC = async (req, res, next) => {
  try {
    var query = {}
    if (req.query.branch_id == undefined)
      query.branch_id = parseInt(req.query.branch_id)

    var sum_order = await client
      .db(req.user.database)
      .collection('Orders')
      .countDocuments()
    // query branch_id
    // tong don hang
    var to_day = moment().tz(TIMEZONE).hour(0).minutes(0)
    console.log(to_day)
    return res.send({
      success: true,
      data: {
        sum_order: sum_order,
        sum_origin_cost: 100000,
        sum_revenue: 200000,
        sum_profit: 10000,
      },
    })
  } catch (err) {
    next(err)
  }
}

let getChartC = async (req, res, next) => {
  try {
    res.send({
      success: true,
      data: [
        {
          name: '01/04',
          data: 20000,
        },
        {
          name: '02/04',
          data: 20000,
        },
        {
          name: '03/04',
          data: 20000,
        },
        {
          name: '04/04',
          data: 20000,
        },
        {
          name: '05/04',
          data: 20000,
        },
        {
          name: '06/04',
          data: 20000,
        },
      ],
    })
  } catch (err) {
    next(err)
  }
}

let getTopSellC = async (req, res, next) => {
  try {
    let products = await client
      .db(req.user.database)
      .collection('Products')
      .aggregate([
        { $sort: { sale_quantity: -1 } },
        { $skip: 0 },
        { $limit: 10 },
        {
          $project: {
            product_id: 1,
            code: 1,
            sale_quantity: 1,
            name: 1,
            image: 1,
          },
        },
      ])
      .toArray()

    let todayQuery = [
      {
        $match: {
          create_date: {
            $gte: moment().tz(TIMEZONE).startOf(`days`).format(),
            $lte: moment().tz(TIMEZONE).endOf(`days`).format(),
          },
        },
      },
    ]
    let [todayOrders] = await client
      .db(req.user.database)
      .collection('Orders')
      .aggregate([
        ...todayQuery,
        { $match: { bill_status: { $eq: 'COMPLETE' } } },
        {
          $group: {
            _id: { bill_status: '$bill_status' },
            total_quantity: { $sum: 1 },
            total_base_price: {
              $sum: { $sum: '$order_details.total_base_price' },
            },
            total_revenue: { $sum: '$total_cost' },
          },
        },
        {
          $addFields: {
            total_profit: {
              $subtract: ['$total_revenue', '$total_base_price'],
            },
          },
        },
      ])
      .toArray()
    let yesterdayQuery = [
      {
        $match: {
          create_date: {
            $gte: moment()
              .tz(TIMEZONE)
              .startOf(`days`)
              .add(-1, 'days')
              .format(),
            $lte: moment().tz(TIMEZONE).endOf(`days`).add(-1, 'days').format(),
          },
        },
      },
    ]
    let [yesterdayOrders] = await client
      .db(req.user.database)
      .collection('Orders')
      .aggregate([
        ...yesterdayQuery,
        { $match: { bill_status: { $eq: 'COMPLETE' } } },
        {
          $group: {
            _id: { bill_status: '$bill_status' },
            total_quantity: { $sum: 1 },
            total_base_price: {
              $sum: { $sum: '$order_details.total_base_price' },
            },
            total_revenue: { $sum: '$total_cost' },
          },
        },
        {
          $addFields: {
            total_profit: {
              $subtract: ['$total_revenue', '$total_base_price'],
            },
          },
        },
      ])
      .toArray()
    res.send({ success: true, data: products })
  } catch (err) {
    next(err)
  }
}

let getInventoryC = async (req, res, next) => {
  try {
    let token = req.tokenData.data
    let mongoQuery = {}
    // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
    if (token) {
      mongoQuery['business_id'] = token.business_id
    }
    if (req.query.business_id) {
      mongoQuery['business_id'] = req.query.business_id
    }
    // lấy data từ database
    let [branchProducts, storeProducts, stores] = await Promise.all([
      client
        .db(req.user.database)
        .collection('Products')
        .find(mongoQuery)
        .toArray(),
      client
        .db(req.user.database)
        .collection('SaleProducts')
        .find(mongoQuery)
        .toArray(),
      client
        .db(req.user.database)
        .collection('Stores')
        .find(mongoQuery)
        .toArray(),
    ])
    let _stores = {}
    stores.map((store) => {
      _stores[store.store_id] = store
    })
    let allProducts = {}
    branchProducts.map((product) => {
      if (product.has_variable) {
        product.variants.map((variant) => {
          allProducts[variant.sku] = { ...product, ...variant }
          allProducts[variant.sku].has_variable = false
          allProducts[variant.sku].attributes = []
          allProducts[variant.sku].variants = []
        })
      } else {
        allProducts[product.sku] = { ...product }
      }
    })
    storeProducts.map((product) => {
      if (product.has_variable) {
        product.variants.map((variant) => {
          allProducts[variant.sku]['available_stock_quantity'] +=
            variant['available_stock_quantity']
          allProducts[variant.sku]['low_stock_quantity'] +=
            variant['low_stock_quantity']
          allProducts[variant.sku]['out_stock_quantity'] +=
            variant['out_stock_quantity']
          allProducts[variant.sku]['shipping_quantity'] +=
            variant['shipping_quantity']
          allProducts[variant.sku]['return_warehouse_quantity'] +=
            variant['return_warehouse_quantity']
        })
      } else {
        allProducts[product.sku]['available_stock_quantity'] +=
          product['available_stock_quantity']
        allProducts[product.sku]['low_stock_quantity'] +=
          product['low_stock_quantity']
        allProducts[product.sku]['out_stock_quantity'] +=
          product['out_stock_quantity']
        allProducts[product.sku]['shipping_quantity'] +=
          product['shipping_quantity']
        allProducts[product.sku]['return_warehouse_quantity'] +=
          product['return_warehouse_quantity']
      }
    })
    let result = {}
    storeProducts.map((product) => {
      if (!result[product.store_id]) {
        result[product.store_id] = []
      }
      if (result[product.store_id]) {
        if (product.has_variable) {
          product.variants.map((variant) => {
            let data = {
              name: variant.title,
              sku: variant.sku,
              store_product: {
                quantity:
                  variant['available_stock_quantity'] +
                  variant['low_stock_quantity'],
                inventory_value:
                  (variant['available_stock_quantity'] +
                    variant['low_stock_quantity']) *
                  variant.sale_price,
                base_price: variant.base_price,
                rate:
                  ((variant['available_stock_quantity'] +
                    variant['low_stock_quantity']) /
                    (allProducts[variant.sku]['available_stock_quantity'] +
                      allProducts[variant.sku]['low_stock_quantity'])) *
                  100,
              },
              system_product: {
                quantity:
                  allProducts[variant.sku]['available_stock_quantity'] +
                  allProducts[variant.sku]['low_stock_quantity'],
                inventory_value:
                  (allProducts[variant.sku]['available_stock_quantity'] +
                    allProducts[variant.sku]['low_stock_quantity']) *
                  allProducts[variant.sku]['sale_price'],
                base_price: allProducts[variant.sku]['base_price'],
              },
            }
            result[product.store_id].push(data)
          })
        } else {
          let data = {
            name: product.title,
            sku: product.sku,
            store_product: {
              quantity:
                product['available_stock_quantity'] +
                product['low_stock_quantity'],
              inventory_value:
                (product['available_stock_quantity'] +
                  product['low_stock_quantity']) *
                product.sale_price,
              base_price: product.base_price,
              rate:
                ((product['available_stock_quantity'] +
                  product['low_stock_quantity']) /
                  (allProducts[product.sku]['available_stock_quantity'] +
                    allProducts[product.sku]['low_stock_quantity'])) *
                100,
            },
            system_product: {
              quantity:
                allProducts[product.sku]['available_stock_quantity'] +
                allProducts[product.sku]['low_stock_quantity'],
              inventory_value:
                (allProducts[product.sku]['available_stock_quantity'] +
                  allProducts[product.sku]['low_stock_quantity']) *
                allProducts[product.sku]['sale_price'],
              base_price: allProducts[product.sku]['base_price'],
            },
          }
          result[product.store_id].push(data)
        }
      }
    })
    if (req.query.store_id) {
      result = result[req.query.store_id]
      result = result.map((item) => {
        item['store_id'] = req.query.store_id
        item['_store'] = _stores[req.query.store_id]
      })
    } else {
      let tmp = []
      for (let i in result) {
        result[i].map((item) => {
          item['store_id'] = String(i)
          item['_store'] = _stores[String(i)]
          tmp.push(item)
        })
      }
      result = tmp
    }
    res.send({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

let getFinanceC = async (req, res, next) => {
  try {
    await statisService.getStatisS(req, res, next)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getChartC,
  getTopSellC,
  getInventoryC,
  getFinanceC,
  getOverviewTodayC,
}
