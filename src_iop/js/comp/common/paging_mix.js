let mounted = function () {
};
let destroyed = function () {
};
let activated = function () {
};
let deactivated = function () {
};
let methods = {};
methods.pagingCut = function ({list, page} = {}) {
    if (page === undefined) {
        page = this.curPage;
    }
    if (list === undefined) {
        list = this.allList;
    }
    let start = (page - 1) * this.pagePerNum;
    let end = start + this.pagePerNum;
    return list.slice(start, end);
};
methods.processPaging = function (alist) {
    this.allList = alist || [];

    return this.pagingCut(this.allList, this.curPage);
};
let computed = {};
computed.paging = function () {
    return {
        start: this.pagingStart,
        end: this.pagingEnd,
        totalCount: this.totalCount,
        curPage: this.curPage,
        totalPage: this.pagingTotalPage
    };
};
computed.totalCount = function () {
    return this.allList.length;
};
computed.pagingStart = function () {
    return (this.curPage - 1) * this.pagePerNum + 1;
};
computed.pagingEnd = function () {
    let end = this.curPage * this.pagePerNum;
    if (end > this.totalCount) {
        return this.totalCount;
    }
    return end;
};
computed.pagingTotalPage = function () {
    return Math.floor((this.totalCount - 1) / this.pagePerNum) + 1;
};
computed.pagePerNum = function () {
    return 20;
};
module.exports = {
    props: [],
    data: function () {
        var o = {
            allList: [],
            curPage: 1
        };
        return o;
    },
    methods,
    computed,
    activated,
    deactivated,
    mounted: mounted,
    destroyed: destroyed
};