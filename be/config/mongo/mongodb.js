const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_DATABASE_URI;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// let arr = [];
// for (let i = 1; i < 50; i += 2) {
//     let a = {
//         product_id: `${i}`,
//         bussiness: '1',
//         store: `1`,
//         branch: '1',
//         sku: 'PRD',
//         name: 'PRODUCT 1',
//         slug: 'cua-hang-so-1-product-1',
//         barcode: '123123',
//         category: '1',
//         image: [
//             'https://storage.googleapis.com/viesoftware0710/1628880177941_viesoftware0710_0.jpeg',
//         ],
//         length: 100,
//         width: 10,
//         height: 50,
//         weight: 1000,
//         warranty: [
//             {
//                 _id: '610924257e32c9107809801d',
//                 warranty_id: '2',
//                 bussiness: '1',
//                 code: 'VIESOFTWARE_2',
//                 name: 'BẢO HÀNH PHẦN CỨNG',
//                 type: 'hỗ trợ toàn giá',
//                 time: 6,
//                 description: 'mô tả',
//                 create_date: '2021-08-03T18:10:29+07:00',
//                 creator: '1',
//                 active: true,
//             },
//         ],
//         unit: 'Cái',
//         suppliers: '1',
//         has_variable: false,
//         import_price: 80000,
//         base_price: 100000,
//         sale_price: 400000,
//         available_stock_quantity: 250,
//         low_stock_quantity: 0,
//         out_stock_quantity: 0,
//         shipping_quantity: 0,
//         return_warehouse_quantity: 0,
//         status_check: 10,
//         status_check_value: 25,
//         status: 'available_stock',
//         create_date: '2021-08-16T17:44:22+07:00',
//         creator: '1',
//         active: true,
//     };
//     let b = {
//         product_id: `${i + 1}`,
//         bussiness: '1',
//         store: `1`,
//         branch: '1',
//         sku: 'SPM',
//         name: 'SẢN PHẨM MẪU',
//         slug: 'cua-hang-so-1-san-pham-mau',
//         barcode: '123123',
//         category: '1',
//         image: [
//             'https://storage.googleapis.com/viesoftware0710/1628880177941_viesoftware0710_0.jpeg',
//         ],
//         length: 100,
//         width: 10,
//         height: 100,
//         weight: 1000,
//         warranty: [
//             {
//                 _id: '610924257e32c9107809801d',
//                 warranty_id: '2',
//                 bussiness: '1',
//                 code: 'VIESOFTWARE_2',
//                 name: 'BẢO HÀNH PHẦN CỨNG',
//                 type: 'hỗ trợ toàn giá',
//                 time: 6,
//                 description: 'mô tả',
//                 create_date: '2021-08-03T18:10:29+07:00',
//                 creator: '1',
//                 active: true,
//             },
//         ],
//         unit: 'Cái',
//         suppliers: '1',
//         has_variable: true,
//         attributes: [
//             {
//                 option: 'COLOR',
//                 values: ['WHITE', 'BLACK'],
//             },
//             {
//                 option: 'SIZE',
//                 values: ['S', 'M'],
//             },
//         ],
//         variants: [
//             {
//                 title: `SẢN PHẨM MẪU ${i + 1} WHITE S`,
//                 sku: `SPM${i + 1}-WHITE-S`,
//                 image: [
//                     'https://storage.googleapis.com/viesoftware0710/1628880177941_viesoftware0710_0.jpeg',
//                 ],
//                 supplier: 'NCC1',
//                 options: [
//                     {
//                         name: 'COLOR',
//                         values: 'WHITE',
//                     },
//                     {
//                         name: 'SIZE',
//                         values: 'S',
//                     },
//                 ],
//                 import_price: 90000,
//                 base_price: 110000,
//                 sale_price: 500000,
//                 available_stock_quantity: 100,
//                 low_stock_quantity: 0,
//                 out_stock_quantity: 0,
//                 shipping_quantity: 0,
//                 return_warehouse_quantity: 0,
//                 status_check: 10,
//                 status_check_value: 10,
//                 status: 'available_stock',
//             },
//             {
//                 title: `SẢN PHẨM MẪU ${i + 1} WHITE M`,
//                 sku: `SPM${i + 1}-WHITE-M`,
//                 image: [
//                     'https://lavenderstudio.com.vn/wp-content/uploads/2017/09/chup-hinh-quang-cao-12-1.jpg',
//                     'https://www.chuphinhsanpham.vn/wp-content/uploads/2019/07/studio-chup-anh-my-pham-tphcm-1.jpg',
//                 ],
//                 supplier: 'NCC1',
//                 options: [
//                     {
//                         name: 'COLOR',
//                         values: 'WHITE',
//                     },
//                     {
//                         name: 'SIZE',
//                         values: 'M',
//                     },
//                 ],
//                 import_price: 150000,
//                 base_price: 200000,
//                 sale_price: 600000,
//                 available_stock_quantity: 300,
//                 low_stock_quantity: 0,
//                 out_stock_quantity: 0,
//                 shipping_quantity: 0,
//                 return_warehouse_quantity: 0,
//                 status_check: 10,
//                 status_check_value: 30,
//                 status: 'available_stock',
//             },
//             {
//                 title: `SẢN PHẨM MẪU ${i + 1} BLACK S`,
//                 sku: `SPM${i + 1}-BLACK-S`,
//                 image: [
//                     'https://lavenderstudio.com.vn/wp-content/uploads/2017/09/chup-hinh-quang-cao-12-1.jpg',
//                     'https://www.chuphinhsanpham.vn/wp-content/uploads/2019/07/studio-chup-anh-my-pham-tphcm-1.jpg',
//                 ],
//                 supplier: 'NCC1',
//                 options: [
//                     {
//                         name: 'COLOR',
//                         values: 'BLACK',
//                     },
//                     {
//                         name: 'SIZE',
//                         values: 'S',
//                     },
//                 ],
//                 import_price: 90000,
//                 base_price: 150000,
//                 sale_price: 700000,
//                 available_stock_quantity: 300,
//                 low_stock_quantity: 0,
//                 out_stock_quantity: 0,
//                 shipping_quantity: 0,
//                 return_warehouse_quantity: 0,
//                 status_check: 10,
//                 status_check_value: 30,
//                 status: 'available_stock',
//             },
//             {
//                 title: `SẢN PHẨM MẪU ${i + 1} BLACK M`,
//                 sku: `SPM${i + 1}-BLACK-M`,
//                 image: [
//                     'https://lavenderstudio.com.vn/wp-content/uploads/2017/09/chup-hinh-quang-cao-12-1.jpg',
//                     'https://www.chuphinhsanpham.vn/wp-content/uploads/2019/07/studio-chup-anh-my-pham-tphcm-1.jpg',
//                 ],
//                 supplier: 'NCC1',
//                 options: [
//                     {
//                         name: 'COLOR',
//                         values: 'BLACK',
//                     },
//                     {
//                         name: 'SIZE',
//                         values: 'M',
//                     },
//                 ],
//                 import_price: 50000,
//                 base_price: 100000,
//                 sale_price: 1000000,
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
//         create_date: '2021-08-16T17:44:22+07:00',
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
        //     .collection(`SaleProducts`)
        //     .insertMany(arr)
        //     .then((data) => {
        //         console.log(`data`);
        //     });
        // await client
        //     .db(process.env.DATABASE)
        //     .collection(`Users`)
        //     .findOne({ username: `phandangluu` })
        //     .then((data) => {
        //         console.log(data);
        //     });
    })
    .catch((err) => {
        console.log(`Failed database connect: ${err.message}!`);
    });

module.exports = client;
