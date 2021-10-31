for (let i = 1; i <= 1000000; i++) {
    if (Math.ceil(1000000 / i) == 1000000 / i) {
        if (!String(i).includes('0') && !String(1000000 / i).includes('0')) {
            console.log(`a = ${i}`);
            console.log(`b = ${1000000 / i}`);
            console.log('-------------------------');
        }
    }
}
