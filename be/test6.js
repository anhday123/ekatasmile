require(`dotenv`).config();
const client = require('./config/mongodb');
const { _countries } = require('./templates/countries');
const { _districts } = require('./templates/districtVN');
const { _provinces } = require('./templates/provinceVN');
const { _wards } = require('./templates/wardVN');
const DB = 'dangluuDB';

(async () => {
    let inventories = await client.db(DB).collection('Inventories').find().toArray();
    await Promise.all(
        inventories.map((e) => {
            return client
                .db(DB)
                .collection('Inventories')
                .updateOne(
                    { inventory_id: e.inventory_id },
                    {
                        $set: {
                            begin_price: e.begin_quantity * 10000,
                            import_price: e.import_quantity * 10000,
                            export_price: e.export_quantity * 10000,
                            end_price: e.end_quantity * 10000,
                        },
                    }
                );
        })
    );
    console.log(`done`);
    client.close();
})();
