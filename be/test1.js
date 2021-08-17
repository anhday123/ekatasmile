let a = [...new Array(10)].map((item, index) => {
    return String(Math.random()).substr(2, 4);
});

console.log(a);
