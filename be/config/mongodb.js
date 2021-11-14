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
    console.log('Database URI: ' + process.env.MONGO_DATABASE_URI);
    console.log('Database Name: ' + process.env.DATABASE);
    // client.db(process.env.DATABASE).collection('Products').deleteMany();
    // client.db(process.env.DATABASE).collection('Attributes').deleteMany();
    // client.db(process.env.DATABASE).collection('Variants').deleteMany();
    // client.db(process.env.DATABASE).collection('Locations').deleteMany();
});

_connect.catch((err) => {
    console.log(`Failed database connect: ${err.message}!`);
});

module.exports = client;