require(`dotenv`).config();
const client = require('./config/mongodb');
const DB = process.env.DATABASE;
const moment = require('moment-timezone');

(async () => {
    let orders = await client.db(DB).collection('Orders').find().toArray();
    await Promise.all(
        orders.map((order) => {
            client
                .db(DB)
                .collection('Orders')
                .updateOne(
                    {
                        order_id: Number(order.order_id),
                    },
                    {
                        $set: {
                            create_time: Number(moment(order.create_date).tz('Asia/Ho_Chi_Minh').format('HH')),
                        },
                    }
                );
        })
    );
    console.log('done');
})();
