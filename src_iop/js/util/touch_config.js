const Calendar = require('util/calendar.js');

// 获取本波次最早可选日期：上一波次的最晚结束时间+2天
const getEarliestAvaiableDate = (prevtime) => {
    if (!prevtime || !prevtime.touchList) {
        return undefined;
    }
    const list = prevtime.touchList;
    let latestDate;
    for (let i = 0; i < list.length; i++) {
        if (list[i].form && list[i].form.endDate) {
            if (!latestDate) {
                latestDate = list[i].form.endDate;
                continue;
            }

            if (latestDate < list[i].form.endDate) {
                latestDate = list[i].form.endDate;
            }
        }
    }
    if (!latestDate) {
        return undefined;
    }
    return Calendar.getOffsetStr(latestDate, 2);
};

export default {
    getEarliestAvaiableDate
}