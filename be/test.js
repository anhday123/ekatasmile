let arr = [
    [1, 2, 3],
    [3, 4, 5],
];

let obj = {
    a: (() => {
        let result = [];
        for (let i in arr) {
            result = result.concat(arr[i]);
        }
        result = [...new Set(result)];

        return result;
    })(),
    b: 2,
};

console.log(obj);
