const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_DATABASE_URI;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// let arr = [];
// for (let i = 1; i < 10000; i += 2) {
//     let a = {
//         product_id: `${i}`,
//         bussiness: '1',
//         warehouse: '1',
//         sku: `KJI${i}`,
//         name: `SP ${i}`,
//         barcode: '',
//         category: '1',
//         image: [
//             'https://storage.googleapis.com/viesoftware0710/1628880177941_viesoftware0710_0.jpeg',
//         ],
//         length: 0,
//         width: 0,
//         height: 0,
//         weight: 0,
//         warranty: [],
//         unit: '',
//         suppliers: '1',
//         has_variable: false,
//         import_price: 90000,
//         base_price: 100000,
//         sale_price: 500000,
//         available_stock_quantity: 1000,
//         low_stock_quantity: 0,
//         out_stock_quantity: 0,
//         shipping_quantity: 0,
//         return_warehouse_quantity: 0,
//         status_check: 10,
//         status_check_value: 100,
//         status: 'low_stock',
//         attributes: null,
//         variants: null,
//         description: null,
//         create_date: '2021-08-14T01:43:00+07:00',
//         creator: '1',
//         active: true,
//     };
//     let b = {
//         product_id: `${i + 1}`,
//         bussiness: '1',
//         warehouse: '13',
//         sku: `SKU ${i + 1}`,
//         name: `TÊN SẢN PHẨM ${i + 1}`,
//         barcode: '',
//         category: '2',
//         image: [],
//         length: 1,
//         width: 2,
//         height: 3,
//         weight: 4,
//         warranty: [],
//         unit: '',
//         suppliers: '9',
//         has_variable: true,
//         import_price: null,
//         base_price: null,
//         sale_price: null,
//         available_stock_quantity: null,
//         low_stock_quantity: null,
//         out_stock_quantity: null,
//         shipping_quantity: null,
//         return_warehouse_quantity: null,
//         status_check: null,
//         status_check_value: null,
//         status: null,
//         attributes: [
//             {
//                 values: ['S', 'M'],
//                 option: 'size',
//             },
//             {
//                 values: ['WHITE'],
//                 option: 'color',
//             },
//         ],
//         variants: [
//             {
//                 title: `TÊN SẢN PHẨM ${i + 1} S WHITE`,
//                 sku: `SKU${i + 1}-S-WHITE`,
//                 image: [
//                     'https://storage.googleapis.com/viesoftware0710/1628916560819_viesoftware0710_0.png',
//                 ],
//                 options: [
//                     {
//                         name: 'size',
//                         values: 's',
//                     },
//                     {
//                         values: ['WHITE'],
//                         name: 'color',
//                     },
//                 ],
//                 import_price: 120000,
//                 base_price: 150000,
//                 sale_price: 600000,
//                 available_stock_quantity: 1000,
//                 low_stock_quantity: 0,
//                 out_stock_quantity: 0,
//                 shipping_quantity: 0,
//                 return_warehouse_quantity: 0,
//                 status_check: 10,
//                 status_check_value: 100,
//                 status: 'available_stock',
//             },
//             {
//                 title: `TÊN SẢN PHẨM ${i + 1} M WHITE`,
//                 sku: `SKU${i + 1}-M-WHITE`,
//                 image: [
//                     'https://storage.googleapis.com/viesoftware0710/1628916560819_viesoftware0710_0.png',
//                 ],
//                 options: [
//                     {
//                         name: 'size',
//                         values: 'M',
//                     },
//                     {
//                         values: ['WHITE'],
//                         name: 'color',
//                     },
//                 ],
//                 import_price: 120000,
//                 base_price: 150000,
//                 sale_price: 600000,
//                 available_stock_quantity: 1000,
//                 low_stock_quantity: 0,
//                 out_stock_quantity: 0,
//                 shipping_quantity: 0,
//                 return_warehouse_quantity: 0,
//                 status_check: 10,
//                 status_check_value: 100,
//                 status: 'available_stock',
//             },
//         ],
//         description: null,
//         create_date: '2021-08-14T11:49:26+07:00',
//         creator: '1',
//         active: true,
//     };
//     arr.push(a);
//     arr.push(b);
// }

new Promise(async (resolve, reject) => {
    await client.connect().catch((err) => {
        reject(err);
    });
    resolve(`Successfull database connect!`);
})
    .then(async (message) => {
        console.log(message);
        // await client
        //     .db(process.env.DATABASE)
        //     .collection(`Products`)
        //     .insertMany(arr)
        //     .then((data) => {
        //         console.log(`data`);
        //     });
    })
    .catch((err) => {
        console.log(`Failed database connect: ${err.message}!`);
    });

module.exports = client;
