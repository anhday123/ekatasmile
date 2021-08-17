const { MongoClient } = require('mongodb');
const uri1 = `mongodb://171.244.203.25:27017/admin?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false`;
const client1 = new MongoClient(uri1, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const uri2 = `mongodb://salemanager:salemanager%40123456@103.81.87.65:27017/admin?authSource=SaleManager&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false`;
const client2 = new MongoClient(uri2, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

new Promise(async (resolve, reject) => {
    await client1.connect().catch((err) => {
        reject(err);
    });
    await client2.connect().catch((err) => {
        reject(err);
    });
    resolve(`Successfull database connect!`);
})
    .then(async (message) => {
        console.log(message);
        new Promise(async (resolve_1, reject_1) => {
            let collection = [
                `Actions`,
                `Branchs`,
                `Categories`,
                `Customers`,
                `DeliveryNotes`,
                `Districts`,
                `Orders`,
                `Payments`,
                `Permissions`,
                `Products`,
                `Promotions`,
                `Provinces`,
                `Roles`,
                `SaleProducts`,
                `Stores`,
                `Suppliers`,
                `Taxes`,
                `Transaction`,
                `Transports`,
                `Users`,
                `VertifyLinks`,
                `Wards`,
                `Warehouses`,
                `Warranties`,
            ];
            for (let i in collection) {
                let data1 = await client1
                    .db('SaleManager')
                    .collection(collection[i])
                    .find({})
                    .toArray();
                if (data1.length == 0) {
                    console.log(`create ${collection[i]}`);
                    continue;
                }
                let data2 = await client2
                    .db('SaleManager')
                    .collection(collection[i])
                    .insertMany(data1);
                console.log(`done ${collection[i]}`);
            }
            resolve_1();
        });
    })
    .catch((err) => {
        console.log(`Failed database 1 connect: ${err.message}!`);
    });
