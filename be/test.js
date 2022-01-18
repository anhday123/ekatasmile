let arr = [
    { id: 1, name: 1 },
    { id: 2, name: 2 },
    { id: 3, name: 3 },
    { id: 4, name: 4 },
];

let result = arr.reduce((ans, eArr) => {
    ans[eArr.id] = eArr;
    return ans;
}, {});

console.log(result);
