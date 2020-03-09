const tool = require('util/tool.js');
const echarts = require('echarts');
const $ = require('jquery');
const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
const pixelToInch = (pixel) => {
    return pixel / 96;
    //return pixel / 75;
};
const hex = (x) => {
    return ("0" + parseInt(x).toString(16)).slice(-2);
};
const transNumber = (str) => {
    let s = '';
    for (var i = 0 ; i < str.length; i++) {
        if (!isNaN(str[i])  || str[i] === '.') {
            s += str[i];
        } else {
            break;
        }
    }
    return parseFloat(s);
};
const transColor = (color) => {
    if (color[0] === '#') {
        return color.substr(1);
    } else if (~color.indexOf('rgba')) {
        let r = color.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)$/);
        return hex(r[1]) + hex(r[2]) + hex(r[3]);
    } else if (~color.indexOf('rgb')) {
        let rgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        return hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    }
    return color;
};
const getText = ($elem) => {
    let t = $elem.text().trim();
    t = t.replace(/\t/g, '');
    return t;
};

const getFontSize = ($elem) => {
    let str = $elem.css('font-size');
    let n = transNumber(str);
    if (n <= 13) {
        return Math.round(n) - 2;
    }
    return Math.round(n * 0.714);
};

const getBackColor = ($elem) => {
    let color = $elem.css('background-color');
    return transColor(color);
};
const getColor = ($elem) => {
    let color = $elem.css('color');
    return transColor(color);
};
const getBorder = ($elem) => {
    let color = transColor($elem.css('border-color'));
    let w = $elem.css('border-width');
    let pt = transNumber(Math.round(w));
    return {pt, color};
};
const getFontFace = ($elem) => {
    let str = $elem.css('font-family');
    str = str.replace(/"/g, '');
    return str.split(',')[0];
};
const getBold = ($elem) => {
    let weight = $elem.css('font-weight');
    if (isNaN(weight)) {
        return (weight === 'bold') ? true : false;
    }
    return (weight >= 600);
};
const getShadow = ($elem) => {
    let ss = $elem.css('text-shadow');
    if (ss === 'none') {
        return undefined;
    }
    return {
        type: 'outer',
        angle: 135,
        blur: 4,
        color: '999999',
        offset: 2,
        opacity: 0.75
    };
};
let methods = {};
methods.pptxlog = function (o) {
    LOG(JSON.parse(JSON.stringify(o)));
};
methods.pptxCommonProcess = function (slide) {
    slide.back = this.pptxSlideBackColor;
};
// 父子-文字
methods.getParentChildText = function ($parent, $child, $box) {
    let o1 = $parent.offset();
    let o2 = $box.offset();
    let options = {
        h: pixelToInch($parent.outerHeight()),
        w: pixelToInch($parent.outerWidth()),
        x: pixelToInch(o1.left - o2.left),
        y: pixelToInch(o1.top - o2.top),
        fill: getBackColor($parent),
        align: $child.css('text-align'),
        fontSize: getFontSize($child),
        fontFace: getFontFace($child),
        bold: getBold($child),
        color: getColor($child)
    };
    return {
        options, text: getText($child)
    };
};
methods.pptxRenderBox = function (slide, pptx, $box, $el) {
    if ($box.length === 0) {
        return;
    }
    let o1 = $box.offset();
    let o2 = $el.offset();
    let options = {
        h: pixelToInch($box.outerHeight()),
        w: pixelToInch($box.outerWidth()),
        x: pixelToInch(o1.left - o2.left),
        y: pixelToInch(o1.top - o2.top),
        fill: getBackColor($box)
    };
    LOG('renderBox:');
    this.pptxlog(options);
    slide.addShape(pptx.shapes.RECTANGLE, options);
};
methods.pptxRenderTable = function (slide, pptx, $table, $el) {
    let rows = [];
    let o1 = $table.offset();
    let o2 = $el.offset();
    let options = {
        //h: pixelToInch($table.outerHeight()),
        w: pixelToInch($table.outerWidth()),
        x: pixelToInch(o1.left - o2.left),
        y: pixelToInch(o1.top - o2.top)
    };
    let rowH = 40;
    let colW = [];
    $table.find('tr').each(function () {
        let $tr = $(this);
        let myRow = [];
        $tr.children().each(function () {
            let $cell = $(this);
            // 单元格 高度
            if ($cell.is('th')) {
                rowH = $cell.outerHeight();
                colW.push($cell.outerWidth());
            }
            let text = $cell.text().trim();
            let o = {
                align: $cell.css('text-align'),
                fontFace: getFontFace($cell),
                fontSize: getFontSize($cell),
                fill: getBackColor($cell),
                color: getColor($cell),
                border: getBorder($cell),
                bold: getBold($cell),
                valign: 'middle'
            };
            myRow.push({text,options: o});
        });
        rows.push(myRow);
    });
    options.rowH = pixelToInch(rowH);
    options.colW = colW.map((w) => {
        return pixelToInch(w);
    });
    LOG('addTable:');
    this.pptxlog(rows);
    this.pptxlog(options);
    slide.addTable(rows, options);
};
// Slide 标题
methods.pptxCommonChartSlideHeadProcess = function (slide, pptx, $el) {
    let $wrapper = $el.children('.right-wrapper');
    let $head = $wrapper.children('.x-head');
    let $h6 = $head.children('h6');
    if ($head.length === 0) {
        return;
    }
    let r = this.getParentChildText($head, $h6, $el);
    this.pptxlog(r.options);
    slide.addText(r.text, r.options);
};
// Slide 左
methods.pptxCommonChartSlideLBlockProcess = function (slide, pptx, $el) {
    let $block = $el.children('.left-block');
    this.pptxRenderBox(slide, pptx, $block, $el);
};
// Slide 文字描述
methods.pptxCommonChartSlideTipProcess = function (slide, pptx, $el) {
    let self = this;
    let $wrapper = $el.children('.right-wrapper');
    $wrapper.find('div.mid-tip').each(function () {
        let $tip = $(this);
        let $child = $tip.children('p');
        let r = self.getParentChildText($tip, $child, $el);
        LOG('SlideTipProcess:');
        self.pptxlog(r);
        slide.addText(r.text, r.options);
    });
};
// Slide 图表
methods.pptxCommonChartSlideECProcess = function (slide, pptx, $el) {
    let $wrapper = $el.children('.right-wrapper');
    let self = this;
    $wrapper.find('div.vue-echarts').each(function () {
        self.pptxAddImage(slide, pptx, this, $el);
    });
};
methods.pptxCommonChartSlideProcess = function (slide, pptx) {
    let $el = $(this.$el);
    this.pptxCommonChartSlideHeadProcess(slide, pptx, $el);
    this.pptxCommonChartSlideLBlockProcess(slide, pptx, $el);
    this.pptxCommonChartSlideTipProcess(slide, pptx, $el);
    this.pptxCommonChartSlideECProcess(slide, pptx, $el);
};
methods.pptxAddTextElem = function (slide, $elem, o) {
    let $parent = $elem.parents('.report-slide-box');
    let o1 = $elem.offset();
    let o2 = $parent.offset();
    let options = tool.extend({
        h: pixelToInch($elem.height()),
        w: pixelToInch($elem.width()),
        x: pixelToInch(o1.left - o2.left),
        y: pixelToInch(o1.top - o2.top),
        align: $elem.css('text-align'),
        fontSize: getFontSize($elem),
        fontFace: getFontFace($elem),
        bold: getBold($elem),
        color: getColor($elem),
        shadow: getShadow($elem)
    }, o);

    this.pptxlog(options);
    slide.addText(getText($elem), options);
    return slide;
};
methods.pptxAddImage = function (slide, pptx, elem, $el) {
    let instance = echarts.getInstanceByDom(elem);
    let data = instance.getDataURL({
        type: 'png',
        pixelRatio: 2
    });
    let $elem = $(elem);
    let o1 = $elem.offset();
    let o2 = $el.offset();
    let options = {
        h: pixelToInch($elem.outerHeight()),
        w: pixelToInch($elem.outerWidth()),
        x: pixelToInch(o1.left - o2.left),
        y: pixelToInch(o1.top - o2.top),
        data
    };
    LOG('addImage:');
    this.pptxlog(options);
    slide.addImage(options);
};
methods.pptxRenderTopLine = function (slide, pptx, $elem, $el) {
    let o1 = $elem.offset();
    let o2 = $el.offset();
    let lineColor = transColor($elem.css('border-top-color'));
    let h = transNumber($elem.css('border-top-width'));
    let options = {
        x: pixelToInch(o1.left - o2.left),
        y: pixelToInch(o1.top - o2.top),
        w: pixelToInch($elem.outerWidth()),
        h: pixelToInch(h),
        fill: lineColor
    };
    LOG('renderTopLine:');
    this.pptxlog(options);
    slide.addShape(pptx.shapes.RECTANGLE, options);
};
let computed = {};
computed.pptxSlideBackColor = function () {
    return 'EEEEEE';
};
let watch = {};
module.exports = {
    props: [],
    data: function () {
        var o = {};
        return o;
    },
    watch,
    methods,
    computed,
    created,
    mounted,
    activated,
    deactivated,
    beforeDestroy,
    mixins: [],
    components: {}
};