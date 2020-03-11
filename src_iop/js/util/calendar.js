/**
 * Calendar工具类
 */
const OFFSET_VALUE = {
    second: 1000,
    minute: 60 * 1000,
    hour: 3600 * 1000,
    day: 24 * 3600 * 1000,
    week: 7 * 24 * 3600 * 1000
};
const MAX_DAY = [
    31, 28, 31, 30,
    31, 30, 31, 31,
    30, 31, 30, 31
];

const HOLIDAY_MAP = {
    '01-01': '元旦',
    '02-14': '情人节',
    '03-08': '妇女节',
    '03-12': '植树节',
    '03-14': '白色情人节',
    '03-15': '消费者权益日',
    '04-01': '愚人节',
    '04-05': '清明节',
    '05-01': '五一劳动节',
    '05-04': '五四青年节',
    '06-01': '儿童节',
    '07-01': '建党节',
    '08-01': '八一建军节',
    '09-10': '教师节',
    '10-01': '国庆节',
    '11-01': '万圣节',
    '11-11': '光棍节',
    '11-22': '感恩节',
    '12-24': '平安夜',
    '12-25': '圣诞节'
};
const LUNAR_HOLIDAY_MAP = {
    '01-01': '春节',
    '01-15': '元宵节',
    '05-05': '端午节',
    '07-07': '七夕',
    '08-15': '中秋节',
    '09-09': '重阳节',
    '12-08': '腊八节',
    '12-23': '小年',
    '12-30': '除夕'
};
const lunar = require('util/lunar.js');

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}
function getMaxDay(year, month) {
    if (month === 2) {
        return isLeapYear(year) ? 29 : 28;
    } else {
        return MAX_DAY[month - 1];
    }
}
function padZero(num) {
    return (num < 10) ? ('0' + (num | 0)) : num;
}
function copy(p) {
    let date = giveMeDate(p);
    if (!date) {
        return new Date();
    }
    let d = new Date;
    d.setTime(date.getTime());
    return d;
}
function getDateByYMD(y, m, d) {
    var date = new Date();
    if (isNaN(y) || isNaN(m)) {
        return date;
    }
    date.setDate(1);
    date.setMonth(m - 1);
    date.setDate(d || 1);
    date.setFullYear(y);
    // date.setHours(0);
    // date.setMinutes(0);
    return date;
}
function parseDate(str) {
    var p = (str + '').split('-');
    return getDateByYMD.apply(null, p);
}
function getYMDByDate(date) {
    date = date || new Date();
    return {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        w: date.getDay()
    };
}
function getYMD(date, format = 'YYYY-MM-DD') {
    var ymd = getYMDByDate(date);

    var year = ymd.y;
    var month = padZero(ymd.m);
    var day = padZero(ymd.d);
    
    format = format.replace(/YYYY/g, year);
    format = format.replace(/MM/g, month);
    format = format.replace(/DD/g, day);
    return format;
}
function buildStr(obj) {
    if (typeof obj === 'object') {
        let arr = [];
        if (obj.year) {
            arr.push(obj.year);
        }
        if (obj.month) {
            arr.push(padZero(obj.month));
        }
        if (obj.day) {
            arr.push(padZero(obj.day));
        }
        return arr.join('-');
    }
}
function buildStrCN(obj) {
    if (typeof obj === 'object') {
        let arr = [];
        if (obj.year) {
            arr.push(obj.year);
            arr.push('年');
        }
        if (obj.month) {
            arr.push(padZero(obj.month));
            arr.push('月')
        }
        if (obj.day) {
            arr.push(padZero(obj.day));
            arr.push('日')
        }
        return arr.join('');
    }
}
function giveMeDate(p) {
    if (p === undefined || p === null || p === '') {
        return null;
    }
    if (typeof p === 'string') {
        return parseDate(p);
    } else if (p instanceof Date) {
        return p;
    }
    return null;
}

function getCalendarArray(p, adaptFunc) {
    let date = giveMeDate(p);
    if (!date) {
        return [];
    }
    adaptFunc = adaptFunc || ((p) => {return p});
    const callback = (day, month, year, week, tag) => {
        return adaptFunc({
            day, month, year, week, tag,
            lunar: lunar(year, month, day)
        })
    };
    // 设置为1日，取星期
    // 星期一：1
    // 星期三：3
    // 星期六：6
    // 星期日：0
    let curMonth = date.getMonth() + 1;
    let curYear = date.getFullYear();
    date.setDate(1);
    let preWeek = date.getDay() || 7;
    // 设置为下个月1号的上一天，或者当月总天数
    date.setMonth(date.getMonth() + 1);
    let nextMonth = date.getMonth() + 1;
    let nextYear = date.getFullYear();
    date.setTime(date.getTime() - 24 * 3600 * 1000);

    let dayCount = date.getDate();

    // 取上个月的maxDay
    date.setDate(1);
    date.setMonth(date.getMonth() - 1);
    let prevMonth = date.getMonth() + 1;
    let prevYear = date.getFullYear();
    let prevMaxDay = getMaxDay(prevYear, prevMonth);

    let n = Math.ceil((preWeek + dayCount - 1)  / 7);
    let arr = [];
    let week = 1; // 周几
    let weekPlus = () => {
        week++;
        if (week >= 7) {
            week = 0;
        }
    };
    for (let i = preWeek - 2; i >= 0; i--) {
        arr.push(callback(prevMaxDay - i, prevMonth, prevYear, week, 'prev'));
        weekPlus();
    }
    for (let i = 1; i <= dayCount; i++) {
        arr.push(callback(i, curMonth, curYear, week));
        weekPlus();
    }
    let sub = n * 7 - arr.length;
    for (let i = 1; i <= sub; i++) {
        arr.push(callback(i, nextMonth, nextYear, week, 'next'));
        weekPlus();
    }
    return {
        list: arr
    }
}

function getOffsetDate(p, offsetNumber, unit = 'day') {
    let date = giveMeDate(p);
    if (!date || isNaN(offsetNumber)) {
        return null;
    }

    var d = copy(date);
    var offsetValue = 0;

    if (OFFSET_VALUE[unit]) {
        offsetValue = OFFSET_VALUE[unit] * offsetNumber;
        d.setTime(date.getTime() + offsetValue);
    } else if (unit === 'month') {
        // 防止日期溢出，先设置天为1，再修正
        let originDay = d.getDate();
        d.setDate(1);
        d.setMonth(date.getMonth() + offsetNumber);
        let maxDay = getMaxDay(d.getFullYear(), d.getMonth() + 1);
        d.setDate(Math.min(originDay, maxDay));
    } else if (unit === 'year') {
        d.setFullYear(date.getFullYear() + offsetNumber);
    }
    return d;
}
function getOffsetStr(date, offsetNumber, unit, format) {
    var d = getOffsetDate(date, offsetNumber, unit);
    return getYMD(d, format);
}
function isMotherDay(item) {
    if (item.month !== 5 || item.week !== 0) {
        return false;
    }
    // 5月第二个周日
    return (item.day >= 8 && item.day <= 14);
}
function isFatherDay(item) {
    if (item.month !== 6 || item.week !== 0) {
        return false;
    }
    // 6月第三个周日
    return (item.day >= 15 && item.day <= 21);
}
function getHoliday(item) {
    let date = getDateByYMD(item.year, item.month, item.day);
    let str = getYMD(date, 'MM-DD');
    let result = [];
    if (isMotherDay(item)) {
        result.push('母亲节');
    } else if (isFatherDay(item)) {
        result.push('父亲节');
    }
    if (HOLIDAY_MAP[str]) {
        result.push(HOLIDAY_MAP[str]);
    }
    let lunar = item.lunar;
    str = buildStr({month: lunar.month, day: lunar.day});
    if (LUNAR_HOLIDAY_MAP[str]) {
        result.push(LUNAR_HOLIDAY_MAP[str]);
    }
    return result.join('/');
}

var exports = {
    getDateByYMD,
    parseDate,
    getYMD,
    isLeapYear,
    getMaxDay,
    getCalendarArray,
    getOffsetDate,
    getOffsetStr,
    getHoliday,
    buildStr,
    buildStrCN
};


module.exports = exports;