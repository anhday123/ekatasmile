class _object {
    constructor(obj) {
        this.name = obj.name || ``;
        this.value = obj.value || 0;
    }
    change(quantity) {
        if (typeof quantity != `number`) throw new Error(`Quantity is a numer`);
        this.value += quantity || 0;
    }
}

let test = { name: `old`, value: 10 };
test = new _object(test);
test.change('qưe');
test[`a`] = 5;
console.log(test);
