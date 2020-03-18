<template>
<div class="help-main">
	<div class="step-1 x-step">
		<h4>1. 进入<a :href="entryUrl" target="_blank">旅游大数据平台</a>，并登录：</h4>
		<img :src="vImgPath + '/help/step_1.png'" class="x-img" >
	</div>

	<div class="step-2 x-step">
		<h4>2. 登录完成，进入旅游大数据平台首页：</h4>
		<img :src="vImgPath + '/help/step_2.png'" class="x-img" >
	</div>

	<div class="step-3 x-step">
		<h4>3. 点击页面下方[景区管理]进入管理界面：</h4>
		<img :src="vImgPath + '/help/step_3.png'" class="x-img" >
	</div>

	<div class="step-4 x-step">
		<h4>4. 点击[新增景区]：</h4>
		<img :src="vImgPath + '/help/step_4.png'" class="x-img" >
	</div>

	<div class="step-5 x-step">
		<h4>5. 选择地市，并输入景区名称，点击[确定]：</h4>
		<img :src="vImgPath + '/help/step_5.png'" class="x-img" >
	</div>

	<div class="step-6 x-step">
		<h4>6. 在窗口内点击[绘制景区]：</h4>
		<img :src="vImgPath + '/help/step_6.png'" class="x-img" >
	</div>

	<div class="step-7 x-step">
		<h4>7. 在地图上，点击鼠标左键选择顶点，圈定区域：</h4>
		<img :src="vImgPath + '/help/step_7.png'" class="x-img" >
	</div>

	<div class="step-8 x-step">
		<h4>8. 选择顶点完成后，双击鼠标左键，区域会自动闭合：</h4>
		<img :src="vImgPath + '/help/step_8.png'" class="x-img" >
	</div>

	<div class="step-9 x-step">
		<h4>9. 右下方会呈现圈定区域内所有基站信息：</h4>
		<img :src="vImgPath + '/help/step_9.png'" class="x-img" >
	</div>

	<div class="step-10 x-step">
		<h4>10. 如果圈定完成，点击[保存]；如果需要重新圈定，点击[取消]，重新绘制：</h4>
		<img :src="vImgPath + '/help/step_10.png'" class="x-img" >
	</div>

	<div class="step-11 x-step">
		<h4>11. 点击保存后，右下方提示完成：</h4>
		<img :src="vImgPath + '/help/step_11.png'" class="x-img" >
	</div>

	<div class="step-12 x-step">
		<h4>12. 点击圆X按钮，关闭窗口：</h4>
		<img :src="vImgPath + '/help/step_12.png'" class="x-img" >
	</div>

	<div class="step-13 x-step">
		<h4>13. 完成后，即可在列表中查看到新增的景区：</h4>
		<img :src="vImgPath + '/help/step_13.png'" class="x-img" >
	</div>
</div>
</template>

<script>
import {config, mlayer} from 'root';
var methods = {};
var computed = {};
var watch = {};
var mounted = function () {
};
const beforeDestroy = function () {};
let dataFunc = function () {
	let global = window.global || {};
	var o = {
		entryUrl: global.basePath || '/'
	};
	return o;
};
export default {
	data: dataFunc,
	watch,
	mixins: [],
	methods,
	computed,
	props: [],
	mounted,
	beforeDestroy,
	components: {}
};
</script>

<style scoped lang="less">
.help-main {
	
}
.x-step {
	padding: 20px 16px;
	margin: 20px;
	border: 1px solid #ccc;
	background-color: #f9f9f9;
	border-radius: 8px;
}
.x-step > h4 {
	font-weight: normal;
	font-size: 24px;
	& > a {
		color: #000eee;
	}
}
.x-step > .x-img {
	margin-top: 15px;
	width: 1000px;
	max-width: 100%;
	box-shadow: 0 2px 4px #999;
}
</style>