const moment = require('moment-timezone');

let createTimeline = (timeline, timezone) => {
    /*
        timeline là object cần chứa mốc thời gian cần tạo
        timezone là object chuỗi xác định múi giờ https://momentjs.com/timezone/
        trả về object cũ chứa thời gian bắt đầu from_date và thời gian kết thúc to_date
    */
    if (typeof timeline != 'object') {
        throw new Error('Timeline must be object!');
    }
    if (timezone == undefined) {
        timezone = 'Asia/Ho_Chi_Minh';
    }
    if (typeof timezone != 'string') {
        throw new Error('Timezone must be string!');
    }
    if (timeline['today'] != undefined) {
        timeline[`from_date`] = moment.tz(timezone).format(`YYYY-MM-DD`);
        delete timeline.today;
    }
    if (timeline['yesterday'] != undefined) {
        timeline[`from_date`] = moment.tz(timezone).add(-1, `days`).format(`YYYY-MM-DD`);
        timeline[`to_date`] = moment.tz(timezone).add(-1, `days`).format(`YYYY-MM-DD`);
        delete timeline.yesterday;
    }
    if (timeline['this_week'] != undefined) {
        timeline[`from_date`] = moment.tz(timezone).isoWeekday(1).format(`YYYY-MM-DD`);
        delete timeline.this_week;
    }
    if (timeline['last_week'] != undefined) {
        timeline[`from_date`] = moment
            .tz(timezone)
            .isoWeekday(1 - 7)
            .format(`YYYY-MM-DD`);
        timeline[`to_date`] = moment
            .tz(timezone)
            .isoWeekday(7 - 7)
            .format(`YYYY-MM-DD`);
        delete timeline.last_week;
    }
    if (timeline['this_month'] != undefined) {
        timeline[`from_date`] =
            String(moment().tz(timezone).format(`YYYY`)) +
            `-` +
            String(moment().tz(timezone).format(`MM`)) +
            `-` +
            String(`01`);
        delete timeline.this_month;
    }
    if (timeline['last_month'] != undefined) {
        timeline[`from_date`] =
            String(moment().tz(timezone).add(-1, `months`).format(`YYYY`)) +
            `-` +
            String(moment().tz(timezone).add(-1, `months`).format(`MM`)) +
            `-` +
            String(`01`);
        timeline[`to_date`] =
            String(moment().tz(timezone).add(-1, `months`).format(`YYYY`)) +
            `-` +
            String(moment().tz(timezone).add(-1, `months`).format(`MM`)) +
            `-` +
            String(moment().tz(timezone).add(-1, `months`).daysInMonth());
        delete timeline.last_month;
    }
    if (timeline['this_year'] != undefined) {
        timeline[`from_date`] =
            String(moment().tz(timezone).add(-1, `years`).format(`YYYY`)) +
            `-` +
            String(`01`) +
            `-` +
            String(`01`);
        delete timeline.this_year;
    }
    if (timeline['last_year'] != undefined) {
        timeline[`from_date`] =
            String(moment().tz(timezone).add(-1, `years`).format(`YYYY`)) +
            `-` +
            String(`01`) +
            `-` +
            String(`01`);
        timeline[`to_date`] =
            String(moment().tz(timezone).format(`YYYY`)) + `-` + String(`12`) + `-` + String(`31`);
        delete timeline.last_year;
    }
    if (timeline['from_date'] != undefined) {
        timeline[`from_date`] = moment(timeline[`from_date`]).tz(timezone).format();
    }
    if (timeline['to_date'] != undefined) {
        timeline[`to_date`] = moment(timeline[`to_date`])
            .tz(timezone)
            .add(1, 'days')
            .add(-1, 'seconds')
            .format();
    }
    return timeline;
};

module.exports = { createTimeline };
