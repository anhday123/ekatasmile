var CryptoJS = require('crypto-js');
let order = {
    sale_location: {
        branch_id: 3,
    },
    customer_id: 1,
    employee_id: 1,
    order_details: [
        {
            product_id: 1,
            variant_id: 1,
            quantity: 2,
            price: 20000000,
            total_cost: 40000000,
            discount: 0,
            final_cost: 40000000,
        },
    ],
    payments: [
        {
            method: 'Tiền mặt',
            value: 0,
        },
    ],
    voucher: '',
    promotion_id: '',
    total_cost: 40000000,
    total_tax: 0,
    total_discount: 0,
    final_cost: 40000000,
    customer_paid: 40000000,
    customer_debt: 0,
    bill_status: 'COMPLETE',
    ship_status: 'DRAFT',
    note: '',
    tags: [],
};

// console.log(JSON.stringify(order));
// Encrypt
var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(order), 'viesoftwarethanhcong').toString();
console.log(ciphertext);

// Decrypt
var bytes = CryptoJS.AES.decrypt(ciphertext, 'viesoftwarethanhcong');
var originalText = bytes.toString(CryptoJS.enc.Utf8);

// console.log(originalText); // 'my message'
