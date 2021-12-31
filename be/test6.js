require(`dotenv`).config();
const client = require('./config/mongodb');
const DB = process.env.DATABASE;

(async () => {
    await client.db(DB).collection('Products').deleteMany();
    await client.db(DB).collection('Attributes').deleteMany();
    await client.db(DB).collection('Variants').deleteMany();
    await client.db(DB).collection('Locations').deleteMany();
    await client.db(DB).collection('Prices').deleteMany();
    await client.db(DB).collection('Products').deleteMany();
    console.log(`done`);
    client.close();
})();
