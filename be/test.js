require(`dotenv`).config();
const client = require('./config/mongodb');
const { Action } = require('./models/action');
const DB = process.env.DATABASE;
const {ObjectId} = require('mongodb');
const { Attribute } = require('./models/product');
const { Branch } = require('./models/branch');
const { Category } = require('./models/category');
const { Customer } = require('./models/customer');

(async()=>{
    let actions = await client.db(DB).collection('Actions').find().toArray();
    await new Promise(async(resolve, reject)=>{
        for(let i in actions) {
            let _action = new Action();
            _action.create(actions[i]);
            await client.db(DB).collection('Actions').updateOne({_id: ObjectId(_action._id)},{$set:_action});
        }
        console.log(`done action`);
        resolve();
    });
    let attributes = await client.db(DB).collection('Attributes').find().toArray();
    await new Promise(async(resolve, reject)=>{
        for(let i in attributes) {
            let _attribute = new Attribute();
            _attribute.create(attributes[i]);
            await client.db(DB).collection('Attributes').updateOne({_id: ObjectId(_attribute._id)},{$set:_attribute});
        }
        console.log(`done Attributes`);
        resolve();
    });
    let branchs = await client.db(DB).collection('Branchs').find().toArray();
    await new Promise(async(resolve, reject)=>{
        for(let i in branchs) {
            let _branch = new Branch();
            _branch.create(branchs[i]);
            await client.db(DB).collection('Branchs').updateOne({_id: ObjectId(_branch._id)},{$set:_branch});
        }
        console.log(`done Branchs`);
        resolve();
    });
    let categories = await client.db(DB).collection('Categories').find().toArray();
    await new Promise(async(resolve, reject)=>{
        for(let i in categories) {
            let _category = new Category();
            _category.create(categories[i]);
            await client.db(DB).collection('Categories').updateOne({_id: ObjectId(_category._id)},{$set:_category});
        }
        console.log(`done Categories`);
        resolve();
    });
    let customers = await client.db(DB).collection('Customers').find().toArray();
    await new Promise(async(resolve, reject)=>{
        for(let i in customers) {
            let _customer = new Customer();
            _customer.create(customers[i]);
            await client.db(DB).collection('Customers').updateOne({_id: ObjectId(_customer._id)},{$set:_customer});
        }
        console.log(`done Customers`);
        resolve();
    });
    let labels = await client.db(DB).collection('Labels').find().toArray();
    await new Promise(async(resolve, reject)=>{
        for(let i in actions) {
            let _action = new Action();
            _action.create(actions[i]);
            await client.db(DB).collection('Actions').updateOne({_id: ObjectId(_action._id)},{$set:_action});
        }
        console.log(`done action`);
        resolve();
    });
    await client.db(DB).collection('Locations').find().toArray();
    await new Promise(async(resolve, reject)=>{
        for(let i in actions) {
            let _action = new Action();
            _action.create(actions[i]);
            await client.db(DB).collection('Actions').updateOne({_id: ObjectId(_action._id)},{$set:_action});
        }
        console.log(`done action`);
        resolve();
    });
    await client.db(DB).collection('Orders').find().toArray();
    await new Promise(async(resolve, reject)=>{
        for(let i in actions) {
            let _action = new Action();
            _action.create(actions[i]);
            await client.db(DB).collection('Actions').updateOne({_id: ObjectId(_action._id)},{$set:_action});
        }
        console.log(`done action`);
        resolve();
    });
    await client.db(DB).collection('PointSettings').find().toArray();
    await new Promise(async(resolve, reject)=>{
        for(let i in actions) {
            let _action = new Action();
            _action.create(actions[i]);
            await client.db(DB).collection('Actions').updateOne({_id: ObjectId(_action._id)},{$set:_action});
        }
        console.log(`done action`);
        resolve();
    });
    await client.db(DB).collection('Products').find().toArray();
    await new Promise(async(resolve, reject)=>{
        for(let i in actions) {
            let _action = new Action();
            _action.create(actions[i]);
            await client.db(DB).collection('Actions').updateOne({_id: ObjectId(_action._id)},{$set:_action});
        }
        console.log(`done action`);
        resolve();
    });
    await client.db(DB).collection('Promotions').find().toArray();
    await new Promise(async(resolve, reject)=>{
        for(let i in actions) {
            let _action = new Action();
            _action.create(actions[i]);
            await client.db(DB).collection('Actions').updateOne({_id: ObjectId(_action._id)},{$set:_action});
        }
        console.log(`done action`);
        resolve();
    });
    await client.db(DB).collection('Roles').find().toArray();
    await new Promise(async(resolve, reject)=>{
        for(let i in actions) {
            let _action = new Action();
            _action.create(actions[i]);
            await client.db(DB).collection('Actions').updateOne({_id: ObjectId(_action._id)},{$set:_action});
        }
        console.log(`done action`);
        resolve();
    });
    await client.db(DB).collection('ShippingCompanies').find().toArray();
    await new Promise(async(resolve, reject)=>{
        for(let i in actions) {
            let _action = new Action();
            _action.create(actions[i]);
            await client.db(DB).collection('Actions').updateOne({_id: ObjectId(_action._id)},{$set:_action});
        }
        console.log(`done action`);
        resolve();
    });
    await client.db(DB).collection('Stores').find().toArray();
    await new Promise(async(resolve, reject)=>{
        for(let i in actions) {
            let _action = new Action();
            _action.create(actions[i]);
            await client.db(DB).collection('Actions').updateOne({_id: ObjectId(_action._id)},{$set:_action});
        }
        console.log(`done action`);
        resolve();
    });
    await client.db(DB).collection('Suppliers').find().toArray();
    await new Promise(async(resolve, reject)=>{
        for(let i in actions) {
            let _action = new Action();
            _action.create(actions[i]);
            await client.db(DB).collection('Actions').updateOne({_id: ObjectId(_action._id)},{$set:_action});
        }
        console.log(`done action`);
        resolve();
    });
    await client.db(DB).collection('Tables').find().toArray();
    await new Promise(async(resolve, reject)=>{
        for(let i in actions) {
            let _action = new Action();
            _action.create(actions[i]);
            await client.db(DB).collection('Actions').updateOne({_id: ObjectId(_action._id)},{$set:_action});
        }
        console.log(`done action`);
        resolve();
    });
    await client.db(DB).collection('Taxes').find().toArray();
    await new Promise(async(resolve, reject)=>{
        for(let i in actions) {
            let _action = new Action();
            _action.create(actions[i]);
            await client.db(DB).collection('Actions').updateOne({_id: ObjectId(_action._id)},{$set:_action});
        }
        console.log(`done action`);
        resolve();
    });
    await client.db(DB).collection('Toppings').find().toArray();
    await new Promise(async(resolve, reject)=>{
        for(let i in actions) {
            let _action = new Action();
            _action.create(actions[i]);
            await client.db(DB).collection('Actions').updateOne({_id: ObjectId(_action._id)},{$set:_action});
        }
        console.log(`done action`);
        resolve();
    });
    await client.db(DB).collection('Users').find().toArray();
    await new Promise(async(resolve, reject)=>{
        for(let i in actions) {
            let _action = new Action();
            _action.create(actions[i]);
            await client.db(DB).collection('Actions').updateOne({_id: ObjectId(_action._id)},{$set:_action});
        }
        console.log(`done action`);
        resolve();
    });
    await client.db(DB).collection('Variants').find().toArray();
    await new Promise(async(resolve, reject)=>{
        for(let i in actions) {
            let _action = new Action();
            _action.create(actions[i]);
            await client.db(DB).collection('Actions').updateOne({_id: ObjectId(_action._id)},{$set:_action});
        }
        console.log(`done action`);
        resolve();
    });
    await client.db(DB).collection('VertifyLinks').find().toArray();
    await new Promise(async(resolve, reject)=>{
        for(let i in actions) {
            let _action = new Action();
            _action.create(actions[i]);
            await client.db(DB).collection('Actions').updateOne({_id: ObjectId(_action._id)},{$set:_action});
        }
        console.log(`done action`);
        resolve();
    });
    await client.db(DB).collection('Warranties').find().toArray();
    await new Promise(async(resolve, reject)=>{
        for(let i in actions) {
            let _action = new Action();
            _action.create(actions[i]);
            await client.db(DB).collection('Actions').updateOne({_id: ObjectId(_action._id)},{$set:_action});
        }
        console.log(`done action`);
        resolve();
    });
})()