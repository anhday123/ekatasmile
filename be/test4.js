const client = require('./config/mongo/mongodb');

(async () => {
    let asd = await client
        .db('SaleManager')
        .collection('_Products')
        .insertMany([
            {
                username: 'asdasdouaod',
                password: 'asdasd',
            },
            {
                username: 'qeqweqwe',
                password: 'qweqe',
            },
        ]);
    console.log(asd);
})();
