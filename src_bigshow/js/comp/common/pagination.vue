<template>
<ul class="pagination" v-if="paramValid">
    <!-- 上一页 -->
    <li :class="{disabled: isFirstPage}">
        <a href="javascript:;" v-if="!isFirstPage" @click="prev">
            <span >&laquo;</span>
        </a>
        <span v-if="isFirstPage">
            <span >&laquo;</span>
        </span>
    </li>
    <li v-for="v in list" :class="{active: v.page === curPage, disabled: v.span}">
        <a href="javascript:;" v-text="v.page" v-if="v.page"
            @click="jump(v.page)"></a>
        <span v-if="v.span" v-text="v.span"></span>
    </li>
    <!-- 下一页 -->
    <li :class="{disabled: isLastPage}">
        <a href="javascript:;"  v-if="!isLastPage" @click="next">
            <span >&raquo;</span>
        </a>
        <span v-if="isLastPage">
            <span >&raquo;</span>
        </span>
    </li>
</ul>
</template>

<script>
let methods = {};
methods.prev = function () {
    if (this.isFirstPage) {
        return;
    }
    this.$emit('click', this.curPage - 1);
};
methods.jump = function (v) {
    this.$emit('click', v);
};
methods.next = function () {
    if (this.isLastPage) {
        return;
    }
    this.$emit('click', this.curPage + 1);
};
let computed = {};
const SIDE = 3;
computed.paramValid = function () {
    return (this.curPage > 0 && this.totalPage > 0);
};
computed.isFirstPage = function () {
    return (this.curPage === 1);
};
computed.isLastPage = function () {
    return (this.paramValid) && (this.curPage === this.totalPage);
};
computed.list = function () {
    if (!this.paramValid) {
        return [];
    }
    let r = [
    ];
    let cur = parseInt(this.curPage, 10);
    let total = parseInt(this.totalPage, 10);
    // 前半段
    if (cur > SIDE + 3) {
        r.push({page: 1})
        r.push({span: '...'});
        for (let i = cur - SIDE; i <= cur; i++) {
            r.push({page: i});
        }
    } else {
        for (let i = 1; i <= cur; i++) {
            r.push({page: i});
        }
    }
    // 后半段
    if (cur < total - SIDE - 2) {
        for (let i = cur + 1; i < cur + SIDE + 1; i++) {
            r.push({page: i})
        }
        r.push({span: '...'});
        r.push({page: total});
    } else {
        for (let i = cur + 1; i <= total; i++) {
            r.push({page: i})
        }
    }
    return r;
};
let watch = {};
const created = function () {};
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {};
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: ['curPage', 'totalPage'],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
.pagination {
    margin-bottom: 0;
}
</style>
