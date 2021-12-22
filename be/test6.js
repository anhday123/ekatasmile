require(`dotenv`).config();
const client = require('./config/mongodb');
const DB = process.env.DATABASE;
const moment = require('moment-timezone');

(async () => {
    await client.db(DB).collection('Locations').deleteMany();

    console.log('done');
})();
