const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};
methods.getStyleOptions = function () {
    return [
        {text: '模板1(红色背景)', value: '1'},
        {text: '模板2(黄色背景)', value: '2'},
        {text: '模板3(蓝色背景)', value: '3'},
        {text: '模板4(紫色背景)', value: '4'},
        {text: '模板5(绿色背景)', value: '5'},
        {text: '模板6(黑色背景)', value: '6'},
        {text: '模板7(白色背景)', value: '7'}
    ];
};
methods.getBannerColorOptions = function () {
    return [
        {text: '根据页面风格自适应', value: '0'}
    ].concat(this.getStyleOptions());
};
methods.getBannerOptions = function () {
    return [
        {text: '模板1（中国移动LOGO）', value: 2},
        {text: '模板2（最新活动）', value: 3},
        {text: '模板3（聚惠来袭）', value: 4}
    ];
};
// 页面风格
methods.getPageStyleTemp = function (v) {
    let arr = this.getStyleOptions();
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].value == v) {
            return arr[i].text;
        }
    }
};

// 标题图片
methods.getBannerTemp = function (v, data) {
    v = parseInt(v, 10);
    if (v === 0) { // 自定义图片
        return this.getImageHtml(this.fixImageUrl(data.bannerSelfJpg));
    } else if (v === 1) { // 自定义文字
        return this.vTool.escapeHTML(data.bannerSelfChar);
    } else { // 选择模板
        let arr = this.getBannerOptions();
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].value === v) {
                return arr[i].text;
            }
        }
    }
};
// 活动内容
methods.getActContent = function (type, data) {
    type = parseInt(type, 10);
    if (type === 1) {
        return this.vTool.escapeHTML(data.actContentChar);
    } else if (type === 2) {
        let url = this.fixImageUrl(data.actContentJpg);
        return this.getImageHtml(url);
    }
};
let computed = {};
module.exports = {
    props: [],
    data: function () {
        var o = {};
        return o;
    },
    methods,
    computed,
    created,
    mounted,
    activated,
    deactivated,
    beforeDestroy,
    components: {}
};