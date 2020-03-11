<template>
<ul class="core-list">
	<li class="x-1">
		<a href="javascript:;">
			<i class="fa fa-file-text-o"></i>
			<p>用户研究中心</p>
			<div class="sub-text">
				市场分析、目标客户群获取
			</div>
		</a>
	</li>
	<li class="x-2">
		<a href="javascript:;">
			<i class="fa fa-user"></i>
			<p>事件中心</p>
			<div class="sub-text">
				事件的策划、管理、捕捉
			</div>
		</a>
	</li>
	<li class="x-3">
		<a href="javascript:;">
			<i class="fa fa-user"></i>
			<p>营销资源中心</p>
			<div class="sub-text">
				营销资源的申请、管理
			</div>
		</a>
	</li>
	<li class="x-4">
		<a href="javascript:;">
			<i class="fa fa-user"></i>
			<p>触点中心</p>
			<div class="sub-text">
				触点渠道配置、排期
			</div>
		</a>
	</li>
	<li class="x-5">
		<a href="javascript:;">
			<i class="fa fa-user"></i>
			<p>营销管理中心</p>
			<div class="sub-text">
				 营销活动策划、执行
			</div>
		</a>
	</li>
	<li class="x-6">
		<a href="javascript:;">
			<i class="fa fa-user"></i>
			<p>评价中心</p>
			<div class="sub-text">
				 活动的评估分析
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
.core-list {
	font-size: 0;
}
.core-list > li {
	width: (100% / 6);
	display: inline-block;
	
	&.x-1 {
		background-color: #5FAEE3;
		.sub-text {
			color: #eee;
		}
	}
	&.x-2 {
		background-color: #6EB5E5;
		.sub-text {
			color: #efefef;
		}
	}
	&.x-3 {
		background-color: #7CBDE8;
		.sub-text {
			color: #f3f3f3;
		}
	}
	&.x-4 {
		background-color: #8BC4EA;
		.sub-text {
			color: #f6f6f6;
		}
	}
	&.x-5 {
		background-color: #99CBED;
		.sub-text {
			color: #f9f9f9;
		}
	}
	&.x-6 {
		background-color: #AED3EC;
		.sub-text {
			color: #fefefe;
		}
	}
	a {
		color: #fff;
		display: block;
		text-align: center;
		padding-top: 30px;
		padding-bottom: 48px;
	}
	i {
		font-size: 48px;
	}
	p {
		margin-top: 18px;
		font-size: 18px;
	}
	.sub-text {
		font-size: 14px;
	}
}
</style>