<template>
<table class="table table-bordered station-table">
    <thead>
        <tr>
            <th>LAC</th>
            <th>CELL</th>
            <th>基站名称</th>
			<!--
            <th>经度</th>
            <th>纬度</th>
            -->
            <th class="col-op">操作</th>
        </tr>
    </thead>
    <tbody v-if="!empty">
        <tr v-for="station in list">
            
            <td v-text="station.lacId"></td>
            <td v-text="station.cellId"></td>
            <td v-text="station.cellName"></td>
            <!-- 
            <td v-text="station.clogiitud"></td>
            <td v-text="station.clatitude"></td>
            -->
            <td class="col-op">
                <a class="modify-btn" href="javascript:;" @click="beginEditStation(station)">修改</a>
            </td>
        </tr>
    </tbody>
    <tbody v-if="emptyVisible">
        <tr>
            <td :colspan="maxCol">该景区没有基站</td>
        </tr>
    </tbody>
    <tbody v-show="loading">
    	<tr >
    	    <td :colspan="maxCol" class="tac">
    	    	<img :src="vImgPath + '/loading.gif'" alt="">
    	    </td>
    	</tr>
    </tbody>

    <tfoot v-show="totalPage > 1">
    	<tr>
    		<td :colspan="maxCol">
    			<pagination class="table-paging" :cur-page="curPage" :total-page="totalPage" @click="changePage" />
    		</td>
    	</tr>
    </tfoot>
</table>
</template>

<script>
import arcgisUtil from 'util/manage_arcgis.js';
const NUM_PER_PAGE = 10;
var methods = {};
// 翻页
methods.changePage = function (v) {
    if (v === this.curPage) {
        return;
    }
    this.curPage = v;
};
// 编辑基站
methods.beginEditStation = function (station) {
	var attraction = this.attraction || {};
    this.layer = arcgisUtil.openIframe({
        name: attraction.sceneryName,
        type: 'edit',
        sceneryId: attraction.sceneryId
    }, {
        title: '修改景区',
        onClose: () => {
        	this.$emit('edit-station-close');
        }
    });
};
var computed = {};
computed.empty = function () {
	return this.list.length === 0;
};
computed.emptyVisible = function () {
	if (this.loading) {
		return false;
	}
	return this.empty;
};
computed.olength = function () {
	if (!this.stations) {
		return 0;
	}
	return this.stations.length || 0;
};
computed.list = function () {
	if (!this.olength) {
		return [];
	}
	let start = (this.curPage - 1) * NUM_PER_PAGE;
	let end = start + NUM_PER_PAGE;
	return this.stations.slice(start, end);
};
computed.totalPage = function () {
    if (!this.olength) {
    	return 1;
    }
    return Math.floor((this.olength - 1) / NUM_PER_PAGE) + 1;
};
computed.maxCol = function () {
	return 4;
};
var mounted = function () {};
let destroyed = function () {};
let dataFunc = function () {
	var o = {
		curPage: 1
	};
	return o;
};
export default {
	data: dataFunc,
	methods,
	computed,
	props: ['stations', 'attraction', 'loading'],
	mounted,
	destroyed,
	components: {
		'pagination': require('./pagination.vue'),
	}
};
</script>

<style scoped lang="less">
.station-table {
	border: none;
	margin-bottom: 0;
	td:nth-of-type(1),
	th:nth-of-type(1) {
		border-left: none;
	}
	th:nth-last-of-type(1),
	td:nth-last-of-type(1) {
		border-right: none;
	}
	tr:nth-last-of-type(1) {
		td {
			border-bottom: none;
		}
	}
	& > thead > tr {
		background-color: #e4f1f9;
	}
	& > tbody > tr,
	& > tfoot > tr > td {
		background-color: #F8F8F8;
	}
	& > tbody > tr:nth-of-type(odd) {
		background-color: #EEE;
	}
	& > thead > tr > th {
		background-color: inherit;
		
	}
	& > tbody > tr > td {
		background-color: inherit;
	}
}
.table-paging {
	margin-top: 0;
	margin-bottom: 0;
}
</style>