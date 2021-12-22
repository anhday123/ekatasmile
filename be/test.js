require(`dotenv`).config();
const client = require('./config/mongodb');
const { Action } = require('./models/action');
const DB = process.env.DATABASE;
const { ObjectId } = require('mongodb');
const { Attribute, Location, Product, Variant } = require('./models/product');
const { Branch } = require('./models/branch');
const { Category } = require('./models/category');
const { Customer } = require('./models/customer');
const { Label } = require('./models/label');
const { Order } = require('./models/order');
const { Promotion } = require('./models/promotion');
const { Role } = require('./models/role');
const { ShippingCompany } = require('./models/shipping-company');
const { Store } = require('./models/store');
const { Supplier } = require('./models/supplier');
const { Tax } = require('./models/tax');
const { User } = require('./models/user');

(async () => {
    // let actions = await client.db(DB).collection('Actions').find().toArray();
    // await new Promise(async(resolve, reject)=>{
    //     for(let i in actions) {
    //         let _action = new Action();
    //         _action.create(actions[i]);
    //         await client.db(DB).collection('Actions').updateOne({_id: ObjectId(actions[i]._id)},{$set:_action});
    //     }
    //     console.log(`done action`);
    //     resolve();
    // });
    // let attributes = await client.db(DB).collection('Attributes').find().toArray();
    // await new Promise(async(resolve, reject)=>{
    //     for(let i in attributes) {
    //         let _attribute = new Attribute();
    //         _attribute.create(attributes[i]);
    //         console.log(_attribute);
    //         await client.db(DB).collection('Attributes').updateOne({_id: ObjectId(attributes[i]._id)},{$set:_attribute});
    //     }
    //     console.log(`done Attributes`);
    //     resolve();
    // });
    // let branchs = await client.db(DB).collection('Branchs').find().toArray();
    // await new Promise(async(resolve, reject)=>{
    //     for(let i in branchs) {
    //         let _branch = new Branch();
    //         _branch.create(branchs[i]);
    //         await client.db(DB).collection('Branchs').updateOne({_id: ObjectId(branchs[i]._id)},{$set:_branch});
    //     }
    //     console.log(`done Branchs`);
    //     resolve();
    // });
    // let categories = await client.db(DB).collection('Categories').find().toArray();
    // await new Promise(async(resolve, reject)=>{
    //     for(let i in categories) {
    //         let _category = new Category();
    //         _category.create(categories[i]);
    //         await client.db(DB).collection('Categories').updateOne({_id: ObjectId(categories[i]._id)},{$set:_category});
    //     }
    //     console.log(`done Categories`);
    //     resolve();
    // });
    // let customers = await client.db(DB).collection('Customers').find().toArray();
    // await new Promise(async(resolve, reject)=>{
    //     for(let i in customers) {
    //         let _customer = new Customer();
    //         _customer.create(customers[i]);
    //         await client.db(DB).collection('Customers').updateOne({_id: ObjectId(customers[i]._id)},{$set:_customer});
    //     }
    //     console.log(`done Customers`);
    //     resolve();
    // });
    // let labels = await client.db(DB).collection('Labels').find().toArray();
    // await new Promise(async(resolve, reject)=>{
    //     for(let i in labels) {
    //         let _label = new Label();
    //         _label.create(labels[i]);
    //         await client.db(DB).collection('Labels').updateOne({_id: ObjectId(labels[i]._id)},{$set:_label});
    //     }
    //     console.log(`done Labels`);
    //     resolve();
    // });
    // let locations = await client.db(DB).collection('Locations').find().toArray();
    // await new Promise(async(resolve, reject)=>{
    //     for(let i in locations) {
    //         let _location = new Location();
    //         _location.create(locations[i]);
    //         await client.db(DB).collection('Locations').updateOne({_id: ObjectId(locations[i]._id)},{$set:_location});
    //     }
    //     console.log(`done Locations`);
    //     resolve();
    // });
    // let orders = await client.db(DB).collection('Orders').find().toArray();
    // await new Promise(async(resolve, reject)=>{
    //     for(let i in orders) {
    //         let _order = new Order();
    //         _order.create(orders[i]);
    //         await client.db(DB).collection('Orders').updateOne({_id: ObjectId(orders[i]._id)},{$set:_order});
    //     }
    //     console.log(`done Orders`);
    //     resolve();
    // });
    // let products = await client.db(DB).collection('Products').find().toArray();
    // await new Promise(async(resolve, reject)=>{
    //     for(let i in products) {
    //         let _product = new Product();
    //         _product.create(products[i]);
    //         await client.db(DB).collection('Products').updateOne({_id: ObjectId(products[i]._id)},{$set:_product});
    //     }
    //     console.log(`done Products`);
    //     resolve();
    // });
    // let promotions = await client.db(DB).collection('Promotions').find().toArray();
    // await new Promise(async(resolve, reject)=>{
    //     for(let i in promotions) {
    //         let _promotion = new Promotion();
    //         _promotion.create(promotions[i]);
    //         await client.db(DB).collection('Promotions').updateOne({_id: ObjectId(promotions[i]._id)},{$set:_promotion});
    //     }
    //     console.log(`done Promotions`);
    //     resolve();
    // });
    // let roles = await client.db(DB).collection('Roles').find().toArray();
    // await new Promise(async(resolve, reject)=>{
    //     for(let i in roles) {
    //         let _role = new Role();
    //         _role.create(roles[i]);
    //         await client.db(DB).collection('Roles').updateOne({_id: ObjectId(roles[i]._id)},{$set:_role});
    //     }
    //     console.log(`done Roles`);
    //     resolve();
    // });
    // let companies = await client.db(DB).collection('ShippingCompanies').find().toArray();
    // await new Promise(async(resolve, reject)=>{
    //     for(let i in companies) {
    //         let _company = new ShippingCompany();
    //         _company.create(companies[i]);
    //         await client.db(DB).collection('ShippingCompanies').updateOne({_id: ObjectId(companies[i]._id)},{$set:_company});
    //     }
    //     console.log(`done ShippingCompanies`);
    //     resolve();
    // });
    // let stores = await client.db(DB).collection('Stores').find().toArray();
    // await new Promise(async(resolve, reject)=>{
    //     for(let i in stores) {
    //         let _store = new Store();
    //         _store.create(stores[i]);
    //         await client.db(DB).collection('Stores').updateOne({_id: ObjectId(stores[i]._id)},{$set:_store});
    //     }
    //     console.log(`done Stores`);
    //     resolve();
    // });
    // let suppliers = await client.db(DB).collection('Suppliers').find().toArray();
    // await new Promise(async(resolve, reject)=>{
    //     for(let i in suppliers) {
    //         let _supplier = new Supplier();
    //         _supplier.create(suppliers[i]);
    //         await client.db(DB).collection('Suppliers').updateOne({_id: ObjectId(suppliers[i]._id)},{$set:_supplier});
    //     }
    //     console.log(`done Suppliers`);
    //     resolve();
    // });
    // await client.db(DB).collection('Tables').find().toArray();
    // await new Promise(async(resolve, reject)=>{
    //     for(let i in actions) {
    //         let _action = new Action();
    //         _action.create(actions[i]);
    //         await client.db(DB).collection('Actions').updateOne({_id: ObjectId(_actions[i]._id)},{$set:_action});
    //     }
    //     console.log(`done action`);
    //     resolve();
    // });
    // let taxes = await client.db(DB).collection('Taxes').find().toArray();
    // await new Promise(async (resolve, reject) => {
    //     for (let i in taxes) {
    //         let _tax = new Tax();
    //         _tax.create(taxes[i]);
    //         await client
    //             .db(DB)
    //             .collection('Taxes')
    //             .updateOne({ _id: ObjectId(taxes[i]._id) }, { $set: _tax });
    //     }
    //     console.log(`done Taxes`);
    //     resolve();
    // });
    // await client.db(DB).collection('Toppings').find().toArray();
    // await new Promise(async(resolve, reject)=>{
    //     for(let i in actions) {
    //         let _action = new Action();
    //         _action.create(actions[i]);
    //         await client.db(DB).collection('Actions').updateOne({_id: ObjectId(_action._id)},{$set:_action});
    //     }
    //     console.log(`done action`);
    //     resolve();
    // });
    let users = await client.db(DB).collection('Users').find().toArray();
    await new Promise(async (resolve, reject) => {
        for (let i in users) {
            let _user = new User();
            _user.create(users[i]);
            await client
                .db(DB)
                .collection('Users')
                .updateOne({ _id: ObjectId(users[i]._id) }, { $set: _user });
        }
        console.log(`done Users`);
        resolve();
    });
    // let variants = await client.db(DB).collection('Variants').find().toArray();
    // await new Promise(async (resolve, reject) => {
    //     for (let i in variants) {
    //         let _variant = new Variant();
    //         _variant.create(variants[i]);
    //         await client
    //             .db(DB)
    //             .collection('Variants')
    //             .updateOne({ _id: ObjectId(variants[i]._id) }, { $set: _variant });
    //     }
    //     console.log(`done Variants`);
    //     resolve();
    // });
    // await client.db(DB).collection('Warranties').find().toArray();
    // await new Promise(async(resolve, reject)=>{
    //     for(let i in actions) {
    //         let _action = new Action();
    //         _action.create(actions[i]);
    //         await client.db(DB).collection('Actions').updateOne({_id: ObjectId(_action._id)},{$set:_action});
    //     }
    //     console.log(`done action`);
    //     resolve();
    // });
})();
