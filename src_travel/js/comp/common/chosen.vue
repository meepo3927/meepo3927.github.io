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
import 'lib/chosen.jquery.js';
let uuid = 1;
var methods = {};
methods.getCurrent = function () {
	let option = this.$el.children[this.$el.selectedIndex];
	return {
		option,
		value: $(this.$el).val()
	};
};
methods.selectByDefault = function () {
	let $el = $(this.$el);
	if (this.defaultValue !== undefined) {
		$el.val(this.defaultValue);
		let v = $el.val();
		if (Array.isArray(v)) {
			let allEqual = true;
			for (let i = 0; i < v.length; i++) {
				if (v[i] !== this.defaultValue[i]) {
					allEqual = false;
				}
			}
			if (allEqual) {
				return $el;
			}
		} else if (v === this.defaultValue) {
			return $el;
		}
	}
	if (this.defaultIndex !== undefined) {
		this.$el.selectedIndex = this.defaultIndex;
	}
	return $el;
};
methods.update = function () {
	let $el = this.selectByDefault();
	$el.trigger('chosen:updated');
	let {value, option} = this.getCurrent();
	if (option) {
		this.$emit('update', value, option);
		if (value !== this.value) {
			this.$emit('input', value);
		}
	}
};
methods.log = function (str) {
	LOG(str + `[${this.uuid}]`);
};

var computed = {};
computed.o = function () {
	var arr = [];
	this.options && this.options.forEach((v) => {
		var item = {};
		if (typeof v === 'object') {
			item = v;
		} else {
			item.text = item.value = ('' + v);
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
	this.$nextTick(this.update);
};
watch.value = function (val) {
	$(this.$el).val(val).trigger('chosen:updated');
};
const mounted = function () {
	$(this.$el).chosen().change((e, data) => {
		let $el = $(this.$el);
		// var selected = data.selected;
		var elem = e.currentTarget;
		var option = elem.children[elem.selectedIndex];
		let val = $el.val();
		this.$emit('change', val, e, option);
		this.$emit('input', val);
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
export default {
	data: dataFunc,
	methods,
	computed,
	watch,
	props: ['options', 'value', 'defaultIndex', 'defaultValue'],
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