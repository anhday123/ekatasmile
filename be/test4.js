require(`dotenv`).config();
const client = require('./config/mongodb');
const { Order } = require('./models/order');
const { Variant } = require('./models/product');
const DB = process.env.DATABASE;

(async () => {
    // await client.db(DB).collection('Actions').deleteMany();
    // await client.db(DB).collection('AppSetting').deleteMany();
    // await client.db(DB).collection('Attributes').deleteMany();
    // await client.db(DB).collection('Branchs').deleteMany();
    // await client.db(DB).collection('Categories').deleteMany();
    // await client.db(DB).collection('Customers').deleteMany();
    // await client.db(DB).collection('Labels').deleteMany();
    // await client.db(DB).collection('Locations').deleteMany();
    let orders = await client.db(DB).collection('Orders').find().toArray();
    await new Promise(async (resolve, reject) => {
        for (let i in orders) {
            let _order = new Order();
            _order.create(orders[i]);
            await client.db(DB).collection('Orders').updateOne({ order_id: _order.order_id }, { $set: _order });
        }
        resolve();
    });

    console.log(`done`);
    // await client.db(DB).collection('PointSettings').deleteMany();
    // await client.db(DB).collection('Products').deleteMany();
    // await client.db(DB).collection('Promotions').deleteMany();
    // await client.db(DB).collection('Roles').deleteMany();
    // await client.db(DB).collection('ShippingCompanies').deleteMany();
    // await client.db(DB).collection('Stores').deleteMany();
    // await client.db(DB).collection('Suppliers').deleteMany();
    // await client.db(DB).collection('Tables').deleteMany();
    // await client.db(DB).collection('Taxes').deleteMany();
    // await client.db(DB).collection('Toppings').deleteMany();
    // await client.db(DB).collection('Users').deleteMany();
    // await client.db(DB).collection('Variants').deleteMany();
    // await client.db(DB).collection('VertifyLinks').deleteMany();
    // await client.db(DB).collection('Warranties').deleteMany();
    client.close();
})();
