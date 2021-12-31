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
    resolve(`Successful database connect!`);
});

_connect.then(async (message) => {
    console.log(message);
    console.log('Database URI: ' + process.env.MONGO_DATABASE_URI);
    console.log('Database Name: ' + process.env.DATABASE);
});

_connect.catch((err) => {
    console.log(`Failed database connect: ${err.message}!`);
});

module.exports = client;
