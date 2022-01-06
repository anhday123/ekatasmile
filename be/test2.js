const moment = require('moment-timezone');
const timezone = 'Asia/Ho_Chi_Minh';

console.log(moment().tz(timezone).subtract(1, 'month').day(0).hour(0).minute(0).second(0).format());
