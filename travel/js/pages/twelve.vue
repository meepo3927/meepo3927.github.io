<template>
<div class="page-twelve">
    <div class="v-cell" v-for="(v, i) in list" :is="theComp"
        :key="v"
        :data="v"
        :class="getCellClass(i)"></div>
    <!--
    <a href="javascript:;" class="switch-btn" @click="switchComp">
        <i class="fa fa-cube"></i>
    </a>
    -->
    <div class="l-panel">
        <div class="i-wrapper">
            <span>当前已覆盖全区704个景区</span>
        </div>
    </div>
</div>
</template>

<script>
import {mlayer, request, $} from 'root';
let methods = {};
methods.getCellClass = function (i) {
    let j = i + 1;
    return ['cell-' + j];
};
methods.switchComp = function () {
    this.theComp = (this.theComp === 'v-cell') ? 'm-cell' : 'v-cell';
};
let computed = {};
computed.list22 = function () {
    return [
        {
            id: 7768,
            name: '响沙湾景区'
        },
        {
            id: 7720,
            name: '成吉思汗陵旅游区'
        },
        {
            id: 8201,
            zoom: 15,
            name: '阿尔山国家森林公园'
        },
        {
            id: 7038,
            name: '满洲里市中俄边境'
        },
        {
            id: 7122,
            name: '呼和浩特海亮广场'
        },
        {
            id: 7210,
            name: '包头南海湿地'
        },
        {
            id: 7209,
            name: '美岱召旅游区'
        },
        
        {
            id: 7151,
            zoom: 15,
            name: '大召历史文化旅游区'
        },
        
        {
            id: 7406,
            name: '老虎山'
        },
        {
            id: 7706,
            zoom: 15,
            name: '康巴什新区'
        },
        {
            id: 7088,
            name: '呼伦贝尔大草原'
        },
        {
            id: 8365,
            zoom: 14,
            name: '胡杨林旅游区'
        }
    ]
};
let watch = {};
const created = function () {};
const mounted = function () {
    request.getActionJSON('/sceneryShowConfig/getShowConfig').then((data) => {
        this.list = data.map((v) => {
            try {
                if (v.sceneryExtInfo) {
                    let info = JSON.parse(v.sceneryExtInfo);
                    if (info) {
                        v.lng = info.lng;
                        v.lat = info.lat;
                        v.zoom = info.zoom;
                    }
                }
            } catch(e) {}
            return v;
        }).slice(0, 12);
    }).catch(() => {
        mlayer.msg('数据获取失败');
    });
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        list: [],
        theComp: 'm-cell'
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
    components: {
        //'v-cell': require('comp/twelve-cell.vue'),
        'm-cell': require('comp/twelve-cell-3.vue')
    }
};
</script>

<style scoped lang="less">
@hh:  360px;
.page-twelve {
    height: 100vh;
    background-color: #fff;
}
.v-cell {
    position: fixed;
}
.cell-1, .cell-2, .cell-3, .cell-4 {
    top: 0;
}
.cell-5, .cell-6, .cell-7, .cell-8 {
    top: 33.33vh;
}
.cell-9, .cell-10, .cell-11, .cell-12 {
    top: 66.66vh;
}
.cell-1, .cell-5, .cell-9 {
    left: 0;
}
.cell-2, .cell-6, .cell-10 {
    left: 25vw;
}
.cell-3, .cell-7, .cell-11 {
    left: 50vw;
}
.cell-4, .cell-8, .cell-12 {
    left: 75vw;
}
.switch-btn {
    position: absolute;
    z-index: 100;
    right: 5px;
    bottom: 5px;
    line-height: 0;
    i {
        font-size: 18px;
    }
}
.l-panel {
    @my-width:  400px;
    position: fixed;
    top: 0;
    left: 150px;
    width: @my-width;
    //margin-left: -(@my-width / 2);
    transition: transform .5s ease;
    //transform: translateY(-30px);
    padding-bottom: 10px;
    .i-wrapper {
        //background-color: rgba(255, 255, 255, .7);
        background: url("../../images/scenery_in_twelve/top_cc.png") no-repeat center 0;
        padding: 10px 1px 15px 1px;
        color: #fff;
        font-size: 20px;
        text-align: center;
    }
    &:hover {
        //transform: translateY(0px);
    }
}
</style>

<style lang="less">
@line-color: #24F0FB;
.twelve-cell .v-line {
    position: absolute;
    border: 1px solid @line-color;
    height: 1px;
    z-index: 300 - 3;
}
.twelve-cell.cell-1 .v-line,
.twelve-cell.cell-2 .v-line,
.twelve-cell.cell-3 .v-line,
.twelve-cell.cell-4 .v-line,
.twelve-cell.cell-5 .v-line,
.twelve-cell.cell-6 .v-line,
.twelve-cell.cell-7 .v-line,
.twelve-cell.cell-8 .v-line,
.twelve-cell.cell-9 .v-line,
.twelve-cell.cell-10 .v-line,
.twelve-cell.cell-11 .v-line,
.twelve-cell.cell-12 .v-line {
    width: 50px;
    left: 150px;
    top: 203px;
    transform: rotate(50deg);
}
</style>