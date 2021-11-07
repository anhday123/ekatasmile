const client = require('./config/mongo/mongodb');
const { ObjectId } = require('mongodb');
(async () => {
    await client
        .db('SaleManager')
        .collection('Variants')
        .deleteMany({ product_id: ObjectId('61879a700781f771eebd3bac') })
        .then((mess) => {
            console.log(mess);
        });
})();
