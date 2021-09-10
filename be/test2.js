const moment = require(`moment-timezone`);

let a = moment
    .tz(`Asia/Ho_Chi_Minh`)
    .isoWeekday(1 - 7)
    .format();
let b = moment().add(1, `months`).daysInMonth();
let c = moment.tz(`Asia/Ho_Chi_Minh`).format();
let d = moment().tz(`Asia/Ho_Chi_Minh`).daysInMonth();
let e =
    String(moment().tz(`Asia/Ho_Chi_Minh`).format(`YYYY`)) +
    `-` +
    String(moment().tz(`Asia/Ho_Chi_Minh`).format(`MM`)) +
    `-` +
    String(`01`);

let data = { a: 1, b: 2, c: 3 };
let cur = data.a;
cur = 0;
console.log(data);
