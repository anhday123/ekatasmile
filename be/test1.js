let suggest = (price) => {
    let coins = [1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000];
    let ans = new Set([price]);
    let len = coins.length;
    let mark = 0;
    for (let i in coins) {
        if (Math.ceil(price / coins[i]) * coins[i] > price)
            ans.add(Math.ceil(price / coins[i]) * coins[i]);
    }
    for (let i = len - 1; i >= 0; i--) {
        let amount = Math.floor(price / coins[i]);
        if (Math.floor(price / coins[i]) < Math.ceil(price / coins[i])) {
            ans.add(mark + Math.ceil(price / coins[i]) * coins[i]);
            mark += Math.floor(price / coins[i]) * coins[i];
        }
        price -= amount * coins[i];
    }
    ans = Array.from(ans);
    ans.sort((a, b) => {
        return a - b;
    });
    return ans;
};
console.log(suggest(33000));
