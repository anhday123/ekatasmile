const moment = require(`moment-timezone`)
const TIMEZONE = process.env.TIMEZONE
const client = require(`../config/mongodb`)
const DB = process.env.DATABASE

const productService = require(`../services/product`)

const XLSX = require('xlsx')

let removeUnicode = (text, removeSpace) => {
  /*
        string là chuỗi cần remove unicode
        trả về chuỗi ko dấu tiếng việt ko khoảng trắng
    */
  if (typeof text != 'string') {
    throw new Error('Type of text input must be string!')
  }
  if (removeSpace && typeof removeSpace != 'boolean') {
    throw new Error('Type of removeSpace input must be boolean!')
  }
  text = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
  if (removeSpace) {
    text = text.replace(/\s/g, '')
  }
  return text
}

module.exports._get = async (req, res, next) => {
  try {
    await productService._get(req, res, next)
  } catch (err) {
    next(err)
  }
}

module.exports._create = async (req, res, next) => {
  try {
    ;['products'].map((e) => {
      if (!req.body[e]) {
        throw new Error(`400: Thiếu thuộc tính ${e}!`)
      }
    })
    ;[req.body] = req.body.products
    let [productMaxId, attributeMaxId, variantMaxId, supplier] =
      await Promise.all([
        client
          .db(req.user.database)
          .collection('AppSetting')
          .findOne({ name: 'Products' }),
        client
          .db(req.user.database)
          .collection('AppSetting')
          .findOne({ name: 'Attributes' }),
        client
          .db(req.user.database)
          .collection('AppSetting')
          .findOne({ name: 'Variants' }),
        client
          .db(req.user.database)
          .collection('Suppliers')
          .findOne({ supplier_id: Number(req.body.supplier_id) }),
      ]).catch((err) => {
        throw new Error(err.message)
      })
    let productId = (() => {
      if (productMaxId && productMaxId.value) {
        return productMaxId.value
      }
      return 0
    })()
    let attributeId = (() => {
      if (attributeMaxId && attributeMaxId.value) {
        return attributeMaxId.value
      }
      return 0
    })()
    let variantId = (() => {
      if (variantMaxId && variantMaxId.value) {
        return variantMaxId.value
      }
      return 0
    })()
    productId++
    req['_product'] = {
      product_id: productId,
      code: String(productId).padStart(6, '0'),
      sku: req.body.sku,
      name: String(req.body.name).toUpperCase(),
      slug: removeUnicode(String(req.body.name), false)
        .toLowerCase()
        .replace(/\s/gi, '-'),
      supplier_id: req.body.supplier_id || [],
      category_id: req.body.category_id || [],
      tax_id: req.body.tax_id || [],
      warranties: req.body.warranties || [],
      length: req.body.length || 0,
      width: req.body.width || 0,
      height: req.body.height || 0,
      weight: req.body.weight || 0,
      unit: req.body.unit || '',
      brand_id: req.body.brand_id || '',
      origin_code: req.body.origin_code || '',
      status: req.body.status || '',
      description: req.body.description || '',
      tags: req.body.tags || [],
      files: req.body.files || [],
      sale_quantity: req.body.sale_quantity || 0,
      create_date: moment().tz(TIMEZONE).format(),
      creator_id: req.user.user_id,
      last_update: moment().tz(TIMEZONE).format(),
      updater_id: req.user.user_id,
      active: false,
      slug_name: removeUnicode(String(req.body.name), true).toLowerCase(),
      slug_tags: (() => {
        if (req.body.tags) {
          req.body.tags.map((tag) => {
            return removeUnicode(String(tag), true).toLowerCase()
          })
        }
        return []
      })(),
    }
    req['_attributes'] = []
    req.body.attributes.map((eAttribute) => {
      if (eAttribute) {
        attributeId++
        req._attributes.push({
          product_id: Number(productId),
          attribute_id: Number(attributeId),
          code: String(attributeId).padStart(6, '0'),
          option: eAttribute.option,
          values: eAttribute.values,
          create_date: moment().tz(TIMEZONE).format(),
          creator_id: req.user.user_id,
          last_update: moment().tz(TIMEZONE).format(),
          updater_id: req.user.user_id,
          active: true,
          slug_option: removeUnicode(
            String(eAttribute.option),
            true
          ).toLowerCase(),
          slug_values: (() => {
            return eAttribute.values.map((eValue) => {
              return removeUnicode(String(eValue), true).toLowerCase()
            })
          })(),
        })
      }
    })
    req['_variants'] = []
    req.body.variants.map((eVariant) => {
      if (eVariant) {
        variantId++
        req._variants.push({
          variant_id: Number(variantId),
          code: String(variantId).padStart(6, '0'),
          product_id: Number(productId),
          title: String(eVariant.title).toUpperCase(),
          sku: String(eVariant.sku).toUpperCase(),
          image: eVariant.image || [],
          options: eVariant.options || [],
          ...(() => {
            if (eVariant.options && eVariant.options > 0) {
              let options = {}
              for (let i = 0; i <= eVariant.options; i++) {
                options[`option${i + 1}`] = eVariant.options[i]
              }
              return options
            }
            return {}
          })(),
          supplier: ((supplier) => {
            if (supplier && supplier.name) {
              return supplier.name
            }
            return ''
          })(supplier),
          import_price_default: eVariant.import_price || 0,
          price: eVariant.price,
          enable_bulk_price: eVariant.enable_bulk_price || false,
          bulk_prices: eVariant.bulk_prices,
          create_date: moment().tz(TIMEZONE).format(),
          last_update: moment().tz(TIMEZONE).format(),
          creator_id: Number(req.user.user_id),
          active: true,
          slug_title: removeUnicode(String(eVariant.title), true).toLowerCase(),
        })
      }
    })
    await Promise.all([
      client
        .db(req.user.database)
        .collection('AppSetting')
        .updateOne(
          { name: 'Products' },
          { $set: { name: 'Products', value: productId } },
          { upsert: true }
        ),
      client
        .db(req.user.database)
        .collection('AppSetting')
        .updateOne(
          { name: 'Attributes' },
          { $set: { name: 'Attributes', value: attributeId } },
          { upsert: true }
        ),
      client
        .db(req.user.database)
        .collection('AppSetting')
        .updateOne(
          { name: 'Variants' },
          { $set: { name: 'Variants', value: variantId } },
          { upsert: true }
        ),
    ])
    await productService._create(req, res, next)
  } catch (err) {
    next(err)
  }
}

module.exports._update = async (req, res, next) => {
  try {
    req.params.product_id = Number(req.params.product_id)
    let [product] = await client
      .db(req.user.database)
      .collection('Products')
      .aggregate([
        { $match: { product_id: Number(req.params.product_id) } },
        {
          $lookup: {
            from: 'Attributes',
            let: { productId: '$product_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$product_id', '$$productId'] } } },
            ],
            as: 'attributes',
          },
        },
        {
          $lookup: {
            from: 'Variants',
            let: { productId: '$product_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$product_id', '$$productId'] } } },
            ],
            as: 'variants',
          },
        },
      ])
      .toArray()
    let [attribute_id, variant_id] = await Promise.all([
      client
        .db(req.user.database)
        .collection('AppSetting')
        .findOne({ name: 'Attributes' })
        .then((doc) => {
          if (doc && doc.value) {
            return doc.value
          }
          return 0
        }),
      client
        .db(req.user.database)
        .collection('AppSetting')
        .findOne({ name: 'Variants' })
        .then((doc) => {
          if (doc && doc.value) {
            return doc.value
          }
          return 0
        }),
    ]).catch((err) => {
      throw new Error(err.message)
    })
    delete req.body._id
    delete req.body.product_id
    delete req.body.code
    delete req.body.sale_quantity
    delete req.body.create_date
    delete req.body.creator_id
    let _product = { ...product, ...req.body }
    _product = {
      product_id: _product.product_id,
      code: _product.code || String(_product.product_id).padStart(6, '0'),
      name: String(_product.name).toUpperCase(),
      sku: String(_product.sku).toUpperCase(),
      slug: removeUnicode(String(_product.name || ''), false).replace(
        /\s/g,
        '-'
      ),
      supplier_id: _product.supplier_id || 0,
      category_id: _product.category_id || [],
      tax_id: _product.tax_id || [],
      warranties: _product.warranties || [],
      image: _product.image || [],
      length: _product.length || 0,
      width: _product.width || 0,
      height: _product.height || 0,
      weight: _product.weight || 0,
      unit: _product.unit || '',
      brand_id: _product.brand_id || 0,
      origin_code: _product.origin_code || '',
      status: _product.status || '',
      description: _product.description || '',
      tags: _product.tags || [],
      files: _product.files || [],
      sale_quantity: _product.sale_quantity || 0,
      create_date: _product.create_date,
      last_update: moment().tz(TIMEZONE).format(),
      creator_id: _product.creator_id,
      active: _product.active,
      slug_name: removeUnicode(String(_product.name || ''), true).toLowerCase(),
      slug_tags: (() => {
        if (_product.tags) {
          return _product.tags.map((tag) => {
            return removeUnicode(String(tag), true).toLowerCase()
          })
        }
      })(),
    }
    req['_product'] = _product
    let _attributes = []
    if (!req.body.attributes) {
      req.body.attributes = []
    }
    req.body.attributes.map((eAttribute) => {
      let exists = false
      for (let i in product.attributes) {
        if (
          String(eAttribute.option).toUpperCase() ==
          String(product.attributes[i].option).toUpperCase()
        ) {
          exists = true
          delete eAttribute._id
          delete eAttribute.attribute_id
          delete eAttribute.product_id
          delete eAttribute.create_date
          delete eAttribute.creator_id
          let _attribute = { ...product.attributes[i], ...eAttribute }
          _attribute = {
            attribute_id: _attribute.attribute_id,
            product_id: _attribute.product_id,
            option: String(_attribute.option).toUpperCase(),
            values: (() => {
              return _attribute.values.map((eValue) => {
                return String(eValue).toUpperCase()
              })
            })(),
            create_date: _attribute.create_date,
            last_update: moment().tz(TIMEZONE).format(),
            creator_id: _attribute.creator_id,
            active: _attribute.active,
            slug_option: removeUnicode(
              String(_attribute.option),
              true
            ).toLowerCase(),
            slug_values: (() => {
              return _attribute.values.map((eValue) => {
                return removeUnicode(String(eValue), true).toLowerCase()
              })
            })(),
          }
          _attributes.push(_attribute)
        }
      }
      if (!exists) {
        attribute_id++
        let _attribute = {
          attribute_id: attribute_id,
          product_id: _product.product_id,
          option: String(eAttribute.option).toUpperCase(),
          values: (() => {
            return eAttribute.values.map((eValue) => {
              return String(eValue).toUpperCase()
            })
          })(),
          create_date: moment().tz(TIMEZONE).format(),
          last_update: moment().tz(TIMEZONE).format(),
          creator_id: Number(req.user.user_id),
          active: true,
          slug_option: removeUnicode(
            String(eAttribute.option),
            true
          ).toLowerCase(),
          slug_values: (() => {
            return eAttribute.values.map((eValue) => {
              return removeUnicode(String(eValue), true).toLowerCase()
            })
          })(),
        }
        _attributes.push(_attribute)
      }
    })
    req['_attributes'] = _attributes
    let _variants = []
    if (!req.body.variants) {
      req.body.variants = []
    }
    req.body.variants.map((eVariant) => {
      let exists = false
      for (let i in product.variants) {
        if (
          String(eVariant.sku).toUpperCase() ==
          String(product.variants[i].sku).toUpperCase()
        ) {
          exists = true
          delete eVariant._id
          delete eVariant.variant_id
          delete eVariant.product_id
          delete eVariant.create_date
          delete eVariant.creator_id
          let _variant = { ...product.variants[i], ...eVariant }
          _variant = {
            variant_id: Number(_variant.variant_id),
            product_id: Number(_variant.product_id),
            title: String(_variant.title).toUpperCase(),
            sku: String(_variant.sku).toUpperCase(),
            image: _variant.image || [],
            options: _variant.options || [],
            ...(() => {
              if (_variant.options && _variant.options > 0) {
                let options = {}
                for (let i = 0; i <= _variant.options; i++) {
                  options[`option${i + 1}`] = _variant.options[i]
                }
                return options
              }
              return {}
            })(),
            supplier: ((supplier) => {
              if (supplier && supplier.name) {
                return supplier.name
              }
              return ''
            })(),
            import_price_default: _variant.import_price || 0,
            price: _variant.price,
            enable_bulk_price: _variant.enable_bulk_price || false,
            bulk_prices: _variant.bulk_prices,
            create_date: moment().tz(TIMEZONE).format(),
            last_update: moment().tz(TIMEZONE).format(),
            creator_id: Number(req.user.user_id),
            active: true,
            slug_title: removeUnicode(
              String(_variant.title),
              true
            ).toLowerCase(),
          }
          _variants.push(_variant)
        }
      }
      if (!exists) {
        variant_id++
        let _variant = {
          variant_id: Number(variant_id),
          product_id: Number(_product.product_id),
          title: String(eVariant.title).toUpperCase(),
          sku: String(eVariant.sku).toUpperCase(),
          image: eVariant.image || [],
          options: eVariant.options || [],
          ...(() => {
            if (eVariant.options && eVariant.options > 0) {
              let options = {}
              for (let i = 0; i <= eVariant.options; i++) {
                options[`option${i + 1}`] = eVariant.options[i]
              }
              return options
            }
            return {}
          })(),
          supplier: ((supplier) => {
            if (supplier && supplier.name) {
              return supplier.name
            }
            return ''
          })(supplier),
          import_price_default: eVariant.import_price || 0,
          price: eVariant.price,
          enable_bulk_price: eVariant.enable_bulk_price || false,
          bulk_prices: eVariant.bulk_prices,
          create_date: moment().tz(TIMEZONE).format(),
          last_update: moment().tz(TIMEZONE).format(),
          creator_id: Number(req.user.user_id),
          active: true,
          slug_title: removeUnicode(String(eVariant.title), true).toLowerCase(),
        }
        _variants.push(_variant)
      }
    })
    req['_variants'] = _variants
    await Promise.all([
      client
        .db(req.user.database)
        .collection('AppSetting')
        .updateOne(
          { name: 'Attributes' },
          { $set: { name: 'Attributes', value: attribute_id } },
          { upsert: true }
        ),
      client
        .db(req.user.database)
        .collection('AppSetting')
        .updateOne(
          { name: 'Variants' },
          { $set: { name: 'Variants', value: variant_id } },
          { upsert: true }
        ),
    ])
    await productService._update(req, res, next)
  } catch (err) {
    next(err)
  }
}

module.exports.deleteProductC = async (req, res, next) => {
  try {
    await client
      .db(req.user.database)
      .collection('Products')
      .deleteMany({ product_id: { $in: req.body.product_id } })
    await client
      .db(req.user.database)
      .collection('Attributes')
      .deleteMany({ product_id: { $in: req.body.product_id } })
    await client
      .db(req.user.database)
      .collection('Variants')
      .deleteMany({ product_id: { $in: req.body.product_id } })
    await client
      .db(req.user.database)
      .collection('Prices')
      .deleteMany({ product_id: { $in: req.body.product_id } })
    await client
      .db(req.user.database)
      .collection('Locations')
      .deleteMany({ product_id: { $in: req.body.product_id } })
    await client
      .db(req.user.database)
      .collection('Feedbacks')
      .deleteMany({ product_id: { $in: req.body.product_id } })
    res.send({ success: true, message: 'Xóa sản phẩm thành công!' })
  } catch (err) {
    next(err)
  }
}

module.exports.getAllAtttributeC = async (req, res, next) => {
  try {
    await productService._getAllAttributes(req, res, next)
  } catch (err) {
    next(err)
  }
}

module.exports.getAllUnitProductC = async (req, res, next) => {
  try {
    await productService.getAllUnitProductS(req, res, next)
  } catch (err) {
    next(err)
  }
}

module.exports.addFeedbackC = async (req, res, next) => {
  try {
    let _feedback = new Feedback()
    let feedbackMaxId = await client
      .db(req.user.database)
      .collection('AppSetting')
      .findOne({ name: 'Feedbacks' })
    let feedback_id = (() => {
      if (feedbackMaxId) {
        if (feedbackMaxId.value) {
          return Number(feedbackMaxId.value)
        }
      }
      return 0
    })()
    feedback_id++
    _feedback.create({
      ...req.body,
      feedback_id: Number(feedback_id),
      create_date: new Date(),
    })
    req['_insert'] = _feedback
    await productService.addFeedbackS(req, res, next)
  } catch (err) {
    next(err)
  }
}

module.exports.deleteFeedbackC = async (req, res, next) => {
  try {
    let feedback_ids = req.query.feedback_id.split('---').map((id) => {
      return Number(id)
    })
    await client
      .db(req.user.database)
      .collection('Feedbacks')
      .deleteMany({ feedback_id: { $in: feedback_ids } })
    res.send({ success: true, message: 'Xóa phản hồi thành công!' })
  } catch (err) {
    next(err)
  }
}

module.exports.importFileC = async (req, res, next) => {
  try {
    if (req.file == undefined) {
      throw new Error('400: Vui lòng truyền file!')
    }
    let excelData = XLSX.read(req.file.buffer, {
      type: 'buffer',
      cellDates: true,
    })
    let rows = XLSX.utils.sheet_to_json(
      excelData.Sheets[excelData.SheetNames[0]]
    )
    let categorySlugs = []
    let supplierSlugs = []
    let taxSlugs = []
    let warrantySlugs = []
    let brandSlugs = []
    let originSlugs = []
    rows = rows.map((eRow) => {
      let _row = {}
      let count = 0
      let optionRequire = [
        'masanpham(*)',
        'tensanpham(*)',
        'thuoctinh1(*)',
        'giatri1(*)',
        'maphienban(*)',
        'tenphienban(*)',
        'giaban(*)',
      ]
      for (let i in eRow) {
        if (
          optionRequire.includes(removeUnicode(String(i), true).toLowerCase())
        ) {
          count++
        }
        _row[
          removeUnicode(String(i), true)
            .toLowerCase()
            .replace(/\(\*\)/gi, '')
        ] = eRow[i]
      }
      if (count < optionRequire.length) {
        throw new Error(
          `400: Các thuộc tính có dấu (*) là thuộc tính bắt buộc!`
        )
      }
      count = 0
      if (_row['tendanhmuc']) {
        _row['_tendanhmuc'] = removeUnicode(
          String(_row['tendanhmuc']),
          true
        ).toLowerCase()
        categorySlugs.push(_row['_tendanhmuc'])
      }
      if (_row['nhacungcap']) {
        _row['_nhacungcap'] = removeUnicode(
          String(_row['nhacungcap']),
          true
        ).toLowerCase()
        supplierSlugs.push(_row['_nhacungcap'])
      }
      if (_row['thueapdung']) {
        _row['_thueapdung'] = _row['thueapdung'].split('-').map((tax) => {
          tax = removeUnicode(String(tax), true).toLowerCase()
          taxSlugs.push(tax)
          return tax
        })
      }
      if (_row['chuongtrinhbaohanh']) {
        _row['_chuongtrinhbaohanh'] = _row['chuongtrinhbaohanh']
          .split('-')
          .map((warranty) => {
            warranty = removeUnicode(String(warranty), true).toLowerCase()
            warrantySlugs.push(warranty)
            return warranty
          })
      }
      if (_row['tenthuonghieu']) {
        _row['_tenthuonghieu'] = removeUnicode(
          String(_row['tenthuonghieu']),
          true
        ).toLowerCase()
        brandSlugs.push(_row['_tenthuonghieu'])
      }
      if (_row['noixuatxu']) {
        _row['_noixuatxu'] = removeUnicode(
          String(_row['noixuatxu']),
          true
        ).toLowerCase()
        originSlugs.push(_row['_noixuatxu'])
      }
      return _row
    })
    categorySlugs = [...new Set(categorySlugs)]
    supplierSlugs = [...new Set(supplierSlugs)]
    taxSlugs = [...new Set(taxSlugs)]
    warrantySlugs = [...new Set(warrantySlugs)]
    brandSlugs = [...new Set(brandSlugs)]
    originSlugs = [...new Set(originSlugs)]
    let [categories, suppliers, taxes, warranties, brands, origins] =
      await Promise.all([
        client
          .db(req.user.database)
          .collection('Categories')
          .find({
            slug_name: { $in: categorySlugs },
          })
          .toArray(),
        client
          .db(req.user.database)
          .collection('Suppliers')
          .find({
            slug_name: { $in: supplierSlugs },
          })
          .toArray(),
        client
          .db(req.user.database)
          .collection('Taxes')
          .find({
            slug_name: { $in: taxSlugs },
          })
          .toArray(),
        client
          .db(req.user.database)
          .collection('Warranties')
          .find({
            slug_name: { $in: warrantySlugs },
          })
          .toArray(),
        client
          .db(req.user.database)
          .collection('Brands')
          .find({
            slug_name: { $in: brandSlugs },
          })
          .toArray(),
        client
          .db(req.user.database)
          .collection('Origins')
          .find({
            slug_name: { $in: originSlugs },
          })
          .toArray(),
      ])
    let _categories = {}
    categories.map((eCategory) => {
      _categories[eCategory.slug_name] = eCategory
    })
    let _suppliers = {}
    suppliers.map((eSupplier) => {
      _suppliers[eSupplier.slug_name] = eSupplier
    })
    let _taxes = {}
    taxes.map((eTax) => {
      _taxes[eTax.slug_name] = eTax
    })
    let _warranties = {}
    warranties.map((eWarranty) => {
      _warranties[eWarranty.slug_name] = eWarranty
    })
    let _brands = {}
    brands.map((eBrand) => {
      _brands[eBrand.slug_name] = eBrand
    })
    let _origins = {}
    origins.map((eOrigin) => {
      _origins[eOrigin.slug_name] = eOrigin
    })
    let [
      product_id,
      attribute_id,
      variant_id,
      supplier_id,
      category_id,
      brand_id,
    ] = await Promise.all([
      client
        .db(req.user.database)
        .collection('AppSetting')
        .findOne({ name: 'Products' })
        .then((doc) => {
          if (doc && doc.value) {
            return doc.value
          }
          return 0
        }),
      client
        .db(req.user.database)
        .collection('AppSetting')
        .findOne({ name: 'Attributes' })
        .then((doc) => {
          if (doc && doc.value) {
            return doc.value
          }
          return 0
        }),
      client
        .db(req.user.database)
        .collection('AppSetting')
        .findOne({ name: 'Variants' })
        .then((doc) => {
          if (doc && doc.value) {
            return doc.value
          }
          return 0
        }),
      client
        .db(req.user.database)
        .collection('AppSetting')
        .findOne({ name: 'Suppliers' })
        .then((doc) => {
          if (doc && doc.value) {
            return doc.value
          }
          return 0
        }),
      client
        .db(req.user.database)
        .collection('AppSetting')
        .findOne({ name: 'Categories' })
        .then((doc) => {
          if (doc && doc.value) {
            return doc.value
          }
          return 0
        }),
      client
        .db(req.user.database)
        .collection('AppSetting')
        .findOne({ name: 'Brands' })
        .then((doc) => {
          if (doc && doc.value) {
            return doc.value
          }
          return 0
        }),
    ])
    let insertSuppliers = []
    let insertCategories = []
    let insertBrands = []
    rows.map((eRow) => {
      if (!_suppliers[eRow['_nhacungcap']]) {
        supplier_id++
        let _supplier = {
          supplier_id: supplier_id,
          code: String(supplier_id).padStart(6, '0'),
          name: String(eRow['nhacungcap']).trim().toUpperCase(),
          logo: '',
          phone: '',
          email: '',
          address: '',
          district: '',
          province: '',
          create_date: moment().tz(TIMEZONE).format(),
          last_update: moment().tz(TIMEZONE).format(),
          creator_id: req.user.user_id,
          active: true,
          slug_name: eRow['_nhacungcap'],
          slug_address: '',
          slug_district: '',
          slug_province: '',
        }
        insertSuppliers.push(_supplier)
        _suppliers[eRow['_nhacungcap']] = _supplier
      }
      if (!_categories[eRow['_tendanhmuc']]) {
        category_id++
        let _category = {
          category_id: category_id,
          code: String(category_id).padStart(6, '0'),
          name: String(eRow['tendanhmuc']).trim().toUpperCase(),
          parent_id: -1,
          priority: '',
          image: '',
          description: '',
          default: '',
          create_date: moment().tz(TIMEZONE).format(),
          last_update: moment().tz(TIMEZONE).format(),
          creator_id: req.user.user_id,
          active: true,
          slug_name: eRow['_tendanhmuc'],
        }
        insertCategories.push(_category)
        _categories[eRow['_tendanhmuc']] = _category
      }
      if (!_brands[eRow['_tenthuonghieu']]) {
        brand_id++
        let _brand = {
          brand_id: brand_id,
          code: String(brand_id).padStart(6, '0'),
          name: String(eRow['tenthuonghieu']).trim().toUpperCase(),
          priority: 1,
          images: [],
          country_code: '',
          founded_year: '',
          content: '',
          tags: [],
          create_date: moment().tz(TIMEZONE).format(),
          last_update: moment().tz(TIMEZONE).format(),
          creator_id: req.user.user_id,
          active: true,
          slug_name: eRow['_tenthuonghieu'],
          slug_tags: [],
        }
        insertBrands.push(_brand)
        _brands[eRow['_tenthuonghieu']] = _brand
      }
    })
    if (insertSuppliers.length > 0) {
      let insert = await client
        .db(req.user.database)
        .collection('Suppliers')
        .insertMany(insertSuppliers)
      if (!insert.insertedIds) {
        throw new Error(`500: Tạo nhà cung cấp thất bại!`)
      }
    }
    if (insertCategories.length > 0) {
      let insert = await client
        .db(req.user.database)
        .collection('Categories')
        .insertMany(insertCategories)
      if (!insert.insertedIds) {
        throw new Error(`500: Tạo nhóm sản phẩm thất bại!`)
      }
    }
    if (insertBrands.length > 0) {
      let insert = await client
        .db(req.user.database)
        .collection('Brands')
        .insertMany(insertBrands)
      if (!insert.insertedIds) {
        throw new Error(`500: Tạo thương hiệu sản phẩm thất bại!`)
      }
    }
    let _products = {}
    let _attributes = {}
    let _variants = {}
    rows.map((eRow) => {
      if (!_products[eRow['masanpham']]) {
        if (isNaN(eRow['chieudai(cm)']))
          throw new Error('400: Chiều dài không hợp lệ')

        if (isNaN(eRow['chieurong(cm)']))
          throw new Error('400: Chiều rộng không hợp lệ')

        if (isNaN(eRow['chieucao(cm)']))
          throw new Error('400: Chiều cao không hợp lệ')

        if (isNaN(eRow['khoiluong(g)']))
          throw new Error('400: Khối lượng không hợp lệ')

        product_id++
        _products[eRow['masanpham']] = {
          product_id: product_id,
          code: String(product_id).padStart(6, '0'),
          sku: eRow['masanpham'],
          name: eRow['tensanpham'],
          slug: removeUnicode(String(eRow['tensanpham']), false)
            .replace(/\s/g, '-')
            .toLowerCase(),
          supplier_id: _suppliers[eRow['_nhacungcap']]?.supplier_id,
          category_id: [_categories[eRow['_tendanhmuc']]?.category_id],
          tax_id: (() => {
            if (eRow['_thueapdung']) {
              eRow['_thueapdung'].map((taxSlug) => {
                if (taxSlug && _taxes[taxSlug]) {
                  return _taxes[taxSlug].tax_id
                }
              })
            }
            return []
          })(),
          warranties: (() => {
            if (eRow['_chuongtrinhbaohanh']) {
              eRow['_chuongtrinhbaohanh'].map((warrantySlug) => {
                if (warrantySlug && _taxes[warrantySlug]) {
                  return _warranties[warrantySlug].warranty_id
                }
              })
            }
            return []
          })(),
          length: eRow['chieudai(cm)'] || 0,
          width: eRow['chieurong(cm)'] || 0,
          height: eRow['chieucao(cm)'] || 0,
          weight: eRow['khoiluong(g)'] || 0,
          unit: eRow['donvi'] || '',
          brand_id: _brands[eRow['_tenthuonghieu']].brand_id,
          origin_code: _origins[eRow['_noixuatxu']]?.origin_code,
          status: eRow['tinhtrang'],
          description: eRow['mota'] || '',
          tags: (() => {
            if (eRow['tags']) {
              return eRow['tags'].split(',')
            }
          })(),
          files: [],
          sale_quantity: 0,
          create_date: moment().tz(TIMEZONE).format(),
          last_update: moment().tz(TIMEZONE).format(),
          creator_id: Number(req.user.user_id),
          active: true,
          slug_name: eRow['_tensanpham'],
          slug_tags: (() => {
            if (eRow['tags']) {
              return eRow['tags'].split(',').map((tag) => {
                return removeUnicode(String(tag), true).toLowerCase()
              })
            }
          })(),
        }
      }
      if (eRow['thuoctinh1']) {
        if (
          !_attributes[
            `${_products[eRow['masanpham']].product_id}-${eRow['thuoctinh1']}`
          ]
        ) {
          attribute_id++
          let _attribute = {
            attribute_id: attribute_id,
            product_id: _products[eRow['masanpham']].product_id,
            option: eRow['thuoctinh1'].toUpperCase(),
            values: [],
            create_date: moment().tz(TIMEZONE).format(),
            creator_id: req.user.user_id,
            last_update: moment().tz(TIMEZONE).format(),
            active: true,
            slug_option: removeUnicode(
              String(eRow['thuoctinh1']),
              true
            ).toLowerCase(),
            slug_values: [],
          }
          _attributes[
            `${_products[eRow['masanpham']].product_id}-${eRow['thuoctinh1']}`
          ] = _attribute
        }
        if (
          _attributes[
            `${_products[eRow['masanpham']].product_id}-${eRow['thuoctinh1']}`
          ]
        ) {
          _attributes[
            `${_products[eRow['masanpham']].product_id}-${eRow['thuoctinh1']}`
          ].values.push(eRow['giatri1'].toUpperCase())
          _attributes[
            `${_products[eRow['masanpham']].product_id}-${eRow['thuoctinh1']}`
          ].slug_values.push(
            removeUnicode(String(eRow['giatri1']), true).toLowerCase()
          )
        }
      }
      if (eRow['thuoctinh2']) {
        if (
          !_attributes[
            `${_products[eRow['masanpham']].product_id}-${eRow['thuoctinh2']}`
          ]
        ) {
          attribute_id++
          let _attribute = {
            attribute_id: attribute_id,
            product_id: _products[eRow['masanpham']].product_id,
            option: eRow['thuoctinh2'].toUpperCase(),
            values: [],
            create_date: moment().tz(TIMEZONE).format(),
            creator_id: req.user.user_id,
            last_update: moment().tz(TIMEZONE).format(),
            active: true,
            slug_option: removeUnicode(
              String(eRow['thuoctinh2']),
              true
            ).toLowerCase(),
            slug_values: [],
          }
          _attributes[
            `${_products[eRow['masanpham']].product_id}-${eRow['thuoctinh2']}`
          ] = _attribute
        }
        if (
          _attributes[
            `${_products[eRow['masanpham']].product_id}-${eRow['thuoctinh2']}`
          ]
        ) {
          _attributes[
            `${_products[eRow['masanpham']].product_id}-${eRow['thuoctinh2']}`
          ].values.push(eRow['giatri2'].toUpperCase())
          _attributes[
            `${_products[eRow['masanpham']].product_id}-${eRow['thuoctinh2']}`
          ].slug_values.push(
            removeUnicode(String(eRow['giatri2']), true).toLowerCase()
          )
        }
      }
      if (!_variants[eRow['maphienban']]) {
        variant_id++
        if (isNaN(eRow['giaban'])) throw new Error('400: Giá bán không hợp lệ')

        _variants[eRow['maphienban']] = {
          variant_id: variant_id,
          product_id: _products[eRow['masanpham']].product_id,
          code: String(product_id).padStart(6, '0'),
          title: eRow['tenphienban'] || '',
          slug_title: removeUnicode(
            String(eRow['tenphienban']),
            true
          ).toLowerCase(),
          sku: String(eRow['maphienban']),
          image: (() => {
            if (eRow['hinhanh']) {
              return eRow['hinhanh'].split(',')
            }
            return []
          })(),
          options: [
            ...(() => {
              let result = []
              for (let i = 0; i < 3; i++) {
                if (eRow[`thuoctinh${i + 1}`] && eRow[`giatri${i + 1}`]) {
                  result = [
                    ...result,
                    ...[
                      {
                        option: eRow[`thuoctinh${i + 1}`],
                        value: eRow[`giatri${i + 1}`],
                      },
                    ],
                  ]
                }
              }
              return result
            })(),
          ],
          ...(() => {
            let result = {}
            for (let i = 0; i < 3; i++) {
              if (eRow[`thuoctinh${i + 1}`] && eRow[`giatri${i + 1}`]) {
                result[`option${i + 1}`] = {
                  option: eRow[`thuoctinh${i + 1}`],
                  value: eRow[`giatri${i + 1}`],
                }
              }
            }
            return result
          })(),
          supplier: _suppliers[eRow['_nhacungcap']]?.name,
          import_price_default: eRow['gianhap'],
          price: eRow['giaban'],
          enable_bulk_price: (() => {
            if (
              eRow['apdunggiabansi'] &&
              removeUnicode(
                String(eRow['apdunggiabansi']),
                true
              ).toLowerCase() == 'co'
            ) {
              return true
            }
            return false
          })(),
          bulk_prices: (() => {
            let result = []
            let i = 0
            do {
              let bulkPrice = {}
              if (i == 0) {
                if (eRow[`soluongsiapdung`]) {
                  if (isNaN(eRow[`soluongsiapdung`]))
                    throw new Error('400: Số lượng sỉ áp dụng không hợp lệ')

                  let [minQuantity, maxQuantity] =
                    eRow[`soluongsiapdung`].split('-')
                  bulkPrice['min_quantity_apply'] = minQuantity
                  bulkPrice['max_quantity_apply'] = maxQuantity
                  bulkPrice['price'] = eRow[`giabansiapdung`]

                  if (isNaN(bulkPrice['price']))
                    throw new Error('400: Giá bán sỉ áp dụng không hợp lệ')
                } else {
                  break
                }
              } else {
                if (eRow[`soluongsiapdung_${i}`]) {
                  if (isNaN(eRow[`soluongsiapdung_${i}`]))
                    throw new Error('400: Số lượng sỉ áp dụng không hợp lệ')

                  let [minQuantity, maxQuantity] =
                    eRow[`soluongsiapdung_${i}`].split('-')
                  bulkPrice['min_quantity_apply'] = minQuantity
                  bulkPrice['max_quantity_apply'] = maxQuantity
                  bulkPrice['price'] = eRow[`giabansiapdung_${i}`]

                  if (isNaN(bulkPrice['price']))
                    throw new Error('400: Giá bán sỉ áp dụng không hợp lệ')
                } else {
                  break
                }
              }
              result.push(bulkPrice)
              i++
            } while (true)
            return result
          })(),
          create_date: moment().tz(TIMEZONE).format(),
          last_update: moment().tz(TIMEZONE).format(),
          creator_id: Number(req.user.user_id),
          active: true,
        }
      }
    })
    for (let i in _attributes) {
      _attributes[i].values = [...new Set(_attributes[i].values)]
      _attributes[i].slug_values = [...new Set(_attributes[i].slug_values)]
    }
    if (Object.values(_products).length > 0) {
      let insert = await client
        .db(req.user.database)
        .collection('Products')
        .insertMany(Object.values(_products))
      if (!insert.insertedIds) {
        throw new Error(`500: Tạo sản phẩm thất bại!`)
      }
    }
    if (Object.values(_attributes).length > 0) {
      let insert = await client
        .db(req.user.database)
        .collection('Attributes')
        .insertMany(Object.values(_attributes))
      if (!insert.insertedIds) {
        throw new Error(`500: Tạo thuộc tính sản phẩm thất bại!`)
      }
    }
    if (Object.values(_variants).length > 0) {
      let insert = await client
        .db(req.user.database)
        .collection('Variants')
        .insertMany(Object.values(_variants))
      if (!insert.insertedIds) {
        throw new Error(`500: Tạo phiên bản sản phẩm thất bại!`)
      }
    }
    await Promise.all([
      client
        .db(req.user.database)
        .collection('AppSetting')
        .updateOne(
          { name: 'Products' },
          { $set: { name: 'Products', value: product_id } },
          { upsert: true }
        ),
      client
        .db(req.user.database)
        .collection('AppSetting')
        .updateOne(
          { name: 'Variants' },
          { $set: { name: 'Variants', value: variant_id } },
          { upsert: true }
        ),
      client
        .db(req.user.database)
        .collection('AppSetting')
        .updateOne(
          { name: 'Suppliers' },
          { $set: { name: 'Suppliers', value: supplier_id } },
          { upsert: true }
        ),
      client
        .db(req.user.database)
        .collection('AppSetting')
        .updateOne(
          { name: 'Categories' },
          { $set: { name: 'Categories', value: category_id } },
          { upsert: true }
        ),
      client
        .db(req.user.database)
        .collection('AppSetting')
        .updateOne(
          { name: 'Brands' },
          { $set: { name: 'Brands', value: brand_id } },
          { upsert: true }
        ),
    ])
    res.send({ success: true, message: 'Tạo sản phẩm thành công!' })
  } catch (err) {
    next(err)
  }
}

module.exports.AddUnitProductC = async (req, res, next) => {
  try {
    if (
      req.body.pcs == undefined ||
      req.body.name == undefined ||
      req.body.price == undefined
    ) {
      return res.send({ success: false, mess: 'pcs or name invalid !!!' })
    }

    req.body.creator_id = req.user.user_id
    req.body.created_date = moment().tz(timezone).format()
    req.body.updated_date = moment().tz(timezone).format()

    let app = await client
      .db(req.user.database)
      .collection('AppSetting')
      .findOne({ name: 'Unit' })

    req.body.unit_product_id = parseInt(app.value) + 1
    await client
      .db(req.user.database)
      .collection('AppSetting')
      .updateOne(
        { name: 'Unit' },
        {
          $set: {
            value: req.body.unit_product_id,
          },
        }
      )

    await productService.AddUnitProductS(req, res, next)
  } catch (err) {
    next(err)
  }
}
