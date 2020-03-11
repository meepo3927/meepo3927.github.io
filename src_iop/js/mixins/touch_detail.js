const URL = require('util/url.js');
const mounted = function () {};
const beforeDestroy = function () {};
const methods = {};
methods.$TouchDetailRequestData = function (p) {
    return Request.getTouchConfigInfo(p);
};
methods.$TouchDetailGetCommonRows = function () {
    const data = this.TouchDetailData;
    if (!data) {
        return [];
    }
    const listFilter = (data.listFilter === '0' || data.listFilter === '0000')
        ? '否'
        : '是';
    return [
        {label: '开始日期', content: data.beginDate},
        {label: '结束日期', content: data.endDate},
        {label: '特殊号码过滤', content: listFilter}
    ]
};
methods.$TouchDetailFetchData = function () {
    this.$emit('start-fetch');
    const p = {
        svcType: URL.query().svctype
    };
    return this.$TouchDetailRequestData(p).then((data) => {
        this.$emit('fetch-success', data);
        this.TouchDetailData = data;
    }).catch(() => {
        this.$emit('fetch-error');
        this.TouchDetailData = null;
    });
};
const computed = {};
module.exports = {
    data: function () {
        var o = {
            TouchDetailData: undefined
        };
        return o;
    },
    methods,
    computed,
    mounted,
    beforeDestroy
};