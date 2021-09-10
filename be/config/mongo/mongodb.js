const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_DATABASE_URI;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// let arr = [];
// const moment = require(`moment`);
// for (let i = 1; i < 20; i++) {
//     let cus = {
//         warehouse_id: `${i}`,
//         bussiness: `1`,
//         code: `DEMOBUSSINESS_${i}`,
//         name: `CỬA HÀNG DEMO ${i}`,
//         type: `Chung`,
//         phone: `0967845619`,
//         capacity: 1000000,
//         monthly_cost: 5000000,
//         address: `Số nhà - tên đường`,
//         ward: `Xã/Phường`,
//         district: `Quận Gò Vấp`,
//         province: `Hồ Chí Minh`,
//         create_date: moment().format(),
//         creator: `1`,
//         active: true,
//     };
//     arr.push(cus);
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
        //     .collection(`DeliveryNotes`)
        //     .deleteMany({})
        //     .then((data) => {
        //         console.log(data);
        //     });
    })
    .catch((err) => {
        console.log(`Failed database connect: ${err.message}!`);
    });

module.exports = client;
