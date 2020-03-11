const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};
let computed = {};
computed.$modelTypeOptions = function () {
    return [
        '4G产品', 'PCC', '其它', '基础服务', '宽带',
        '数字化服务', '流量'
    ]
};
computed.$modelCategoryOptions = function () {
    return [
        "异网客户识别","流失预警客户识别","异动客户识别及保有",
        "家宽用户识别","流量包推荐","终端换机识别","渠道偏好识别",
        "套餐升档匹配","不限量套餐潜在客户识别"
    ]
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