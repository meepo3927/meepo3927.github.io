<template>
<div class="vue-comp" :class="{'v-mid': !listVisible}">
	<ul class="recommend-list" v-if="listVisible">
		<li v-for="(item, index) in list" :key="item">
			<span class="item-name" v-text="item.productName"></span>
			<span class="input-span">
				<input type="text" class="form-control input-size-default" 
					:name="'recommendItem-' + index"
					v-model="item.intro" 
					v-placeholder  placeholder="产品介绍"
					:data-vali="item.checked ? 'required' : ''"
					errmsg="请输入产品介绍" />
			</span>
			
			<label class="checkbox-inline">
				<input type="checkbox" v-model="item.checked" 
					:disabled="item.dataplusAvailable === false"
					@change="limitRecommend(item)" />推送
			</label>
			
			<span class="errmsg ml15" 
				v-if="item.checked" 
				:error-for="'recommendItem-' + index"></span>
			<span class="errmsg ml15" v-if="item.dataplusAvailable === false"
				v-text="notAvailableTip">
			</span>
		</li>
	</ul>
	<!--
	<p class="text-muted" v-if="listVisible"
		v-text="limitTip"></p> -->
	
	<span v-show="!listVisible">无</span>
</div>
</template>

<script>
import {request} from 'common';
const MAX_RECOMMEND = 3;

let methods = {};
methods.limitRecommend = function (item) {
	if (this.checkedRecommendCount <= MAX_RECOMMEND) {
		return;
	}
	item.checked = false;
	mlayer.msg(this.limitTip);
};
methods.fetch = function () {
	if (!this.mpId) {
		return false;
	}
	let p = {
		activityID: this.mpId
	};
	let checkedCount = 0;
	let isDataPlus = (this.vendorType === 32);
	request.products(p).then((result) => {
		this.list = result.map((v, i) => {
			if (isDataPlus) { // 流量加，不限制订购
				v.dataplusAvailable = true;
			}
			if (checkedCount < MAX_RECOMMEND) {
				if (v.dataplusAvailable === false) {
					v.checked = false;
				} else {
					checkedCount++;
					v.checked = true;
				}
			} else {
				v.checked = false;
			}

			v.intro = '';
			return v;
		});
		this.restore();
	}).catch(() => {
		this.list = [];
	});
};
methods.restore = function () {
	if (!this.data) {
		return;
	}
	let p = this.data;
	for (let i = 0; i < this.list.length; i++) {
		let item = this.list[i];
		for (let j = 1; j < 30; j++) {
			let intro = p[`svcRecommendProd${j}Intro`];
			let productID = p[`svcRecommendProd${j}Code`];
			if (!productID) {
				continue;
			}

			if (productID === item.productID) {
				item.checked = true;
				item.intro = intro;
			}
		}
	}
};
let computed = {};
computed.limitTip = function () {
	return `最多只能推送${MAX_RECOMMEND}个产品`;
};
computed.listVisible = function () {
	return (this.list && this.list.length);
};
computed.checkedRecommends = function () {
	let list = [];
	this.list.forEach((item) => {
		item.checked && list.push(item);
	});
	return list;
};
computed.checkedRecommendCount = function () {
	return this.checkedRecommends.length;
};
computed.notAvailableTip = function () {
	let name = this.vConfig.vendorNameMap[this.vendorType] || '此';
	return '此产品在' + name + '平台不支持订购';
};
let watch = {};
watch.checkedRecommends = function (val) {
	this.$emit('input', val);
};
watch.mpId = function (val) {
	this.fetch();
};
watch.data = function (val) {
	this.restore();
};
const created = function () {};
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
	let o = {
		list: []
	};
	return o;
};
export default {
	data: dataFunc,
	created,
	methods,
	computed,
	watch,
	props: ['mpId', 'data', 'vendorType'],
	mounted,
	mixins: [],
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
.vue-comp {
	
}
.errmsg {
	color: red !important;
	white-space: nowrap;
}
</style>
