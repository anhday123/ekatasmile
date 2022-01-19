let arr = [1, 2, 3, 4, 5];
let brr = [1, 6, 7, 8, 9];

console.log([...new Set([...arr, ...brr])].length != [...arr, ...brr].length);
