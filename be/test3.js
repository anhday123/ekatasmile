// let _list = new Set([]);
// for (let i = 0; i < 10; i++) _list.add(i);
// for (let item of _list) console.log(item);
db.createUser({
    user: "salemanager",
    pwd: "salemanager@123456",
    roles: [{ role: "readWrite", db: "SaleManager" }],
});
