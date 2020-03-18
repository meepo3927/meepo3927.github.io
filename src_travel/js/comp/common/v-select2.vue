<template>
<select class="m-select2" >
	<slot></slot>
	<option v-for="v in o" v-text="v.text" 
		:disabled="v.disabled"
		:value="v.value"
		v-bind="v.data"></option>
</select>
</template>

<script>
import 'select2';
let uuid = 1;
var methods = {};
methods.init = function () {
	let $el = $(this.$el);
	$el.select2({
		placeholder: '请选择景区'
	});
	let $container = $el.next('.select2-container');
	$container.delegate('input[type=search]', 'input', (e) => {
		this.$emit('search-input', e.target.value, e.target, e);
	});
	$container.delegate('input[type=search]', 'blur', (e) => {
		this.$emit('search-input', '', e.target, e);
	});
	return $el;
};

methods.syncInput = function () {
	let $el = $(this.$el);
	this.$emit('input', $el.val());
};
var computed = {};
computed.o = function () {
	var arr = [];
	this.options && this.options.forEach((v) => {
		var item = {};
		if (typeof v !== 'object') {
			item.text = v;
		} else {
			for (let p in v) {
				item[p] = v[p];
			}
		}

		// text, value
		if (item.text && item.value === undefined) {
			item.value = item.text;
		}
		arr.push(item);
	});
	return arr;
};
computed.length = function () {
	return this.o.length;
};
let watch = {};
watch.o = function () {
	let $el = $(this.$el);
	// $el.trigger('change.select2');
	// $el.select2("destroy");
	this.$nextTick(() => {
		this.init();
		this.syncInput();
	});
};
watch.value = function (val) {
	// 设置select值并更新
	$(this.$el).val(val).trigger('change.select2');
};
const mounted = function () {
	let $el = this.init();
	$el.on('change', (e) => {
		this.syncInput();
		var elem = e.currentTarget;
		var option = elem.children[elem.selectedIndex];
		this.$emit('change', e, option, $el.val(), $el);
	});
	// 初始化后，同步值
	this.syncInput();
	this.$select = $el;
};
const beforeDestroy = function () {
	this.$select.select2('destroy');
};
const dataFunc = function () {
	var o = {

	};
	return o;
};
export default {
	data: dataFunc,
	methods,
	computed,
	watch,
	props: [
		'options', 'value'
	],
	mounted,
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
.m-select2 {
	min-width: 120px;
}
</style>