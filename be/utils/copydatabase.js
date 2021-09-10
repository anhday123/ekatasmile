const { MongoClient } = require('mongodb');
// URI database gốc
const sourceUri = `mongodb://salemanager:salemanager%40123456@103.81.87.65:27017/admin?authSource=SaleManager&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false`;
const sourceClient = new MongoClient(sourceUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
// URI database cần copy đến
const destinationUri = `mongodb://dangluu%40:%40Luu123456@103.81.87.65:27017/admin?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false`;
const destinationClient = new MongoClient(destinationUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

new Promise(async (resolve, reject) => {
    await sourceClient.connect().catch((err) => {
        reject(err);
    });
    await destinationClient.connect().catch((err) => {
        reject(err);
    });
    resolve(`Successfull database connect!`);
})
    .then(async (message) => {
        console.log(message);
        new Promise(async (resolve_1, reject_1) => {
            // Tên database gốc
            let sourceDatabaseName = `SaleManager`;
            // Tên database cần copy đến
            let destinationDatabaseName = `test`;
            // Các collection cần copy để mảng rỗng nếu muốn copy toàn bộ
            let collections = [];
            let _check = [];
            if (collections.length == 0) {
                let _collections = await sourceClient.db(sourceDatabaseName).collections();
                for (let i in _collections) collections.push(_collections[i].namespace.split(`.`)[1]);
            }
            for (let i in collections) {
                let data1 = await sourceClient.db(sourceDatabaseName).collection(collections[i]).find({}).toArray();
                if (data1.length == 0) {
                    let data2 = await destinationClient
                        .db(destinationDatabaseName)
                        .collection(collections[i])
                        .insertOne({ tmp: `tmp` });
                    if (data2.insertedId) {
                        await destinationClient
                            .db(destinationDatabaseName)
                            .collection(collections[i])
                            .deleteMany({ tmp: `tmp` });
                        console.log(`done ${collections[i]}`);
                        _check.push(collections[i]);
                    }
                    continue;
                }
                let data2 = await destinationClient
                    .db(destinationDatabaseName)
                    .collection(collections[i])
                    .insertMany(data1);
                if (data2.insertedIds) {
                    _check.push(collections[i]);
                    console.log(`done ${collections[i]}`);
                }
            }
            for (let i in collections) {
                if (!_check.includes(collections[i])) console.log(`Error at ${collections[i]}`);
            }
            resolve_1();
        });
    })
    .catch((err) => {
        console.log(`Failed database 1 connect: ${err.message}!`);
    });
