<template>
<ul class="core-target">
	<li>
		<a href="javascript:;">
			<div class="x-icon">
				<i class="fa fa-file-text-o"></i>
			</div>
			<h5>当前执行活动数</h5>
			<div class="x-num">
				112 <small>个</small>
			</div>
		</a>
	</li>
	<li>
		<a href="javascript:;">
			<div class="x-icon">
				<i class="fa fa-file-text-o"></i>
			</div>
			<h5>营销用户数</h5>
			<div class="x-num">
				129.4 <small>万</small>
			</div>
		</a>
	</li>
	<li>
		<a href="javascript:;">
			<div class="x-icon">
				<i class="fa fa-file-text-o"></i>
			</div>
			<h5>响应用户数</h5>
			<div class="x-num">
				58.2 <small>万</small>
			</div>
		</a>
	</li>
	<li>
		<a href="javascript:;">
			<div class="x-icon">
				<i class="fa fa-file-text-o"></i>
			</div>
			<h5>目标达成率</h5>
			<div class="x-num">
				87.4%
			</div>
		</a>
	</li>
	<li>
		<a href="javascript:;">
			<div class="x-icon">
				<i class="fa fa-file-text-o"></i>
			</div>
			<h5>活动渗透率</h5>
			<div class="x-num">
				23.7%
			</div>
		</a>
	</li>
</ul>
</template>

<script>
var methods = {};
var computed = {};
var mounted = function () {};
export default {
	data: function () {
		return {};
	},
	methods,
	computed,
	props: [],
	mounted
};
</script>

<style scoped lang="less">
.core-target {
	font-size: 0;
	background-color: #fff;
} // core-target-ul

.core-target > li {
	display: inline-block;
	width: 20%;
	padding: 20px 0;
	&:nth-last-child(1) > a {
		border-right: none;
	}
	a {
		display: block;
		border-left: 1px solid transparent;
		border-right: 1px solid #eee;
		text-align: center;
		padding: 0 30px;
	}
	.x-icon {
		width: 100px;
		height: 100px;
		margin-left: auto;
		margin-right: auto;
		border-radius: 50%;
		background-color: #EEEEEE;
		text-align: center;
		i {
			color: #5FAEE3;
			font-size: 56px;
			margin-top: 20px;
		}
	}
	h5 {
		margin-top: 16px;
		font-size: 18px;
		color: #333;
	}
	.x-num {
		color: #333;
		font-size: 18px;
	}
}
</style>