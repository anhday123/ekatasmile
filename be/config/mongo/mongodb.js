require('dotenv').config();
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_DATABASE_URI;
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
    // await client.db(process.env.DATABASE).collection('Actions').deleteMany({});
    // await client.db(process.env.DATABASE).collection('Attributes').deleteMany({});
    // await client.db(process.env.DATABASE).collection('Branchs').deleteMany({});
    // await client.db(process.env.DATABASE).collection('Careers').deleteMany({});
    // await client.db(process.env.DATABASE).collection('Categories').deleteMany({});
    // await client.db(process.env.DATABASE).collection('CompareSessions').deleteMany({});
    // await client.db(process.env.DATABASE).collection('Compares').deleteMany({});
    // await client.db(process.env.DATABASE).collection('Customers').deleteMany({});
    // await client.db(process.env.DATABASE).collection('DeliveryNotes').deleteMany({});
    // await client.db(process.env.DATABASE).collection('Labels').deleteMany({});
    // await client.db(process.env.DATABASE).collection('Locations').deleteMany({});
    // await client.db(process.env.DATABASE).collection('Orders').deleteMany({});
    // await client.db(process.env.DATABASE).collection('PointSettings').deleteMany({});
    // await client.db(process.env.DATABASE).collection('Products').deleteMany({});
    // await client.db(process.env.DATABASE).collection('Promotions').deleteMany({});
    // await client
    //     .db(process.env.DATABASE)
    //     .collection('Roles')
    //     .deleteMany({ default: { $ne: true } });
    // await client.db(process.env.DATABASE).collection('ShippingCompanies').deleteMany({});
    // await client.db(process.env.DATABASE).collection('Stores').deleteMany({});
    // await client.db(process.env.DATABASE).collection('Suppliers').deleteMany({});
    // await client.db(process.env.DATABASE).collection('Taxes').deleteMany({});
    // await client.db(process.env.DATABASE).collection('Toppings').deleteMany({});
    // await client.db(process.env.DATABASE).collection('Users').deleteMany({});
    // await client.db(process.env.DATABASE).collection('Variants').deleteMany({});
    // await client.db(process.env.DATABASE).collection('VertifyLinks').deleteMany({});
    // await client.db(process.env.DATABASE).collection('Warranties').deleteMany({});
});

_connect.catch((err) => {
    console.log(`Failed database connect: ${err.message}!`);
});

module.exports = client;
