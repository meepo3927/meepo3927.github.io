
var config = require('global/config');

const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};
methods.search = function (keyword) {
    this.curPage = 1;
    var w = keyword.trim();
    if (!w) {
        this.olist = this.backlist;
        return;
    }
    var a = w.split(' ');
    let conditions = this.searchConditions;
    this.olist = this.backlist.filter((item) => {
        for (let i = 0; i < a.length; i++) {
            let word = a[i];
            if (!word) {
                continue;
            }
            for (let j = 0; j < conditions.length; j++) {
                let condition = conditions[j];
                if (item[condition].indexOf(word) >= 0) {
                    return true;
                }
            }
        }
        
        return false;
    });
};
methods.getRequestParam = function () {
    let p = {};
    if (config.user.flag === 'city') {
        p.cityId = config.user.code;
    } else if (config.user.flag === 'scenery') {
        p.sceneryId = config.user.code;
    }
    return p;
};
methods.changePage = function (v) {
    if (v === this.curPage) {
        return;
    }
    this.curPage = v;
};
methods.removeItem = function (item) {
    let i = this.backlist.indexOf(item);
    if (i >= 0) {
        this.backlist.splice(i, 1);
    }
    i = this.olist.indexOf(item);
    if (i >= 0) {
        this.olist.splice(i, 1);
    }
};
let computed = {};
computed.emptyVisible = function () {
    if (this.loading) {
        return false;
    }

    if (!this.plist || !this.plist.length) {
        return true;
    }
    return false;
};
computed.searchConditions = function () {
    return ['sceneryId', 'sceneryName'];
};
module.exports = {
    props: [],
    data: function () {
        var o = {
            backlist: [],
            loading: false
        };
        return o;
    },
    methods,
    mixins: [
        require('mixins/paging.js')
    ],
    computed,
    created,
    mounted,
    activated,
    deactivated,
    beforeDestroy,
    components: {
        'search-form': require('comp/common/table-search-form.vue'),
        'pagination': require('comp/manage/pagination.vue')
    }
};