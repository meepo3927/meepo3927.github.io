const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};
methods.getImageHtml = function (url, o = {}) {
    let className = o.className || '';
    if (!url) {
        return '';
    }
    return `
        <img class="o-image ${className}" src="${url}" />
    `.trim();
};
let computed = {};
computed.touchData = function () {
    return this.vRequest.getTouchData();
};

const getFilterText = (v) => {
    if (!v) {
        return '无';
    }
    let a = ['黑名单', '红名单', '敏感客户', '全国家庭网'];
    let r = [];
    for (let i = 0; i < v.length; i++) {
        if (v.charAt(i) === '1') {
            r.push(a[i]);
        }
    }
    return (r.length > 0) ? r.join('，') : '无';
};
const getFrequencyText = (v) => {
    const map = {
        1: '日',
        2: '月'
    };
    if (map[v]) {
        return '每' + map[v] + '更新';
    }
    return '无';
};
computed.rows1 = function () {
    let data = this.touchData || {};
    return [
        // {label: '营销活动', html: '事件营销'},
        {label: '开始日期', html: data.beginDate},
        {label: '结束日期', html: data.endDate},
        {label: '更新周期', html: getFrequencyText(data.frequency)},
        {label: '特殊号码过滤', html: getFilterText(data.listFilter)}
    ];
};
computed.rows2 = function () {
    let data = this.touchData || {};
    return [
        {label: '渠道活动整体描述', html: data.channelDesc}
    ];
};
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
    mixins: [
        require('mixins/wap_config.js')
    ],
    activated,
    deactivated,
    beforeDestroy,
    components: {
        'v-row': require('comp/touch/detail-row.vue')
    }
};