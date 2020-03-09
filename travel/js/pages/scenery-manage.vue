<template>
<div class="v-main p10">
	<!--  新增景区 -->
	<div class="add-form">
		<button class="btn btn-primary" @click="showAdd" >新增景区</button>
	</div>

	<!-- 搜索 -->
	<div class="table-search-box mt20">
		<search-form @search="search" />
	</div>

	<!-- 表格 -->
	<table is="attraction-table" class="table-2"
		:attractions="attractions" 
		:view="view" 
		:keyword="keyword"
		@edit-station-close="editStationClose"
		@remove="removeAttraction"></table>

	<!-- 新增景区 layer -->
	<add-layer v-if="view.addFormVisible" @close="closeAdd" />
</div>
</template>

<script>
import {config, mlayer, request} from 'root';
var methods = {};
methods.showAdd = function () {
	location.href = this.getStaticUrl('/modify_scenery');
	// this.view.addFormVisible = true;
};
methods.closeAdd = function () {
	this.view.addFormVisible = false;
};
methods.fetchRender = function () {
	this.view.loadingVisible = true;
	this.attractionlist = null;
	request.getSceneryInfo({cityId: config.user.cityId}).then((r) => {
		this.view.loadingVisible = false;
		r.forEach((item) => {
			item.childrenVisible = false;
			item.modeEdit = false;
			item.nameForEdit = item.sceneryName;
			item.loading = false;
			item.children = item.children || [];
		});

		this.attractionlist = r;
	}).catch(() => {
		this.view.loadingVisible = false;
	});
};
methods.search = function (word) {
	this.keyword = word;
};
methods.editStationClose = function () {
	this.fetchRender();
};
methods.removeAttraction = function (item) {
    var index = this.attractionlist.indexOf(item);
    this.attractionlist.splice(index, 1);
};
var computed = {};
computed.attractions = function () {
    var word = this.keyword ? this.keyword.trim() : '';
    if (!word) {
        return this.attractionlist;
    }
    if (!this.attractionlist || !this.attractionlist.length) {
        return [];
    }
    var list = [];
    this.attractionlist.forEach(function (a) {
        if (a.sceneryName.indexOf(word) >= 0) {
            list.push(a);
            return;
        }
        var find = false;
        a.children && a.children.forEach(function (station) {
            if (find) {
                return;
            }
            if (station.cellName.indexOf(word) >= 0) {
                list.push(a);
                find = true;
                return;
            }
        });
    });

    return list;
};
var watch = {};
const created = function () {
	window.VM = this;
};
var mounted = function () {
	this.fetchRender();
};
let destroyed = function () {};
let dataFunc = function () {
	var o = {
		attractionlist: null,
		view: {
			addFormVisible: false,
			loadingVisible: false
		},
		keyword: ''
	};
	return o;
};
export default {
	data: dataFunc,
	watch,
	mixins: [

	],
	created,
	methods,
	computed,
	props: [],
	mounted,
	destroyed,
	components: {
		'search-form': require('comp/common/table-search-form.vue'),
		'attraction-table': require('comp/manage/attraction_table.vue')
	}
};
</script>

<style scoped lang="less">
.v-main {
	
}

</style>