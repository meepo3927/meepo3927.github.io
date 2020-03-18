<template>
<select class="m-chosen" data-placeholder="请选择..">
	<slot></slot>
	<option v-for="v in o" v-text="v.text" 
		:disabled="v.disabled"
		:value="v.value"
		v-bind="v.data"></option>
</select>
</template>

<script>
require('lib/chosen.jquery.js');
let uuid = 1;
var methods = {};
methods.getOptions = function () {
	return $(this.$el).find('option:selected');
};
methods.getOption = function () {
	return this.$el.children[this.$el.selectedIndex];
};
methods.getCurrentValue = function () {
	return $(this.$el).val();
};
methods.selectValue = function () {
	let $el = $(this.$el);
	if (this.value !== undefined) {
		$el.val(this.value);
	}
	return $el;
};
methods.update = function () {
	let $el = this.selectValue();
	$el.trigger('chosen:updated');
	this.$emit('input', this.getCurrentValue());
};
methods.log = function (str) {
	LOG(str + `[${this.uuid}]`);
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
	// options变化
	this.$nextTick(this.update);
};
watch.value = function (val) {
	// 设置select值并更新chosen
	$(this.$el).val(val).trigger('chosen:updated');
};
const mounted = function () {
	$(this.$el).chosen().change((e, data) => {
		let $el = $(this.$el);
		let val = $el.val();
		var elem = e.currentTarget;
		var option = elem.children[elem.selectedIndex];
		this.$emit('input', val);
		this.$emit('change', val, e, option);
	});
	this.update();
};
const beforeDestroy = function () {
	$(this.$el).chosen("destroy");
};
const dataFunc = function () {
	var o = {
		uuid: (uuid++)
	};
	return o;
};
module.exports = {
	data: dataFunc,
	methods,
	computed,
	watch,
	props: ['options', 'value'],
	mounted,
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
.m-chosen {
	min-width: 120px;
}
</style>