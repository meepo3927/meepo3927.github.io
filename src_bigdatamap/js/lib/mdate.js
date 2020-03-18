/**
 * 日期选择插件
 */

;(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    }else {
        root.MDate = factory(window.jQuery);
    }
})(this, function($) {

    var docElem = document.documentElement;
    var $html = $(docElem || document.body);
    var $body = $(document.body);

    function padZero(num) {
        return (num < 10) ? ('0' + (num | 0)) : num;
    }

    function makeAttr(obj) {
        var arr = [];
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                var value = obj[i] || '';
                if (value.replace) {
                    value = value.replace(/"/g, '');
                }
                arr.push(i + '="' + value + '"');
            }
        }
        return ' ' + arr.join(' ') + ' ';
    }
    function getDateByYMD(y, m, d) {
        var date = new Date();
        if (isNaN(y) || isNaN(m)) {
            return date;
        }
        date.setDate(d || 1);
        date.setMonth(m - 1);
        date.setFullYear(y);
        // date.setHours(0);
        // date.setMinutes(0);
        return date;
    }
    function parseDate(str) {
        var p = (str + '').split('-');
        return getDateByYMD.apply(null, p);
    }
    function getYMDStr(date, format) {
        var ymd = getYMDByDate(date);
        format = format || 'YYYY-MM-DD';

        var year = ymd.y;
        var month = padZero(ymd.m);
        var day = padZero(ymd.d);
        
        format = format.replace(/YYYY/g, year);
        format = format.replace(/MM/g, month);
        format = format.replace(/DD/g, day);
        return format;
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
    function stopBubble(e) {
        e = e || window.event;
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
        return this;
    }

    function getPrevLastDay(date, ymd) {
        date = date || new Date();
        ymd = ymd || getYMDByDate(date);

        var newDate = new Date(ymd.y, ymd.m - 1, 1);
        var weekday = newDate.getDay();
        return (weekday != 0) ? weekday : (weekday + 7);
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    var MAX_DAY = [
        31, 28, 31, 30,
        31, 30, 31, 31,
        30, 31, 30, 31
    ];
    function getMaxDay(year, month) {
        if (month === 2) {
            return isLeapYear(year) ? 29 : 28;
        } else {
            return MAX_DAY[month - 1];
        }
    }
    var OFFSET_VALUE = {
        second: 1000,
        minute: 60 * 1000,
        hour: 3600 * 1000,
        day: 24 * 3600 * 1000
    };
    /**
     * 获取偏移date
     * @param  {Date} date
     * @param  {number} offset 数
     * @param  {unit} unit 单位
     */
    function getDateOffset(date, offsetNumber, unit) {
        if (typeof date === 'string') {
            date = parseDate(date);
        }
        var d = new Date();
        if (isNaN(offsetNumber)) {
            return date;
        }
        d.setTime(date.getTime());
        unit = unit || 'day';
        var offsetValue = 0;
        if (OFFSET_VALUE[unit]) {
            offsetValue = OFFSET_VALUE[unit] * offsetNumber;
            d.setTime(date.getTime() + offsetValue);
        } else if (unit === 'week') {
            offsetValue = OFFSET_VALUE.day * 7 * offsetNumber;
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
    function getDateOffsetStr(date, offsetNumber, unit, format) {
        var d = getDateOffset(date, offsetNumber, unit);
        return getYMDStr(d, format);
    }
    function checkDayHidden(format) {
        if (!format) {
            return false;
        }
        if (format.indexOf('DD') < 0) {
            return true;
        }
        return false;
    }
    var Util = {
        getYMD: getYMDStr,
        getYMDStr: getYMDStr,
        getYMDByDate: getYMDByDate,
        getDateByYMD: getDateByYMD,
        parseDate: parseDate,
        padZero: padZero,
        getDateOffsetStr: getDateOffsetStr,
        getDateOffset: getDateOffset
    };
    /**
     * @constructor
     *
     */
    function MDate(elem, options) {
        if (elem.jquery) {
            this.elem = $elem[0];
            this.$elem = elem;
        } else {
            this.elem = elem;
            this.$elem = $(elem);
        }
        
        if (!this.elem) {
            return;
        }
        this.options = options || {};
        this.options.format = this.options.format || 'YYYY-MM-DD';
        this.isDayHidden = checkDayHidden(this.options.format);
        this.elem.mDate = this;
        if (this.elem.tagName === 'INPUT') {
            this.mode = 'input';
            this.initInput();
        } else {

        }
    }
    var proto = MDate.prototype;

    proto.initInput = function () {
        var self = this;
        var delayHide = function () {
            setTimeout(function () {
                if (self.justActived()) {
                    return;
                }
                self.hideBox();
            }, 150);
        };
        this.$elem.prop('readonly', true);
        this.$elem.focus(function () {
            self.lastFocusTime = (new Date()).getTime();
            self.showBox();
        });
        this.$elem.click(function () {
            if (self.justFocused()) {
                return;
            }
            self.showBox();
        });
        this.$elem.blur(delayHide);
        // 自动关闭
        $html.on('mouseup', function (e) {
            e = e || window.event;
            var target = e.target || e.srcElement;
            if (!self.$box) {
                return true;
            }
            if ($.contains(self.$box[0], target) || target === self.elem || $.contains(self.elem, target)) {
                stopBubble(e);
                return false;
            } else {
                self.hideBox();
                return true;
            }
        });
    };
    proto.justActived = function () {
        if (this.lastActiveTime) {
            var time = (new Date()).getTime();
            var diff = time - this.lastActiveTime;
            if (diff < 200) {
                return true;
            }
        }
        return false;
    };
    proto.justFocused = function () {
        if (this.lastFocusTime) {
            var time = (new Date()).getTime();
            var diff = time - this.lastFocusTime;
            if (diff < 200) {
                return true;
            }
        }
        return false;
    };
    proto.showBox = function () {
        if (!this.$box) {
            this.$box = this.createBox();
            this.bind();
        }
        if (this.elem.value) {
            this.setValue(this.elem.value);
        }
        this.render();
        this.renderPosition();
        this.$box.show();
    };
    proto.hideBox = function () {
        if (this.$box) {
            this.$box.hide();
        }
    };
    proto.createBox = function () {
        var attrs = {};
        attrs['class'] = 'comp-mdate-box ';
        if (this.options.inline) {
            attrs['class'] += 'inline';
        } else {
            attrs['class'] += 'normal';
        }
        var html = [
            '<div ' + makeAttr(attrs) + '>',
                this.getHeadHtml(),
                this.getBodyHtml(),
                this.getFootHtml(),
            '</div>'
        ].join('');

        var $box = $(html);
        $box.css({
            top: '-999999px'
        });
        $body.append($box);

        this.$head = $box.find('.x-box-head');
        this.$year = this.$head.find('.x-show-year-text');
        this.$month = this.$head.find('.x-show-month-text');
        this.$yearMonthPanel = $box.find('.x-year-month-panel');
        this.$yearPanelPrev = this.$yearMonthPanel.find('.x-year-panel-prev');
        this.$yearPanelNext = this.$yearMonthPanel.find('.x-year-panel-next');
        this.$yearMonthCloseBtn = this.$yearMonthPanel.find('.x-close-year-month-panel-btn');
        this.$monthConfirmBtn = this.$yearMonthPanel.find('.x-month-confirm-btn');

        this.$list = $box.find('.x-day-list');

        this.$foot = $box.find('.x-box-foot');
        return $box;
    };

    proto.bind = function () {
        
        var self = this;
        this.$box.on('mousedown', function (e) {
            self.lastActiveTime = (new Date()).getTime();
        });
        this.$box.on('mouseup click', function (e) {
            return stopBubble(e);
        });
        // 年份上下
        this.$head.find('.year-prev').click(function (e) {
            var curDate = self.curDate;
            curDate.setDate(1);
            curDate.setFullYear(curDate.getFullYear() - 1);
            self.render();
            return stopBubble(e);
        });
        this.$head.find('.year-next').click(function (e) {
            var curDate = self.curDate;
            curDate.setDate(1);
            curDate.setFullYear(curDate.getFullYear() + 1);
            self.render();
            return stopBubble(e);
        });

        // 显示选择年份
        this.$head.find('.x-show-year-panel-btn').click(function (e) {
            self.panelValue = self.curDate.getFullYear();
            self.showYearMonthPanel('year');
            return stopBubble(e);
        });
        // 关闭选择年份
        this.$yearMonthCloseBtn.click(function (e) {
            if (self.isDayHidden) {
                self.showYearMonthPanel('month');
            } else {
                self.hideYearMonthPanel();
            }
            self.panelValue = 0;
            return stopBubble(e);
        });
        // 确定选择月份
        this.$monthConfirmBtn.click(function (e) {
            self.onChoose();
        });
        // 年份上一页
        this.$yearPanelPrev.click(function (e) {
            self.panelValue -= 15;
            self.showYearMonthPanel('year');

            return stopBubble(e);
        });
        // 年份下一页
        this.$yearPanelNext.click(function (e) {
            self.panelValue += 15;
            self.showYearMonthPanel('year');

            return stopBubble(e);
        });
        // 年份or月份 点击
        this.$yearMonthPanel.delegate('li', 'click', function (e) {
            var year = parseInt(
                this.getAttribute('data-y'),
                10
            );
            var month = parseInt(
                this.getAttribute('data-m'),
                10
            );
            self.curDate.setDate(1);

            if (year) { // 选择年份
                self.curDate.setFullYear(year);
                self.render();
            } else if (month) { // 选择月份
                self.curDate.setMonth(month - 1);

                if (self.isDayHidden) {
                    self.onChoose();
                } else {
                    self.render();
                }
            }
            if (!self.isDayHidden) {
                self.hideYearMonthPanel();
            }

            return stopBubble(e);
        });
        // 月份上下
        this.$head.find('.month-prev').click(function (e) {
            var curDate = self.curDate;
            curDate.setDate(1);
            curDate.setMonth(curDate.getMonth() - 1);
            self.render();
            return stopBubble(e);
        });
        this.$head.find('.month-next').click(function (e) {
            var curDate = self.curDate;
            curDate.setDate(1);
            curDate.setMonth(curDate.getMonth() + 1);
            self.render();
            return stopBubble(e);
        });
        // 显示选择月份
        this.$head.find('.x-show-month-panel-btn').click(function (e) {
            self.showYearMonthPanel('month');
            return stopBubble(e);
        });

        // 选择某一天
        this.$list.delegate('li', 'click', function (e) {
            var y = parseInt(this.getAttribute('data-y'), 10);
            var m = parseInt(this.getAttribute('data-m'), 10);
            var d = parseInt(this.getAttribute('data-d'), 10);
            if (y && m && d) {
                self.curDate.setFullYear(y);
                self.curDate.setDate(1);
                self.curDate.setMonth(m - 1);
                self.curDate.setDate(d);
                self.onChoose();
                self.render();
            }
            return stopBubble(e);
        });

        // 选择今天
        this.$foot.find('.x-choose-today').click(function () {
            var ymd = getYMDByDate();
            self.curDate.setFullYear(ymd.y);
            self.curDate.setDate(1);
            self.curDate.setMonth(ymd.m - 1);
            self.curDate.setDate(ymd.d);
            self.render();
            if (self.mode === 'input') {
                self.onChoose();
            }
        });
    };

    /**
     * 选择日期事件
     */
    proto.onChoose = function (date) {
        date = date || this.curDate || new Date;
        var value = this.getValue();
        if ('value' in this.elem) {
            this.elem.value = value;
        }

        if (this.options.onChoose) {
            this.options.onChoose.call(this, value);
        }

        this.hideBox();
    };
    proto.setValue = function (str) {
        if (typeof str === 'string') {
            this.curDate = parseDate(str);
            this.render();
        }
    };
    proto.getValue = function (date) {
        return getYMDStr(date || this.curDate, this.options.format);
    };

    proto.showYearMonthPanel = function (type) {
        // 年列表
        if (type === 'year') {
            this.$yearMonthPanel.removeClass('x-choose-month-panel');
            this.$yearMonthPanel.addClass('x-choose-year-panel');
            this.$yearPanelPrev.show();
            this.$yearPanelNext.show();
            this.$yearMonthCloseBtn.show();
            this.$monthConfirmBtn.hide();
            var html = "";
            var year = this.panelValue;
            for (var i = -7; i <= 7; i++) {
                var y = year + i;
                var attrs = {};
                attrs['data-y'] = y;
                if (y === this.curDate.getFullYear()) {
                    attrs['class'] = 'action';
                }
                html += '<li ' + makeAttr(attrs) + '>' + y + "年</li>";
            }
            this.$yearMonthPanel.find('ul').html(html);
            this.$yearMonthPanel.find('');
        } else if (type === 'month') {
            this.$yearMonthPanel.removeClass('x-choose-year-panel');
            this.$yearMonthPanel.addClass('x-choose-month-panel');
            this.$yearPanelPrev.hide();
            this.$yearPanelNext.hide();
            // 只能选择年 月
            if (this.isDayHidden) {
                this.$yearMonthCloseBtn.hide();
                this.$monthConfirmBtn.show();
            } else {
                this.$yearMonthCloseBtn.show();
                this.$monthConfirmBtn.hide();
            }
            var html = '';
            for (var i = 1; i <= 12; i++) {
                var attrs = {};
                if (i === (this.curDate.getMonth() + 1)) {
                    attrs['class'] = 'action';
                }
                attrs['data-m'] = i;
                html += '<li ' + makeAttr(attrs) + '>' + i + '月</li>';
            }
            this.$yearMonthPanel.find('ul').html(html);
        }
        this.$yearMonthPanel.show();
    };
    proto.hideYearMonthPanel = function () {
        this.$yearMonthPanel.hide();
    };

    proto.render = function (date, ymd) {
        date = date || this.curDate || new Date;
        ymd = ymd || getYMDByDate(date);

        this.curDate = date;
        if (this.$box) {
            this.renderHead(date, ymd);
            this.renderBody(date, ymd);
        }
    };

    proto.renderPosition = function () {
        if (this.options.inline) {
            return true;
        }

        // 窗口高度
        var htmlClientHeight = docElem.clientHeight || document.body.clientHeight;
        var htmlClientWidth = docElem.clientWidth || document.body.clientWidth;
        // 滚动条高度
        var scrollTop = docElem.scrollTop || document.body.scrollTop;
        var scrollLeft = docElem.scrollLeft || document.body.scrollLeft;

        // 输入框offset
        var inputOffset = this.$elem.offset();
        var inputHeight = this.$elem.outerHeight();
        var inputWidth = this.$elem.outerWidth();

        // 日期盒
        var boxHeight = this.$box.outerHeight();
        var boxWidth = this.$box.outerWidth();

        // 底部超出窗口
        var beyondBottom = false;
        var beyondLeft = false;
        if (inputOffset.top + inputHeight + boxHeight > htmlClientHeight + scrollTop) {
            beyondBottom = true;
        }
        if (inputOffset.left + inputWidth + boxWidth > htmlClientWidth + scrollLeft) {
            beyondLeft =  true;
        }

        if (beyondBottom) {
            var top = inputOffset.top - boxHeight;
        } else {
            top = inputOffset.top + inputHeight;
        }

        if (beyondLeft) {
            var left = inputOffset.left + inputWidth - boxWidth;
        } else {
            left = inputOffset.left;
        }

        if (top < 0) {
            top = 0;
        }

        if (left < 0) {
            left = 0;
        }

        this.$box.css({
            left: left + 'px',
            top: top + 'px'
        });
    };

    proto.renderHead = function (date, ymd) {
        this.$year.text(ymd.y + '年').attr('data-y', ymd.y);
        this.$month.text(ymd.m + '月').attr('data-m', ymd.m);
    };

    proto.renderBody = function (date, ymd) {
        var bodyHtml = this.getDateHtml(date, ymd);
        this.$list.html(bodyHtml);
        if (this.isDayHidden) {
            this.showYearMonthPanel('month');
        }
    };

    proto.isCurDay = function (y, m, d) {
        var ymd = getYMDByDate(this.curDate);
        if (ymd.y === y && ymd.m === m && ymd.d === d) {
            return true;
        }
        return false;
    };

    /**
     * 获取上个月html
     */
    proto.getPrevMonthHtml = function (date, ymd) {
        var weekday = ymd.w;
        var prevLastDay = getPrevLastDay(date, ymd);

        // 计算年份, 月份
        var year = ymd.y;
        var month = ymd.m - 1;
        if (month <= 0) {
            year--;
            month = 12;
        }

        var max = getMaxDay(year, month);

        var html = '';
        for (var i = prevLastDay - 1; i >= 0; i--) {
            var curDay = max - i;
            var attrs = {};
            attrs['class'] = 'prevdate ';
            if (this.isCurDay(year, month, curDay)) {
                attrs['class'] += 'action';
            }
            attrs['data-y'] = year;
            attrs['data-m'] = month;
            attrs['data-d'] = curDay;
            html += [
                '<li ' + makeAttr(attrs) + ' >',
                    curDay,
                '</li>'
            ].join('');
        }
        return html;
    };

    /**
     * 获取当月html
     *
     * @param      {Date}  date    The date
     */
    proto.getCurMonthHtml = function (date, ymd) {
        var max = getMaxDay(ymd.y, ymd.m);

        var html = '';
        for (var i = 1; i <= max; i++) {
            var attrs = {};
            attrs['class'] = ' ';
            if (this.isCurDay(ymd.y, ymd.m, i)) {
                attrs['class'] += 'action';
            }
            attrs['data-y'] = ymd.y;
            attrs['data-m'] = ymd.m;
            attrs['data-d'] = i;
            html += '<li ' + makeAttr(attrs) + ' >' + i + '</li>';
        }

        return html;
    };

    /**
     * 获取下个月html
     *
     * @param      {Date}  date    The date
     */
    proto.getNextMonthHtml = function (date, ymd) {

        var nextMax = 42 - getPrevLastDay(date, ymd) - getMaxDay(ymd.y, ymd.m);

        var year = ymd.y;
        var month = ymd.m + 1;
        if (ymd.m === 12) {
            year++;
            month = 1;
        }
        var html = '';
        for (var i = 1; i <= nextMax; i++) {
            var attrs = {};
            attrs['class'] = 'nextdate ';
            if (this.isCurDay(year, month, i)) {
                attrs['class'] += 'action';
            }
            attrs['data-y'] = year;
            attrs['data-m'] = month;
            attrs['data-d'] = i;
            html += '<li ' + makeAttr(attrs) + ' >' + i + '</li>';
        }
        return html;
    };

    /**
     * 获取当月html
     *
     * @param      {number}  y       年
     * @param      {number}  m       月
     * @param      {number}  d       日
     * @return     {string}  The date html.
     */
    proto.getDateHtml = function (date, ymd) {
        var prevHtml = this.getPrevMonthHtml(date, ymd);
        var curHtml = this.getCurMonthHtml(date, ymd);
        var nextHtml = this.getNextMonthHtml(date, ymd);

        var html = [
            prevHtml,
            curHtml,
            nextHtml
        ].join('');
        return html;
    };

    proto.getYearMonthListHtml = function () {
        var isYYMM = false;
        return !isYYMM ? [
            '<div class="x-year-month-panel" style="display: none;">',
                '<ul></ul>',
                '<p>',
                    '<span class="x-year-panel-prev">&#8592;</span>',
                    '<span class="x-year-panel-next">&#8594;</span>',
                    '<span class="x-close-year-month-panel-btn">关闭</span>',
                    '<span class="x-month-confirm-btn">确定</span>',
                '</p>',
            '</div>'
        ].join('') : [
            '<ul class="x-year-month-ul"></ul>'
        ].join('');
    };

    proto.getHeadHtml = function () {
        var isYYMM = false;
        var ymHtml = (!isYYMM) ? [
            // 选择年份
            '<div class="x-head-year-month" style="width:50%;">',
                '<i class="prev triangle year-prev"></i>',
                '<span class="x-show-year-panel-btn" data-ym="24">',
                    '<em class="x-show-year-text"></em>',
                    '<em class="tri-down"></em>',
                '</span>',
                '<i class="next triangle year-next"></i>',
            '</div>',

            // 选择月份
            '<div class="x-head-year-month" style="width:50%;">',
                '<i class="prev triangle month-prev"></i>',
                '<span class="x-show-month-panel-btn" data-ym="12">',
                    '<em class="x-show-month-text"></em>',
                    '<em class="tri-down"></em>',
                '</span>',
                '<i class="next triangle month-next"></i>',
            '</div>'
        ].join('') : [
            // 选择年份
            '<div class="x-head-year-month" style="width:100%;">',
                '<i class="prev triangle ymprev"></i>',
                '<span class="x-show-year-panel-btn">',
                    '<em class="x-show-year-month-text"></em>',
                '</span>',
                '<i class="next triangle ymnext"></i>',
            '</div>'
        ].join('');

        var html = [
            '<div class="x-box-head">',
                ymHtml,
            '</div>',
            this.getYearMonthListHtml()
        ].join('');

        return html;
    };

    var WEEKS = ['日', '一', '二', '三', '四', '五', '六'];

    proto.getWeekHtml = function () {
        var html = '';

        for (var i = 0; i < WEEKS.length; i++) {
            var item = WEEKS[i];
            html += [
                '<li class="weeks" data-week="' + item + '">' +item + '</li>'
            ].join('');
        }
        return html;
    };

    proto.getBodyHtml = function () {
        return [
            '<ol class="x-week-list" >',
                this.getWeekHtml(),
            '</ol>',
            '<ul class="x-day-list">',
            '</ul>'
        ].join('');
    };

    proto.getFootHtml = function () {
        return [
            '<div class="x-box-foot">',
                '<div class="x-foot-flex x-foot-btn-box" style="width: 100%;">',
                    '<span class="x-choose-today">今天</span>',
                '</div>',
            '</div>'
        ].join('');
    };
    MDate.Util = Util;
    return MDate;
});