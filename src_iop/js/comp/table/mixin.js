let methods = {};
methods.delayRefresh = function (s = 300) {
    setTimeout(() => {
        this.$emit('refresh');
    }, s);
};
let computed = {};
computed.mylist = function () {
	return this.list || [];
};
computed.listEmpty = function () {
	return this.mylist.length === 0;
};
let components = {
	'table-empty': require('comp/table/empty.vue'),
	'table-loading': require('comp/table/loading.vue')
};
export {
    methods,
	computed,
	components
};