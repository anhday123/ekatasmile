require(`dotenv`).config();
const client = require('./config/mongodb');
const { _countries } = require('./templates/countries');
const { _districts } = require('./templates/districtVN');
const { _provinces } = require('./templates/provinceVN');
const { _wards } = require('./templates/wardVN');
const DB = process.env.DATABASE;

(async () => {
    await client.db(DB).collection('Wards').insertMany(_wards);
    await client.db(DB).collection('Districts').insertMany(_districts);
    await client.db(DB).collection('Provinces').insertMany(_provinces);
    await client.db(DB).collection('Countries').insertMany(_countries);
    console.log(`done`);
    client.close();
})();
