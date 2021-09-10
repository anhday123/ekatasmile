let a = [...new Array(10)].map((item, index) => {
    return String(Math.random()).substr(2, 4);
});

let createSub = (str) => {
    return str
        .normalize(`NFD`)
        .replace(/[\u0300-\u036f]|\s/g, ``)
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLocaleLowerCase();
};

let test = `á đ Đ`;

test = createSub(test);
console.log(test);
