const moment = require(`moment-timezone`)
const TIMEZONE = process.env.TIMEZONE
const client = require(`../config/mongodb`)
const SDB = process.env.DATABASE

const bcrypt = require(`../libs/bcrypt`)
const jwt = require(`../libs/jwt`)
const mail = require(`../libs/nodemailer`)
const { otpMail } = require('../templates/otpMail')
const { verifyMail } = require('../templates/verifyMail')
const { sendSMS } = require('../libs/sendSMS')

const crypto = require('crypto')
const { _permissions } = require('../templates/permissions')
const { _menus } = require('../templates/menus')
const { stringHandle } = require('../utils/string-handle')

let removeUnicode = (text, removeSpace) => {
  /*
        string là chuỗi cần remove unicode
        trả về chuỗi ko dấu tiếng việt ko khoảng trắng
    */
  if (typeof text != 'string') {
    return ''
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

module.exports._checkBusiness = async (req, res, next) => {
  try {
    if (req.body.username == undefined)
      throw new Error('400: Vui lòng truyền username')

    var business = await client.db(SDB).collection('Business').findOne({
      username: req.body.username,
    })
    return res.send({ success: true, data: business })
  } catch (err) {
    next(err)
  }
}

module.exports._register = async (req, res, next) => {
  try {
    ;['business_name', 'username', 'email', 'password'].map((e) => {
      if (!req.body[e]) {
        throw new Error(`400: Thiếu thuộc tính ${e}!`)
      }
    })

    req.body.prefix = stringHandle(req.body.business_name, {
      removeUnicode: true,
      removeSpace: true,
      lowerCase: true,
    })
    if (
      req.body.prefix == 'root' ||
      req.body.prefix == 'admin' ||
      req.body.prefix == 'app' ||
      req.body.prefix == 'login' ||
      req.body.prefix == 'register'
    ) {
      return res.send({
        success: false,
        mess: 'Tên doanh nghiệp đã tồn tại, vui lòng chọn tên khác',
      })
    }
    req.body.username = String(req.body.username).trim().toLowerCase()
    req.body.email = String(req.body.email).trim().toLowerCase()
    req.body.password = bcrypt.hash(String(req.body.password))
    if (
      /^((viesoftware)|(admin)|(root)|(app)|(login)|(register))$/gi.test(
        req.body.prefix
      )
    ) {
      throw new Error(`400: Bạn không thể sử dụng tên doanh nghiệp này!`)
    }
    let [business, user] = await Promise.all([
      client
        .db(SDB)
        .collection('Business')
        .findOne({ prefix: req.body.prefix }),
      client
        .db(SDB)
        .collection('Business')
        .findOne({
          $or: [
            { username: req.body.username },
            { email: { $ne: '', $eq: req.body.email } },
          ],
        }),
    ])
    if (business) {
      throw new Error(`400: Tên doanh nghiệp đã được đăng ký!`)
    }
    if (user) {
      throw new Error(`400: Số điện thoại hoặc email đã được sử dụng!`)
    }
    const DB = `${req.body.prefix}DB`
    let businessApp = await client
      .db(SDB)
      .collection('AppSetting')
      .findOne({ name: 'Business' })
    let business_id = parseInt(businessApp.value) + 1
    var system_user_id = business_id
    let otpCode = String(Math.random()).substr(2, 6)
    let verifyId = crypto.randomBytes(10).toString(`hex`)
    let verifyLink = `https://${req.body.prefix}.${process.env.DOMAIN}/verify-account?uid=${verifyId}`
    let _verifyLink = {
      username: req.body.username,
      UID: String(verifyId),
      verify_link: verifyLink,
      verify_timelife: moment().tz(TIMEZONE).add(5, `minutes`).format(),
    }
    await Promise.all([
      mail.sendMail(
        req.body.email,
        `Yêu cầu xác thực`,
        verifyMail(otpCode, verifyLink)
      ),
      client.db(SDB).collection('VerifyLinks').insertOne(_verifyLink),
    ])
    let verifyMessage = `[VIESOFTWARE] Mã OTP của quý khách là ${otpCode}`
    sendSMS([req.body.username], verifyMessage, 2, 'VIESOFTWARE')
    business_id++
    system_user_id++
    let _business = {
      business_id: business_id,
      system_user_id: system_user_id,
      prefix: req.body.prefix,
      business_name: req.body.business_name,
      database_name: DB,
      company_name: req.body.company_name || '',
      company_email: req.body.company_email || '',
      company_phone: req.body.company_phone || '',
      company_website: req.body.company_website || '',
      company_logo:
        'https://icon-library.com/images/merchant-icon/merchant-icon-12.jpg' ||
        '',
      company_address: req.body.company_address || '',
      company_district: req.body.company_district || '',
      company_province: req.body.company_province || '',
      tax_code: req.body.tax_code || '',
      career_id: req.body.career_id || '',
      price_recipe: req.body.price_recipe || 'FIFO',
      verify_with: (() => {
        if (req.body.verify_with) {
          return String(req.body.verify_with).toUpperCase()
        }
        if (req.body.username) {
          return 'PHONE'
        }
        if (req.body.email) {
          return 'EMAIL'
        }
        return 'PHONE'
      })(),

      system_user_id: system_user_id,
      system_code: String(system_user_id).padStart(6, '0'),
      user_id: 1,
      code: String(1).padStart(6, '0'),
      business_id: business_id,
      username: req.body.username,
      password: req.body.password,
      system_role_id: 2,
      role_id: 1,
      email: req.body.email || '',
      avatar: req.body.avatar || '',
      first_name: req.body.first_name || '',
      last_name: req.body.last_name || '',
      name: req.body.first_name || '' + req.body.last_name || '',
      birth_day: req.body.birth_day || moment().tz(TIMEZONE).format(),
      address: req.body.address || '',
      district: req.body.district || '',
      province: req.body.province || '',
      branch_id: 1,
      store_id: 1,
      otp_code: otpCode,
      otp_timelife: moment().tz(TIMEZONE).add(5, 'minutes').format(),
      last_login: moment().tz(TIMEZONE).format(),
      create_date: moment().tz(TIMEZONE).format(),
      creator_id: system_user_id,
      last_update: moment().tz(TIMEZONE).format(),
      updater_id: system_user_id,
      active: false,
      slug_business_name: stringHandle(req.body.business_name, {
        createSlug: true,
      }),
      slug_name: removeUnicode(
        `${req.body.first_name || ''}${req.body.last_name || ''}`,
        true
      ).toLowerCase(),
      slug_address: removeUnicode(
        `${req.body.address || ''}`,
        true
      ).toLowerCase(),
      slug_district: removeUnicode(
        `${req.body.district || ''}`,
        true
      ).toLowerCase(),
      slug_province: removeUnicode(
        `${req.body.province || ''}`,
        true
      ).toLowerCase(),
    }
    let _admin = {
      user_id: 1,
      code: String(1).padStart(6, '0'),
      username: req.body.username,
      password: req.body.password,
      role_id: 1,
      email: req.body.email || '',
      avatar:
        req.body.avatar || 'https://' + process.env.DOMAIN + '/app/logo.png',
      first_name: req.body.first_name || '',
      last_name: req.body.last_name || '',
      name: req.body.first_name || '' + req.body.last_name || '',
      birth_day: req.body.birth_day || moment().tz(TIMEZONE).format(),
      address: req.body.address || '',
      district: req.body.district || '',
      province: req.body.province || '',
      branch_id: 1,
      store_id: 1,
      otp_code: otpCode,
      otp_timelife: moment().tz(TIMEZONE).add(5, 'minutes').format(),
      last_login: moment().tz(TIMEZONE).format(),
      create_date: moment().tz(TIMEZONE).format(),
      creator_id: 1,
      last_update: moment().tz(TIMEZONE).format(),
      updater_id: 1,
      active: false,
      slug_name: removeUnicode(
        `${req.body.first_name || ''}${req.body.last_name || ''}`,
        true
      ).toLowerCase(),
      slug_address: removeUnicode(
        `${req.body.address || ''}`,
        true
      ).toLowerCase(),
      slug_district: removeUnicode(
        `${req.body.district || ''}`,
        true
      ).toLowerCase(),
      slug_province: removeUnicode(
        `${req.body.province || ''}`,
        true
      ).toLowerCase(),
    }
    let _employee = {
      user_id: 2,
      code: String(2).padStart(6, '0'),
      username: 'nhanvienmacdinh',
      password: 'nhanvienmacdinh',
      role_id: 2,
      email: '',
      avatar: 'https://' + process.env.DOMAIN + '/app/logo.png',
      first_name: 'Nhân viên mặc định',
      last_name: '',
      name: 'Nhân viên mặc định',
      birth_day: moment().tz(TIMEZONE).format(),
      address: '',
      district: '',
      province: '',
      branch_id: 1,
      store_id: 1,
      otp_code: false,
      otp_timelife: false,
      last_login: moment().tz(TIMEZONE).format(),
      create_date: moment().tz(TIMEZONE).format(),
      creator_id: 1,
      last_update: moment().tz(TIMEZONE).format(),
      updater_id: 1,
      active: true,
      slug_name: removeUnicode('Nhân viên mặc định', true).toLowerCase(),
      slug_address: removeUnicode('', true).toLowerCase(),
      slug_district: removeUnicode('', true).toLowerCase(),
      slug_province: removeUnicode('', true).toLowerCase(),
    }
    let _supplier = {
      supplier_id: 1,
      code: String(1).padStart(6, '0'),
      name: 'Mặc định',
      logo: 'https://' + process.env.DOMAIN + '/app/logo.png',
      phone: '',
      email: '',
      address: '',
      district: '',
      province: '',
      create_date: moment().tz(TIMEZONE).format(),
      creator_id: 1,
      last_update: moment().tz(TIMEZONE).format(),
      updater_id: 1,
      active: true,
      slug_name: removeUnicode(String('Mặc định'), true).toLowerCase(),
      slug_address: removeUnicode(String(''), true).toLowerCase(),
      slug_district: removeUnicode(String(''), true).toLowerCase(),
      slug_province: removeUnicode(String(''), true).toLowerCase(),
    }
    let _customer = {
      customer_id: 1,
      code: String(1).padStart(6, '0'),
      phone: '0000000000',
      type_id: 1,
      first_name: 'Khách lẻ',
      last_name: '',
      gender: '',
      birthday: '',
      address: '',
      district: '',
      province: '',
      balance: {
        available: 0,
        debt: 0,
        freezing: 0,
      },
      point: 0,
      used_point: 0,
      order_quantity: 0,
      order_total_cost: 0,
      create_date: moment().tz(TIMEZONE).format(),
      creator_id: 1,
      last_update: moment().tz(TIMEZONE).format(),
      updater_id: 1,
      active: true,
      slug_name: removeUnicode(String('Khách lẻ'), true).toLowerCase(),
      slug_type: removeUnicode(String(''), true).toLowerCase(),
      slug_gender: removeUnicode(String(''), true).toLowerCase(),
      slug_address: removeUnicode(String(''), true).toLowerCase(),
      slug_district: removeUnicode(String(''), true).toLowerCase(),
      slug_province: removeUnicode(String(''), true).toLowerCase(),
    }
    let _roles = [
      {
        role_id: 1,
        code: String(1).padStart(6, '0'),
        name: 'ADMIN',
        permission_list: _permissions,
        menu_list: _menus,
        default: true,
        create_date: moment().tz(TIMEZONE).format(),
        creator_id: 0,
        last_update: moment().tz(TIMEZONE).format(),
        updater_id: 0,
        active: true,
        slug_name: 'admin',
      },
      {
        role_id: 2,
        code: String(2).padStart(6, '0'),
        name: 'EMPLOYEE',
        permission_list: [],
        menu_list: [],
        default: true,
        create_date: moment().tz(TIMEZONE).format(),
        creator_id: 0,
        last_update: moment().tz(TIMEZONE).format(),
        updater_id: 0,
        active: true,
        slug_name: 'employee',
      },
      {
        role_id: 3,
        code: String(3).padStart(6, '0'),
        name: 'SUPPLIER',
        permission_list: [],
        menu_list: [],
        default: true,
        create_date: moment().tz(TIMEZONE).format(),
        creator_id: 0,
        last_update: moment().tz(TIMEZONE).format(),
        updater_id: 0,
        active: true,
        slug_name: 'admin',
      },
      {
        role_id: 4,
        code: String(4).padStart(6, '0'),
        name: 'CUSTOMER',
        permission_list: [],
        menu_list: [],
        default: true,
        create_date: moment().tz(TIMEZONE).format(),
        creator_id: 0,
        last_update: moment().tz(TIMEZONE).format(),
        updater_id: 0,
        active: true,
        slug_name: 'customer',
      },
    ]
    let _branch = {
      branch_id: 1,
      code: String(1).padStart(6, '0'),
      name: 'Chi nhánh mặc định',
      logo: 'https://' + process.env.DOMAIN + '/app/logo.png',
      phone: '',
      email: '',
      fax: '',
      website: '',
      latitude: '',
      longitude: '',
      warehouse_type: 'Sở hữu',
      address: '',
      ward: '',
      district: '',
      province: '',
      accumulate_point: false,
      use_point: false,
      create_date: moment().tz(TIMEZONE).format(),
      creator_id: 1,
      last_update: moment().tz(TIMEZONE).format(),
      updater_id: 1,
      active: true,
      slug_name: 'chinhanhmacdinh',
      slug_warehouse_type: 'sohuu',
      slug_address: '',
      slug_ward: '',
      slug_district: '',
      slug_province: '',
    }
    let _paymentMethods = [
      {
        payment_method_id: Number(1),
        code: String(1).padStart(6, '0'),
        name: 'Tiền mặt',
        images: [],
        default: true,
        create_date: moment().tz(TIMEZONE).format(),
        creator_id: 1,
        last_update: moment().tz(TIMEZONE).format(),
        updater_id: 1,
        active: true,
        slug_name: removeUnicode(String('Tiền mặt'), true),
      },
      {
        payment_method_id: Number(2),
        code: String(2).padStart(6, '0'),
        name: 'Điểm tích lũy',
        images: [],
        default: true,
        create_date: moment().tz(TIMEZONE).format(),
        creator_id: 1,
        last_update: moment().tz(TIMEZONE).format(),
        updater_id: 1,
        active: true,
        slug_name: removeUnicode(String('Điểm tích lũy'), true),
      },
    ]
    let _warranty = {
      warranty_id: 1,
      code: String(1).padStart(6, '0'),
      name: 'Bảo hành 12 tháng',
      type: 'Tháng',
      time: 12,
      description: '',
      default: true,
      create_date: moment().tz(TIMEZONE).format(),
      creator_id: 1,
      last_update: moment().tz(TIMEZONE).format(),
      updater_id: 1,
      active: true,
      sub_name: removeUnicode('Bảo hành 12 tháng', true).toLowerCase(),
      sub_type: removeUnicode('Tháng', true).toLowerCase(),
    }
    let _shippingCompany = {
      shipping_company_id: 1,
      code: String(1).padStart(6, '0'),
      name: 'Đơn vị vận chuyển mặc định',
      image: 'https://' + process.env.DOMAIN + '/app/logo.png',
      phone: '',
      zipcode: '',
      address: '',
      district: '',
      province: '',
      default: true,
      create_date: moment().tz(TIMEZONE).format(),
      creator_id: 1,
      last_update: moment().tz(TIMEZONE).format(),
      updater_id: 1,
      active: true,
      sub_name: removeUnicode('', true).toLowerCase(),
      sub_address: removeUnicode('', true).toLowerCase(),
      sub_district: removeUnicode('', true).toLowerCase(),
      sub_province: removeUnicode('', true).toLowerCase(),
    }

    // // DRAFT  - PROCESSING - COMPLETE - CANCEL // - REFUND
    var enumStatusOrder = [
      {
        name: 'DRAFT',
        label: 'Lưu Nháp',
        default: true,
      },
      {
        name: 'PROCESSING',
        label: 'Đang Xử Lí',
      },
      { name: 'COMPLETE', label: 'Hoàn Thành' },
      { name: 'CANCEL', label: 'Huỷ Bỏ' },
      { name: 'REFUND', label: 'Hoàn Trả' },
    ]

    // DRAFT - WATTING_FOR_SHIPPING - SHIPPING - COMPLETE - CANCEL
    var enumStatusShipping = [
      {
        name: 'DRAFT',
        label: 'Đợi Đóng Gói',
        default: true,
      },
      {
        name: 'PROCESSING',
        label: 'Đợi Vận Chuyển',
      },
      { name: 'SHIPPING', label: 'Đang Vận Chuyển' },
      { name: 'COMPLETE', label: 'Hoàn Thành' },
      { name: 'CANCEL', label: 'Huỷ Bỏ' },
    ]

    // CUSTOMER TYPE
    var enumCustomerType = [
      {
        type_id: 1,
        name: 'Thường',
        slug_name: 'thuong',
        description: 'Mặc định',
        condition_point: 10000,
        creator_id: 1,
        last_update: moment().tz(TIMEZONE).format(),
        create_date: moment().tz(TIMEZONE).format(),
      },
      {
        type_id: 2,
        name: 'Đặc Biệt',
        slug_name: 'dacbiet',
        description: 'Mặc định',
        condition_point: 10000,
        creator_id: 1,
        last_update: moment().tz(TIMEZONE).format(),
        create_date: moment().tz(TIMEZONE).format(),
      },
      {
        type_id: 3,
        name: 'Trung Thành',
        slug_name: 'trungthanh',
        description: 'Mặc định',
        condition_point: 10000,
        creator_id: 1,
        last_update: moment().tz(TIMEZONE).format(),
        create_date: moment().tz(TIMEZONE).format(),
      },
      {
        type_id: 4,
        name: 'Vip',
        slug_name: 'vip',
        description: 'Mặc định',
        condition_point: 10000,
        creator_id: 1,
        last_update: moment().tz(TIMEZONE).format(),
        create_date: moment().tz(TIMEZONE).format(),
      },
    ]

    await Promise.all([
      client
        .db(SDB)
        .collection('AppSetting')
        .updateOne(
          { name: 'Business' },
          { $set: { name: 'Business', value: business_id } },
          { upsert: true }
        ),
      client
        .db(DB)
        .collection('AppSetting')
        .updateOne(
          { name: 'Users' },
          { $set: { name: 'Users', value: 2 } },
          { upsert: true }
        ),
      client
        .db(DB)
        .collection('AppSetting')
        .updateOne(
          { name: 'Suppliers' },
          { $set: { name: 'Suppliers', value: 1 } },
          { upsert: true }
        ),
      client
        .db(DB)
        .collection('AppSetting')
        .updateOne(
          { name: 'Customers' },
          { $set: { name: 'Customers', value: 1 } },
          { upsert: true }
        ),
      client
        .db(DB)
        .collection('AppSetting')
        .updateOne(
          { name: 'Roles' },
          { $set: { name: 'Roles', value: 4 } },
          { upsert: true }
        ),
      client
        .db(DB)
        .collection('AppSetting')
        .updateOne(
          { name: 'Branchs' },
          { $set: { name: 'Branchs', value: 1 } },
          { upsert: true }
        ),
      client
        .db(DB)
        .collection('AppSetting')
        .updateOne(
          { name: 'CustomerTypes' },
          { $set: { name: 'CustomerTypes', value: 4 } },
          { upsert: true }
        ),
      client
        .db(DB)
        .collection('AppSetting')
        .updateOne(
          { name: 'PaymentMethods' },
          { $set: { name: 'PaymentMethods', value: 2 } },
          { upsert: true }
        ),
      client
        .db(DB)
        .collection('AppSetting')
        .updateOne(
          { name: 'Warranties' },
          { $set: { name: 'Warranties', value: 1 } },
          { upsert: true }
        ),
      client
        .db(DB)
        .collection('AppSetting')
        .updateOne(
          { name: 'ShippingCompanies' },
          { $set: { name: 'ShippingCompanies', value: 1 } },
          { upsert: true }
        ),
    ])
    // Những model mặc định
    await Promise.all([
      client.db(SDB).collection('Business').insertOne(_business),
      client.db(DB).collection('Users').insertMany([_admin, _employee]),
      client.db(DB).collection('Suppliers').insertOne(_supplier),
      client.db(DB).collection('Customers').insertOne(_customer),
      client.db(DB).collection('Roles').insertMany(_roles),
      client.db(DB).collection('Branchs').insertOne(_branch),
      client.db(DB).collection('PaymentMethods').insertMany(_paymentMethods),
      client.db(DB).collection('Warranties').insertOne(_warranty),
      client.db(DB).collection('ShippingCompanies').insertOne(_shippingCompany),
      client.db(DB).collection('EnumStatusOrder').insertMany(enumStatusOrder),
      client.db(DB).collection('CustomerTypes').insertMany(enumCustomerType),
      client
        .db(DB)
        .collection('EnumStatusShipping')
        .insertMany(enumStatusShipping),
    ]).catch(async (err) => {
      await Promise.all([
        client
          .db(SDB)
          .collection('Business')
          .deleteMany({ system_user_id: system_user_id }),
        client.db(DB).dropDatabase(),
      ])
      console.log(err.message)
      throw new Error('Tạo tài khoản không thành công!')
    })
    res.send({
      success: true,
      data: _business,
      verify_with: _business.verify_with,
      verify_link: verifyLink,
    })
  } catch (err) {
    next(err)
  }
}

module.exports._login = async (req, res, next) => {
  try {
    let shop = req.headers[`shop`]
    ;['username', 'password'].map((e) => {
      if (!req.body[e]) {
        throw new Error(`400: Thiếu thuộc tính ${e}!`)
      }
    })
    // let [prefix, username] = req.body.username.split("_");
    var username = req.body.username
    let business = await client
      .db(SDB)
      .collection('Business')
      .findOne({ prefix: shop })
    if (!business) {
      throw new Error(`400: Tài khoản doanh nghiệp chưa được đăng ký!`)
    }
    const DB = (() => {
      if (business && business.database_name) {
        return business.database_name
      }
      throw new Error('400: Tên dại diện doanh nghiệp không chính xác!')
    })()
    let [user] = await client
      .db(DB)
      .collection(`Users`)
      .aggregate([
        { $match: { username: username } },
        {
          $lookup: {
            from: 'Roles',
            localField: 'role_id',
            foreignField: 'role_id',
            as: '_role',
          },
        },
        { $unwind: { path: '$_role', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'Branchs',
            localField: 'branch_id',
            foreignField: 'branch_id',
            as: '_branch',
          },
        },
        { $unwind: { path: '$_branch', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'Stores',
            localField: 'store_id',
            foreignField: 'store_id',
            as: '_store',
          },
        },
        { $unwind: { path: '$_store', preserveNullAndEmptyArrays: true } },
      ])
      .toArray()
    if (!user) {
      throw new Error(`400: Tài khoản không tồn tại!`)
    }
    // if (user.active == false) {
    //   res.status(400).send({
    //     success: false,
    //     message: "Tài khoản chưa được kích hoạt!",
    //     data: {
    //       username: user.username,
    //       email: user.email,
    //       verify_with: business.verify_with,
    //     },
    //   });
    //   return;
    // }
    if (user.active == `banned`) {
      throw new Error(`400: Tài khoản đã bị chặn bởi ADMIN!`)
    }
    if (!bcrypt.compare(req.body.password, user.password)) {
      throw new Error(`400: Mật khẩu không chính xác!`)
    }
    delete user.password
    let [accessToken, _update] = await Promise.all([
      jwt.createToken(
        { ...user, database: DB, _business: business },
        30 * 24 * 60 * 60
      ),
      client
        .db(DB)
        .collection(`Users`)
        .updateOne(
          { user_id: Number(user.user_id) },
          { $set: { last_login: moment().tz(TIMEZONE).format() } }
        ),
    ])
    res.send({ success: true, data: { accessToken } })
  } catch (err) {
    next(err)
  }
}

module.exports._refreshToken = async (req, res, next) => {
  try {
    ;['refreshToken'].map((e) => {
      if (!req.body[e]) {
        throw new Error(`400: Thiếu thuộc tính ${e}!`)
      }
    })
    try {
      let decoded = await jwt.verifyToken(req.body.refreshToken)
      let user = decoded.data
      let accessToken = await jwt.createToken(user)
      res.send({ success: true, accessToken })
    } catch (error) {
      throw new Error(`400: Refresh token không chính xác!`)
    }
  } catch (err) {
    next(err)
  }
}

module.exports._checkVerifyLink = async (req, res, next) => {
  try {
    ;['UID'].map((e) => {
      if (!req.body[e]) {
        throw new Error(`400: Thiếu thuộc tính ${e}!`)
      }
    })
    let link = await client.db(SDB).collection(`VerifyLinks`).findOne({
      UID: req.body.UID,
    })
    if (!link) {
      throw new Error('400: UID không tồn tại!')
    }
    res.send({ success: true, data: link })
  } catch (err) {
    next(err)
  }
}

module.exports._getOTP = async (req, res, next) => {
  try {
    ;['username'].map((e) => {
      if (!req.body[e]) {
        throw new Error(`400: Thiếu thuộc tính ${e}!`)
      }
    })
    const prefix = (req.headers && req.headers.shop) || false
    let business = await (async () => {
      if (prefix) {
        let result = client
          .db(SDB)
          .collection('Business')
          .findOne({ prefix: prefix })
        return result
      }
      let result = client
        .db(SDB)
        .collection('Business')
        .findOne({ username: req.body.username })
      return result
    })()
    const DB = (business && business.database_name) || ''
    let rootUser = await client
      .db(SDB)
      .collection('Business')
      .findOne({ username: req.body.username })
    let user = await client
      .db(DB)
      .collection('Users')
      .findOne({ username: req.body.username })
    if (!user) {
      throw new Error('400: Tài khoản người dùng không tồn tại!')
    }
    let otpCode = String(Math.random()).substr(2, 6)
    let verifyMessage = `[VIESOFTWARE] Mã OTP của quý khách là ${otpCode}`
    sendSMS([req.body.username], verifyMessage, 2, 'VIESOFTWARE')
    // let otpCode = String(Math.random()).substr(2, 6);
    // await Promise.all(mail.sendMail(user.email, 'Mã xác thực', otpMail(otpCode)));
    if (rootUser) {
      client
        .db(SDB)
        .collection(`Business`)
        .updateOne(
          { username: req.body.username },
          {
            $set: {
              otp_code: otpCode,
              otp_timelife: moment().tz(TIMEZONE).add(5, 'minutes').format(),
            },
          }
        )
    }
    if (user) {
      client
        .db(DB)
        .collection(`Users`)
        .updateOne(
          { username: req.body.username },
          {
            $set: {
              otp_code: otpCode,
              otp_timelife: moment().tz(TIMEZONE).add(5, 'minutes').format(),
            },
          }
        )
    }
    res.send({ success: true, data: `Gửi OTP đến số điện thoại thành công!` })
  } catch (err) {
    next(err)
  }
}

module.exports._verifyOTP = async (req, res, next) => {
  try {
    ;['username', 'otp_code'].map((e) => {
      if (!req.body[e]) {
        throw new Error(`400: Thiếu thuộc tính ${e}!`)
      }
    })
    const prefix = (req.headers && req.headers.shop) || false
    let business = await (async () => {
      if (prefix) {
        let result = client
          .db(SDB)
          .collection('Business')
          .findOne({ prefix: prefix })
        return result
      }
      let result = client
        .db(SDB)
        .collection('Business')
        .findOne({ username: req.body.username })
      return result
    })()
    const DB = (business && business.database_name) || ''
    let rootUser = await client
      .db(SDB)
      .collection('Business')
      .findOne({ username: req.body.username })
    let user = await client
      .db(DB)
      .collection('Users')
      .findOne({ username: req.body.username })
    if (!user) {
      throw new Error('400: Tài khoản người dùng không tồn tại!')
    }
    if (req.body.otp_code != user.otp_code) {
      throw new Error(
        '400: Mã xác thực không chính xác hoặc đã hết hạn sử dụng!'
      )
    }
    if (user.active == false) {
      delete user.password
      if (rootUser) {
        delete rootUser.password
        await client
          .db(SDB)
          .collection('Business')
          .updateOne(
            { username: req.body.username },
            {
              $set: {
                otp_code: false,
                otp_timelife: false,
                active: true,
              },
            }
          )
      }
      await client
        .db(DB)
        .collection('Users')
        .updateOne(
          { username: req.body.username },
          {
            $set: {
              otp_code: false,
              otp_timelife: false,
              active: true,
            },
          }
        )
      let [userData] = await client
        .db(DB)
        .collection('Users')
        .aggregate([
          { $match: { username: req.body.username } },
          {
            $lookup: {
              from: 'Roles',
              localField: 'role_id',
              foreignField: 'role_id',
              as: '_role',
            },
          },
          { $unwind: { path: '$_role', preserveNullAndEmptyArrays: true } },
          {
            $lookup: {
              from: 'Branchs',
              localField: 'branch_id',
              foreignField: 'branch_id',
              as: '_branch',
            },
          },
          { $unwind: { path: '$_branch', preserveNullAndEmptyArrays: true } },
          {
            $lookup: {
              from: 'Stores',
              localField: 'store_id',
              foreignField: 'store_id',
              as: '_store',
            },
          },
          { $unwind: { path: '$_store', preserveNullAndEmptyArrays: true } },
        ])
        .toArray()
      let accessToken = await jwt.createToken(
        { ...userData, database: DB, _business: business },
        30 * 24 * 60 * 60
      )
      res.send({
        success: true,
        message: 'Kích hoạt tài khoản thành công!',
        data: { accessToken: accessToken },
      })
    } else {
      if (rootUser) {
        await client
          .db(SDB)
          .collection('Business')
          .updateOne(
            { username: req.body.username },
            { $set: { otp_code: true, otp_timelife: true } }
          )
      }
      await client
        .db(DB)
        .collection('Users')
        .updateOne(
          { username: req.body.username },
          { $set: { otp_code: true, otp_timelife: true } }
        )
      let [userData] = await client
        .db(DB)
        .collection('Users')
        .aggregate([
          { $match: { username: req.body.username } },
          {
            $lookup: {
              from: 'Roles',
              localField: 'role_id',
              foreignField: 'role_id',
              as: '_role',
            },
          },
          { $unwind: { path: '$_role', preserveNullAndEmptyArrays: true } },
          {
            $lookup: {
              from: 'Branchs',
              localField: 'branch_id',
              foreignField: 'branch_id',
              as: '_branch',
            },
          },
          { $unwind: { path: '$_branch', preserveNullAndEmptyArrays: true } },
          {
            $lookup: {
              from: 'Stores',
              localField: 'store_id',
              foreignField: 'store_id',
              as: '_store',
            },
          },
          { $unwind: { path: '$_store', preserveNullAndEmptyArrays: true } },
        ])
        .toArray()
      let accessToken = await jwt.createToken(
        { ...userData, database: DB, _business: business },
        30 * 24 * 60 * 60
      )
      res.send({
        success: true,
        message: `Mã OTP chính xác, xác thực thành công!`,
        data: { accessToken: accessToken },
      })
    }
  } catch (err) {
    next(err)
  }
}

module.exports._recoveryPassword = async (req, res, next) => {
  try {
    ;['username', 'password'].map((e) => {
      if (!req.body[e]) {
        throw new Error(`400: Thiếu thuộc tính ${e}!`)
      }
    })
    const prefix = (req.headers && req.headers.shop) || false
    let business = await (async () => {
      if (prefix) {
        let result = client
          .db(SDB)
          .collection('Business')
          .findOne({ prefix: prefix })
        return result
      }
      let result = client
        .db(SDB)
        .collection('Business')
        .findOne({ username: req.body.username })
      return result
    })()
    const DB = (business && business.database_name) || ''
    let rootUser = client.db(SDB).collection('Business').findOne({
      username: req.body.username,
      otp_code: true,
      otp_timelife: true,
    })
    let user = client.db(DB).collection('Users').findOne({
      username: req.body.username,
      otp_code: true,
      otp_timelife: true,
    })
    if (!user) {
      throw new Error(`400: Tài khoản chưa được xác thực OTP!`)
    }
    await client
      .db(DB)
      .collection('Users')
      .updateOne(
        { username: req.body.username },
        {
          $set: {
            password: bcrypt.hash(req.body.password),
            otp_code: false,
            otp_timelife: false,
          },
        }
      )
    if (rootUser) {
      await client
        .db(SDB)
        .collection('Business')
        .updateOne(
          { username: req.body.username },
          {
            $set: {
              password: bcrypt.hash(req.body.password),
              otp_code: false,
              otp_timelife: false,
            },
          }
        )
    }
    let [_user] = await client
      .db(DB)
      .collection(`Users`)
      .aggregate([
        { $match: { username: req.body.username } },
        {
          $lookup: {
            from: 'Roles',
            localField: 'role_id',
            foreignField: 'role_id',
            as: '_role',
          },
        },
        { $unwind: { path: '$_role', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'Branchs',
            localField: 'branch_id',
            foreignField: 'branch_id',
            as: '_branch',
          },
        },
        { $unwind: { path: '$_branch', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'Stores',
            localField: 'store_id',
            foreignField: 'store_id',
            as: '_store',
          },
        },
        { $unwind: { path: '$_store', preserveNullAndEmptyArrays: true } },
      ])
      .toArray()
    delete _user.password
    let accessToken = await jwt.createToken(
      { ..._user, database: DB, _business: business },
      30 * 24 * 60 * 60
    )
    res.send({
      success: true,
      message: 'Khôi phục mật khẩu thành công!',
      data: { accessToken: accessToken },
    })
  } catch (err) {
    next(err)
  }
}
