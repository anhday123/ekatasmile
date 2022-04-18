const client = require('./config/mongodb');

async function increasePoint(customer, point) {
    const session = client.startSession();
    session.startTransaction();
    try {
        let _customer = await client
            .db('dangluuDB')
            .collection('Customers')
            .findOneAndUpdate(
                { customer_id: customer.customer_id },
                { $inc: { point: point } },
                { session, returnOriginal: false }
            );
        // await session.commitTransaction();
        session.endSession();
    } catch (err) {
        // await session.abortTransaction();
        session.endSession();
        throw err;
    }
}

(async () => {
    let customer = await client.db('dangluuDB').collection('Customers').findOne({ customer_id: 3 });
    await increasePoint(customer, 10);
})();
