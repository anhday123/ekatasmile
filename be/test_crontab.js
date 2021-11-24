const moment = require('moment-timezone');
const { MongoClient } = require('mongodb');
const uri = 'mongodb://dangluu%40:%40Luu123456@194.233.82.28:27017/';
const database = 'B2B';
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let _connect = new Promise(async (resolve, reject) => {
    await client.connect().catch((err) => {
        reject(err);
    });
    resolve(`Successfull database connect!`);
});

_connect.then(async (message) => {
    console.log(message);
    console.log('Database URI: ' + uri);
    console.log('Database Name: ' + database);

    await client
        .db(database)
        .collection('Variants')
        .updateMany({}, { $set: { price: 100000, regular_price: 100000 } });
    // await client.db('SGL').collection('Buckets').deleteMany({});
    // await client.db('SGL').collection('Categories').deleteMany({});
    // await client.db('SGL').collection('Customers').deleteMany({});
    // await client.db('SGL').collection('Fee').deleteMany({});
    // await client.db('SGL').collection('Shelves').deleteMany({});
    // await client.db('SGL').collection('Warehouses').deleteMany({});
    console.log(`done`);
    client.close();
});

_connect.catch((err) => {
    console.log(`Failed database connect: ${err.message}!`);
});
