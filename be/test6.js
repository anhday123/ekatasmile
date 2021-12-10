let obj1 = { a: 1, b: 2, c: 3 };
let obj2 = { b: 5, d: 5 };
obj1 = { ...obj1, ...obj2 };
console.log(obj1);

