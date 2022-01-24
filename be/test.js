// let arr = [
//     { id: 1, value: 1 },
//     { id: 2, value: 2 },
//     { id: 3, value: 3 },
//     { id: 4, value: 4 },
// ];

// let result = arr.reduce((a, b) => ({ ...a, [b.id]: b }), {});

// const attributes = [
//     {
//         value: 'color',
//         options: ['black', 'blue'],
//     },
//     {
//         value: 'size',
//         options: ['S', 'M'],
//     },
// ];
// let result = attributes.reduce((a, b) => a.flatMap((d) => b.options.map((e) => d + '-' + e)), ['']);
// console.log(result);

let product = {
    product_id: 1,
    name: 'product name',
    attributes: [
        { value: 'color', options: ['black', 'blue'] },
        { value: 'size', options: ['s', 'm'] },
    ],
};
let result = product.attributes.reduce((init, curr) => {}, []);
console.log(result);
