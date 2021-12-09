var CryptoJS = require('crypto-js');
let order = {
    sale_location: {
        store_id: 1,
    },
    customer_id: 1,
    employee_id: 1,
    order_details: [
        {
            product_id: 20,
            variant_id: 56,
            quantity: 10,
            total_cost: 5000000,
            discount: 560000,
            final_cost: 4440000,
        },
        {
            product_id: 20,
            variant_id: 57,
            quantity: 10,
            total_cost: 600000,
            discount: 0,
            final_cost: 600000,
        },
    ],
    payments: [
        {
            id_payment: 1,
            method: 'CASH',
            value: 1000000,
        },
        {
            id_payment: 2,
            method: 'CARD',
            value: 2000000,
        },
    ],
    shipping_company_id: '',
    shipping_info: {
        ship_code: 'SHIPCODE',
        to_name: 'Phan Đăng Lưu',
        to_phone: '0967845619',
        to_address: 'C7C/18H Phạm Hùng',
        to_ward: 'Xã Bình Hưng',
        to_district: 'Huyện Bình Chánh',
        to_province: 'Hồ Chí Minh',
        to_province_code: 202,
        to_postcode: 727010,
        to_country_code: 'VN',
        return_name: 'Người bán',
        return_phone: '01694789265',
        return_address: '41 đường số 12',
        return_ward: 'Phường 10',
        return_district: 'Quận Gò Vấp',
        return_province: 'Hồ Chí Minh',
        return_province_code: 202,
        return_postcode_code: 727010,
        return_country_code: 'VN',
        cod: 20000,
        delivery_time: '2021-09-30T00:00:00+07:00',
        complete_time: '2021-10-30T00:00:00+07:00',
    },
    voucher: '',
    promotion_id: '',
    total_cost: 1500000,
    total_tax: 150000,
    total_discount: 0,
    final_cost: 1350000,
    customer_paid: 1350000,
    customer_debt: 0,
    bill_status: 'DRAFT',
    ship_status: 'DRAFT',
    note: 'note',
    tags: ['TAG1', 'TAG2'],
};

// console.log(JSON.stringify(order));
// Encrypt
var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(order), 'viesoftwarethanhcong').toString();
console.log(ciphertext);

// Decrypt
var bytes = CryptoJS.AES.decrypt(ciphertext, 'viesoftwarethanhcong');
var originalText = bytes.toString(CryptoJS.enc.Utf8);

// console.log(originalText); // 'my message'
