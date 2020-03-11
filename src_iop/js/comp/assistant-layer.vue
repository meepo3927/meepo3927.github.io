<template>
<div class="assistant-layer" :style="style" :class="rootClass">
	<div class="inner-wrapper">
		<img :src="handUrl" class="v-hand" />
		<img :src="getImageUrl('/assistant/head.png')" class="v-head" />
		<div class="v-content">
			<h5 v-html="o.text"></h5>
			<div class="btn-box">
				<button type="button" @click="$emit('backmenu')"
					v-if="hasBackMenu">返回主界面</button>
				<button type="button" @click="$emit('exit')"
					v-else>退出引导</button>
				<button type="button" @click="$emit('prev')" class="ml20"
					title="按键盘←键也可以上一步"
					v-show="o.hasPrev">上一步</button>
				<button type="button" @click="$emit('next')" 
					class="ml20 assistant-next-step-btn"
					title="按键盘→键也可以下一步"
					v-show="o.hasNext">下一步</button>
				<button type="button" @click="$emit('restart')" class="ml20"
					v-show="o.hasRestart">重新观看</button>
			</div>
			<img :src="triUrl" class="v-tri" />
		</div>
	</div>
</div>
</template>

<script>
let methods = {};
let computed = {};
computed.rootClass = function () {
	let arr = [];
	if (this.layout) {
		arr.push('layout-' + this.layout);
	}
	
	return arr;
};
computed.handUrl = function () {
	if (this.layout === '2') {
		return this.getImageUrl('/assistant/hand_right.png');
	} else if (this.layout === '3') {
		return this.getImageUrl('/assistant/hand_up_l.png');
	} else if (this.layout === '4') {
		return this.getImageUrl('/assistant/hand_down_1.png');
	}
	return this.getImageUrl('/assistant/hand.png');
};
computed.triUrl = function () {
	let l = this.layout;
	if (l === '2' || l === '4') {
		return this.getImageUrl('/assistant/tri2.png');
	}
	return this.getImageUrl('/assistant/tri.png');
};
computed.o = function () {
	return this.options || {};
};
computed.style = function () {
	let style = {};
	let top = this.o.top;
	let left = this.o.left;
	if (!top && !left && this.o.position) {
		top = this.o.position.top;
		left = this.o.position.left;
	}
	if (top !== undefined) {
		if (typeof top === 'number') {
			style.top = top + 'px';
		} else {
			style.top = top;
		}
	}
	if (left !== undefined) {
		if (typeof left === 'number') {
			style.left = left + 'px';
		} else {
			style.left = left;
		}
	}
	return style;
};
computed.layout = function () {
	return this.o.layout || '1';
};
computed.hasBackMenu = function () {
	return (this.o.hasRestart === true);
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
	props: {
		options: Object
	},
	mounted,
	mixins: [],
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
@hand-width:   60px;
@hand-height:  43px;
@hand3-width:  53px;
@hand3-height: 52px;
@tri-width:   32px;
@tri-height:  13px;
@hand-down-width:   45px;
@hand-down-height:  62px;
.assistant-layer {
	position: fixed;
	max-width: 460px;
	z-index: 97000;
	.v-hand {
		position: absolute;
		width: @hand-width;
		height: @hand-height;
	}
	.v-head {
		width: 59px;
		height: 68px;
	}
}
.inner-wrapper {}
.v-content {
	position: relative;
	background-color: #F1FAFF;
	border: 1px solid #53B8DE;
	border-radius: 16px;
	padding: 8px 30px;
	margin-top: @tri-height + 5px;
	h5 {
		color: #005E8F;
		font-size: 16px;
		word-wrap: break-word;
		word-break: break-all;
		line-height: 32px;
		margin: 5px 0 8px 0;
		font-weight: bold;
		text-align: left;
	}
	.btn-box {
		text-align: right;
	}
	button {
		border: none;
		border-bottom: 1px solid  #EAC119;
		background-color: transparent;
		color: #EAC119;
		font-size: 14px;
		line-height: 1;
		padding: 0 0 4px 0;
		&:active,
		&:focus {
			outline: none;
		}
	}
	.v-tri {
		width: @tri-width;
		height: @tri-height;
		position: absolute;
		left: 40px;
		top: -@tri-height;
	}
}
// 手指左边
.assistant-layer.layout-1 {
	padding-left: 85px;
	.v-hand {
		left: 10px;
		top: 50%;
		margin-top: -(@hand-height / 2);
	}
}
// 手指右边
.assistant-layer.layout-2 {
	.inner-wrapper {
		text-align: right;
	}
	padding-right: 85px;
	.v-hand {
		right: 10px;
		top: 50%;
		margin-top: -(@hand-height / 2);
	}
	.v-tri {
		left: auto;
		right: 40px;
	}
}
// 手指左上
.assistant-layer.layout-3 {
	.v-hand {
		width: @hand3-width;
		height: @hand3-height;
		top: -5px;
		left: -80px;
	}
}
// 手指下
.assistant-layer.layout-4 {
	.inner-wrapper {
		text-align: right;
	}
	.v-tri {
		left: auto;
		right: 40px;
	}
	.v-hand {
		width: @hand-down-width;
		height: @hand-down-height;
		top: 100px;
		right: -60px;
	}
}
</style>
