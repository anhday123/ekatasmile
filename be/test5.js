var CryptoJS = require("crypto-js");
let order = {
    "sale_location": {
        "store_id": 1
    },
    "customer_id": 1,
    "employee_id": 1,
    "order_details": [
        {
            "product_id": 20,
            "variant_id": 56,
            "quantity": 10,
            "total_cost": 5000000,
            "discount": 560000,
            "final_cost": 4440000
        },
        {
            "product_id": 20,
            "variant_id": 57,
            "quantity": 10,
            "total_cost": 600000,
            "discount": 0,
            "final_cost": 600000
        }
    ],
    "payments": [
        {
            "id_payment":1,
            "method": "CASH",
            "value": 1000000
        },
        {
            "id_payment":2,
            "method": "CARD",
            "value": 2000000
        }
    ],
    "shipping_company_id": "",
    "shipping_info": {
        "ship_code": "SC1",
        "to_name": "Tên người nhận",
        "to_phone": "SĐT người nhận",
        "to_address": "Địa chỉ người nhận",
        "to_ward": "phường xã người nhận",
        "to_district": "quận huyện người nhận",
        "to_province": "tỉnh thành phố người nhận",
        "to_province_code": "tỉnh thành phố người nhận",
        "to_postcode": "tỉnh thành phố người nhận",
        "to_country_code": "tỉnh thành phố người nhận",
        "return_name": "Tên người nhận lại nếu đơn hàng bị hủy mặc định là nơi bán",
        "return_phone": "SĐT người nhận lại nếu đơn hàng bị hủy mặc định là nơi bán",
        "return_address": "Địa chỉ người nhận lại nếu đơn hàng bị hủy mặc định là nơi bán",
        "return_ward": "phường xã người nhận lại nếu đơn hàng bị hủy mặc định là nơi bán",
        "return_district": "quận huyện người nhận lại nếu đơn hàng bị hủy mặc định là nơi bán",
        "return_province": "tỉnh thành phố người nhận lại nếu đơn hàng bị hủy mặc định là nơi bán",
        "return_province_code": "tỉnh thành phố người nhận lại nếu đơn hàng bị hủy mặc định là nơi bán",
        "return_postcode_code": "tỉnh thành phố người nhận",
        "return_country_code": "tỉnh thành phố người nhận",
        "cod": 20000,
        "delivery_time": "2021-09-30T00:00:00+07:00",
        "complete_time": "2021-10-30T00:00:00+07:00"
    },
    "voucher": "CTKMS1_1438",
    "promotion_id": 1,
    "total_cost": 1500000,
    "total_tax": 150000,
    "total_discount": 0,
    "final_cost": 1350000,
    "customer_paid": 1350000,
    "customer_debt": 0,
    "bill_status": "DRAFT",
    "ship_status": "DRAFT",
    "note": "note",
    "tags": [
        "TAG1",
        "TAG2"
    ]
}

// console.log(JSON.stringify(order));
// Encrypt
var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(order), 'viesoftwarethanhcong').toString();
console.log(ciphertext);

// Decrypt
var bytes  = CryptoJS.AES.decrypt(ciphertext, 'viesoftwarethanhcong');
var originalText = bytes.toString(CryptoJS.enc.Utf8);

console.log(originalText); // 'my message'
