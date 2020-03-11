<template>
<div class="page-add-hotarea m-container">
    <h3>增加热门区域</h3>
    <div class="m-row-mid-auto mt20 ">
        <div class="lb">区域名称：</div>
        <div class="col-2">
            <input type="text" class="form-control" 
                v-model="areaName" />
        </div>
        <div class="pl10">
            提示：热门区域保存成功后，可于第二日在“策略库-知识图谱-分场景行为分析”页面中查看该热门区域用户流量语音和APP使用行为分布。
        </div>
    </div>
    <div class="m-row mt15">
        <div class="lb lb-1">选择范围：</div>
        <div class="pl10">
            <iframe :src="gisUrl" frameborder="0" scrolling="no"
                class="gis-iframe"></iframe>
        </div>
    </div>

    <div class="btn-box">
        <button class="btn btn-info" @click="save">提交热门区域</button>
        <span class="ml20 lac-tip" v-show="lacTip" v-text="lacTip"></span>
        <button class="btn btn-danger ml20" @click="clean"
            v-show="list.length > 0">清空基站</button>
        
    </div>
</div>
</template>

<script>
const URL = require('util/url.js');
const iframeUtil = require('iframeUtil');
const GIS_URL = 'http://10.220.19.27:8080/iopgis/pages/regionbs.jsp';
const filterDup = (arr) => {
    var map = {};
    var result = [];
    arr.forEach((v) => {
        if (map[v]) {
            return;
        }
        map[v] = 1;
        result.push(v);
    });
    return result;
};
const transformPosition = (list) => {
    return list.map((str) => {
        let str1 = str.substr(0, 4);
        let str2 = str.substr(4);

        let n1 = parseInt(str1, 16);
        let n2 = parseInt(str2, 16);
        return n1 + '-' + n2;
    });
};
let methods = {};
methods.check = function () {
    if (!this.areaName.trim()) {
        return mlayer.msg('请填写区域名称');
    }
    if (!this.list.length) {
        return mlayer.msg('请绘制区域并保存数据');
    }
    return true;
};
methods.onSelectBS = function (data) {
    if (data.bsList) {
        this.list = filterDup(data.bsList);
    }
};
methods.save = function () {
    if (this.check() !== true) {
        return;
    }
    let ld = mlayer.loading();
    let url = '/iop/heatArea/save.action';
    let param = {
        name: this.areaName,
        cells: transformPosition(this.list).join(',')
    };
    this.vRequest.post(url, param).then((data) => {
        mlayer.msg('提交成功！');
        this.cleanAll();
        ld.close();
        setTimeout(this.closeWindow, 1800);
    }).catch((e) => {
        ld.close();
        let msg = e && e.msg;
        mlayer.msg(msg || '提交失败');
    })
};
methods.closeWindow = function () {
    var win = window.open("", "_top", "", "true");
    win.opener = true;
    win.close();
};
methods.cleanAll = function () {
    this.areaName = '';
    this.list = [];
};
methods.clean = function () {
    if (confirm('确定清空已圈选的基站吗？')) {
        this.list = [];
    }
};
methods.onBeforeUnload = function () {
    if (this.list.length) {
        return '您圈选了基站但是没有提交，确定离开吗？'
    }
};
let computed = {};
computed.lacTip = function () {
    if (!this.list.length) {
        return '';
    }
    return '您圈选了' + this.list.length + '个基站';
};
let watch = {};
const created = function () {};
const mounted = function () {
    window.VM = this;
    window.onbeforeunload = this.onBeforeUnload;
    this.vRequest.fetch2('/common/gisToken').then((data) => {
        this.gisUrl = URL.addParam(GIS_URL, data);
    }).catch(() => {
        this.gisUrl = GIS_URL;
    });

    iframeUtil.on('selectBS', this.onSelectBS);
};
const beforeDestroy = function () {
    iframeUtil.off('selectBS', this.onSelectBS);
    window.onbeforeunload = null;
};
const dataFunc = function () {
    let o = {
        gisUrl: 'about:blank',
        list: [],
        areaName: ''
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: [],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
@lb-width:  80px;
h3 {
    margin-top: 1px;
}
.page-add-hotarea {
    background-color: #fff;
}
.lb {
    width: @lb-width;
}
.lb-1 {
    padding-top: 8px;
}
.col-2 {
    padding-left: 17px;
}
iframe.gis-iframe {
    height: 560px;
}
.btn-box {
    padding-left: @lb-width + 17px;
}
</style>
