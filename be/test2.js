// let arrs = [{ product_id: 1, name: 1 }, { product_id: 2, name: 2 }, { product_id: 3, name: 3 }, { name: 4 }, null];
// let _arrs = arrs.reduce((pre, cur) => ({ ...pre, ...(cur && cur.product_id && { [cur.product_id]: cur }) }), {});
// console.log(_arrs);

let func = () => new Error(`Lỗi`);

let a = func();

console.log(a);
