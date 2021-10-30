require('dotenv').config();
const client = require('./config/mongo/mongodb');
const { ObjectId } = require('mongodb');
const DB = 'testAPI';
const moment = require('moment-timezone');
(async () => {
    //     await client.db(DB).collection('testIndex').createIndex({ username: 1 }, { unique: true });
    //     await client.db(DB).collection('testIndex').createIndex({ user_id: 1 }, { unique: true });
    //     // await client.db(DB).collection('testIndex').dropIndexes();
    //     // let result = await client.db(DB).collection('testIndex').indexInformation();
    //     let _user = {
    //         username: 'phandangluu4',
    //         password: '123456',
    //     };
    //     let [max] = await client.db(DB).collection('testIndex').find({}).sort({ user_id: -1 }).limit(1).toArray();
    //     console.log(max);
    //     if (!max) {
    //         _user = { ..._user, ...{ user_id: 0 } };
    //     } else {
    //         _user = { ..._user, ...{ user_id: max.user_id + 1 } };
    //     }
    //     let result = await client.db(DB).collection('testIndex').insertOne(_user);
    //     console.log(result);
    let _insert = {
        name: 'PRD1',
    };
    await client.db(DB).collection('testIndex').updateOne(_user);
    client.close();
})();

console.log('1' > '11');
