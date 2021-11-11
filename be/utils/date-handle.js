const moment = require('moment-timezone');

let createTimeline = (timelineObject, timezone) => {
    /*
        timelineObject là object cần chứa mốc thời gian cần tạo
        timezone là object chuỗi xác định múi giờ https://momentjs.com/timezone/
        múi giờ thường dùng Asia/Ho_Chi_Minh
        trả về object cũ chứa thời gian bắt đầu from_date và thời gian kết thúc to_date
    */
    if (typeof timelineObject != 'object') {
        throw new Error('Timeline must be object!');
    }
    if (timezone == undefined) {
        timezone = 'Asia/Ho_Chi_Minh';
    }
    if (typeof timezone != 'string') {
        throw new Error('Timezone must be string!');
    }
    if (timelineObject['today'] != undefined) {
        timelineObject[`from_date`] = new Date(moment.tz(timezone).format(`YYYY-MM-DD 00:00:00`));
        timelineObject[`to_date`] = new Date(moment.tz(timezone).format(`YYYY-MM-DD 23:59:59`));
        console.log(timelineObject[`to_date`]);
        delete timelineObject.today;
    }
    if (timelineObject['yesterday'] != undefined) {
        timelineObject[`from_date`] = new Date(
            moment.tz(timezone).add(-1, `days`).format(`YYYY-MM-DD 00:00:00`)
        );
        timelineObject[`to_date`] = new Date(
            moment.tz(timezone).add(-1, `days`).format(`YYYY-MM-DD 23:59:59`)
        );
        delete timelineObject.yesterday;
    }
    if (timelineObject['this_week'] != undefined) {
        timelineObject[`from_date`] = new Date(
            moment.tz(timezone).isoWeekday(1).format(`YYYY-MM-DD 00:00:00`)
        );
        timelineObject[`to_date`] = new Date(moment.tz(timezone).isoWeekday(7).format(`YYYY-MM-DD 23:59:59`));
        delete timelineObject.this_week;
    }
    if (timelineObject['last_week'] != undefined) {
        timelineObject[`from_date`] = new Date(
            moment
                .tz(timezone)
                .isoWeekday(1 - 7)
                .format(`YYYY-MM-DD 00:00:00`)
        );
        timelineObject[`to_date`] = new Date(
            moment
                .tz(timezone)
                .isoWeekday(7 - 7)
                .format(`YYYY-MM-DD 23:59:59`)
        );
        delete timelineObject.last_week;
    }
    if (timelineObject['this_month'] != undefined) {
        timelineObject[`from_date`] = new Date(moment.tz(timezone).format(`YYYY-MM-01 00:00:00`));
        timelineObject[`to_date`] = new Date(
            moment.tz(timezone).format(`YYYY-MM-${String(moment.tz(timezone).daysInMonth())} 23:59:59`)
        );
        delete timelineObject.this_month;
    }
    if (timelineObject['last_month'] != undefined) {
        timelineObject[`from_date`] = new Date(
            moment.tz(timezone).add(-1, `months`).format(`YYYY-MM-01 00:00:00`)
        );
        timelineObject[`to_date`] = new Date(
            moment
                .tz(timezone)
                .add(-1, `months`)
                .format(`YYYY-MM-${String(moment.tz(timezone).add(-1, `months`).daysInMonth())} 23:59:59`)
        );
        delete timelineObject.last_month;
    }
    if (timelineObject['this_year'] != undefined) {
        timelineObject[`from_date`] = new Date(moment.tz(timezone).format(`YYYY-01-01 00:00:00`));
        timelineObject[`to_date`] = new Date(moment.tz(timezone).format(`YYYY-12-31 23:59:59`));
        delete timelineObject.this_year;
    }
    if (timelineObject['last_year'] != undefined) {
        timelineObject[`from_date`] = new Date(
            moment.tz(timezone).add(-1, `years`).format(`YYYY-01-01 00:00:00`)
        );

        timelineObject[`to_date`] = new Date(
            moment.tz(timezone).add(-1, `years`).format(`YYYY-12-31 23:59:59`)
        );
        delete timelineObject.last_year;
    }
    if (timelineObject['from_date'] != undefined) {
        timelineObject[`from_date`] = new Date(
            moment(timelineObject[`from_date`]).tz(timezone).format('YYYY-MM-DD 00:00:00')
        );
    }
    if (timelineObject['to_date'] != undefined) {
        timelineObject[`to_date`] = new Date(
            moment(timelineObject[`to_date`]).tz(timezone).format('YYYY-MM-DD 23:59:59')
        );
    }
    return timelineObject;
};

module.exports = { createTimeline };
