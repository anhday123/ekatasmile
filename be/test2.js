let arrs = [1, 2, 3, 1, 2, 3, 1, 1, 4, 5];
arrs = [...new Set(arrs)];

let objs = {
    a: 1,
    b: 2,
    c: 3,
};
console.log(Object.values(objs));
