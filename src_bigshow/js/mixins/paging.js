const methods = {};
const computed = {};
computed.mlist = function () {
    if (!this.olist) {
        return this.olist;
    }
    let start = (this.curPage - 1) * this.NUM_PER_PAGE;
    let end = start + this.NUM_PER_PAGE;
    return this.olist.slice(start, end);
};
computed.totalCount = function () {
    return (this.olist ? this.olist.length : 0);
};
computed.totalPage = function () {
    if (this.totalCount <= 0) {
        return 0;
    }
    return Math.floor((this.totalCount - 1) / this.NUM_PER_PAGE) + 1;
};
computed.NUM_PER_PAGE = function () {
    return 20;
};
module.exports = {
    data: function () {
        var o = {
            curPage: 1
        };
        return o;
    },
    methods,
    computed
};