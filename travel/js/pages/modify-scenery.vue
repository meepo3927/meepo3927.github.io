<template>
<div class="v-main">
    <form action="" class="label-w-7">
        <!-- 归属地市 -->
        <div class="form-item" >
            <label for="">归属地市<em class="i-star">*</em>：</label>
            <div class="x-right pr30">
                <v-chosen :options="citylist" v-model="form.cityID"
                    v-if="isModeCreate"
                    @change="onCityChange" />
                <span v-if="isModeEdit" v-text="cityName"></span>
            </div>

            <label for="" style="width: auto;">区县：</label>
            <v-chosen :options="arealist" v-model="form.areaID"
                class="area-chosen" />
        </div>

        <!-- 名称 -->
        <div class="form-item" >
            <label for="">景区名称<em class="i-star">*</em>：</label>
            <div class="x-right ">
                <input type="text" class="input-text scenery-name-input"
                    placeholder="例如：某公园"
                    v-model="form.sceneryName" />
            </div>
        </div>

        <!-- 简介 -->
        <div class="form-item v-top" >
            <label for="">景区简介：</label>
            <div class="x-right ">
                <textarea class="input-text"
                    v-model="form.sceneryDesc"></textarea>
            </div>
        </div>

        <!-- 星级 -->
        <div class="form-item " >
            <label for="">景区星级：</label>
            <div class="x-right ">
                <v-chosen :options="starOptions" v-model="form.sceneryStar" />
            </div>
        </div>

        <!-- 类型 -->
        <div class="form-item " >
            <label for="">景区类型：</label>
            <div class="x-right ">
                <v-chosen :options="busiTypeOptions" v-model="form.sceneryBusiType">
                </v-chosen>
            </div>
        </div>

        <!-- Form Item -->
        <div class="form-item " >
            <label for="">旺季营业时间：</label>
            <div class="x-right ">
                <je-date class="input-text time-input" placeholder="08:00"
                    v-model="form.busyOpenTimeStart"
                    hh="08"
                    mm="00"
                    format="hh:mm" />
                <span class="input-break-span">到</span>
                <je-date class="input-text time-input" placeholder="18:30"
                    v-model="form.busyOpenTimeOver"
                    hh="18"
                    mm="30"
                    format="hh:mm" />
            </div>
        </div>

        <!-- Form Item -->
        <div class="form-item " >
            <label for="">淡季营业时间：</label>
            <div class="x-right ">
                <je-date class="input-text time-input" placeholder="09:00"
                    v-model="form.slackOpenTimeStart"
                    hh="09"
                    mm="00"
                    format="hh:mm" />
                <span class="input-break-span">到</span>
                <je-date class="input-text time-input" placeholder="17:30"
                    v-model="form.slackOpenTimeOver"
                    hh="17"
                    mm="30"
                    format="hh:mm" />
            </div>
        </div>

        <!-- Form Item -->
        <div class="form-item " >
            <label for="">旺季：</label>
            <div class="x-right ">
                <je-date class="input-text date-input"
                    v-model="form.busyOpenDateStart" />
                <span class="input-break-span">到</span>
                <je-date class="input-text date-input"
                    v-model="form.busyOpenDateOver" />
                <span class="ml20">门票：</span>
                <input-number class="input-text money-input"
                    v-model="form.priceBusy" min="0" />
                <span>元</span>
            </div>
        </div>

        <!-- Form Item -->
        <div class="form-item " >
            <label for="">淡季：</label>
            <div class="x-right ">
                <je-date class="input-text date-input"
                    v-model="form.slackOpenDateStart" />
                <span class="input-break-span">到</span>
                <je-date class="input-text date-input"
                    v-model="form.slackOpenDateOver" />
                <span class="ml20">门票：</span>
                <input-number class="input-text money-input"
                    v-model="form.priceSlack" min="0" />
                
                <span>元</span>
            </div>
        </div>

        <!-- Form Item -->
        <div class="form-item " >
            <label for="">游客容量：</label>
            <div class="x-right pr30">
                <input-number class="input-text capacity-input"
                    v-model="form.capacity" 
                    min="0"
                    num-type="integer" />
                
                <span>人</span>
            </div>
        </div>

        <!-- f -->
        <div class="form-item " >
            <label for="">区域类型：</label>
            <div class="x-right ">
                <v-chosen :options="typeOptions" v-model="form.sceneryType"></v-chosen>
            </div>
        </div>

        <!--
        <div class="form-item">
            <label for="">上传景区头像：</label>
            <div class="x-right">
                <file-upload filetype="image" />
            </div>
        </div>
        -->

        <!-- f -->
        <div class="form-item " v-if="isModeEdit">
            <label for="">基站信息：</label>
            <div class="x-right ">
                <button class="btn" type="button" @click="openlayer">圈选基站</button>
            </div>
        </div>

        <!-- 基站列表 -->
        <div class="table-box" v-if="stationlist">
            <table class="table-2 station-table">
                <thead>
                    <tr>
                        <th>LAC</th>
                        <th>CELL</th>
                        <th>基站名称</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(v, i) in stationlist">
                        <td v-text="v.lacId"></td>
                        <td v-text="v.cellId"></td>
                        <td v-text="v.cellName"></td>
                        <td>
                            <a href="javascript:;" @click="removeStation(i)">删除</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- 按钮 -->
        <div class="form-item ">
            <label for="" >&nbsp;</label>
            <div class="x-right">
                <button class="btn" type="button" @click="submit"
                    v-text="submitButtonText"></button>

                <button class="btn ml15" type="button" 
                    @click="reset">清空</button>

                <span class="inline-loading ml10" v-show="loading"></span>
            </div>
        </div>
    </form>
    <div class="loading-1 fixed" v-show="loadingVisible"></div>
    <center-layer v-if="layerVisible" width="96%" height="94%" anim="true">
        <div class="scenery-gis-layer">
            <close-box @close="closelayer" />
            <iframe :src="gisUrl" frameborder="0" class="size-100p"></iframe>
        </div>
    </center-layer>
</div>
</template>

<script>
import {mlayer, request} from 'root';
import URL from 'util/url.js';
import tool from 'util/tool.js';
import Cover from 'util/cover.js';
import IframeUtil from 'util/iframe.js';

let methods = {};
methods.onCityChange = function () {
    this.updateArealist({autoSelect: true});
};
methods.openlayer = function () {
    if (this.cover) {
        this.cover.show();
    } else {
        this.cover = new Cover();
    }
    this.layerVisible = true;
};
methods.closelayer = function () {
    this.layerVisible = false;
    if (this.cover) {
        this.cover.hide();
    }

    // 如果没圈选基站，提交会报错
    if (this.stationlist) {
        this.realSubmit({auto: true});
    }
};
methods.removeStation = function (i) {
    if (!confirm('确定删除该基站信息吗？')) {
        return;
    }
    this.stationlist.splice(i, 1);
};
methods.reset = function () {
    let formHash = [
        'sceneryName',
        'sceneryDesc',
        'capacity',
        'priceSlack', 'priceBusy',
        'busyOpenTimeStart',
        'busyOpenTimeOver',
        'slackOpenTimeStart',
        'slackOpenTimeOver',

        'busyOpenDateStart',
        'busyOpenDateOver',
        'slackOpenDateStart',
        'slackOpenDateOver'
    ];
    formHash.forEach((v) => {
        this.form[v] = '';
    });
};
methods.handleSuccess = function (data, c) {
    this.saveState();
    let isHandSubmit = !c.auto;
    let isAutoSubmit = !isHandSubmit;
    if (this.isModeEdit) {
        // 编辑模式
        if (isHandSubmit) {
            mlayer.iconMsg('提交成功，即将跳转...');
            setTimeout(this.jumpBack, 2000);
        } else {
            mlayer.iconMsg('保存成功');
        }
    } else if (isHandSubmit) {
        // 下一步，自动打开gis浮层
        this.openlayer();
    } else {
        mlayer.iconMsg('提交成功！');
    }

    if (data && data.sceneryID) {
        this.id = data.sceneryID;
    }
};
methods.jumpBack = function () {
    location.href = this.getStaticUrl('/scenery_manage');
};
const tripDateTime = (str) => {
    return str.replace(/[-:]/g, '');
};
methods.getParam = function () {
    let fm = this.form;
    let formHash = [
        'cityID', 'areaID',
        'sceneryName', 'sceneryDesc',
        'sceneryStar',
        // 景区类型
        'sceneryBusiType',
        // 游客容量
        'capacity',
        // 门票价格
        'priceSlack', 'priceBusy',
        // 区域类型
        'sceneryType'
    ];
    let r = {};
    formHash.forEach((v) => {
        r[v] = fm[v];
    });

    // 旺季营业时间
    r.openhoursBusyTime = tripDateTime(fm.busyOpenTimeStart)
        + '-' + tripDateTime(fm.busyOpenTimeOver);
    // 淡季营业时间
    r.openhoursSlackTime = tripDateTime(fm.slackOpenTimeStart)
        + '-' + tripDateTime(fm.slackOpenTimeOver);
    // 旺季日期
    r.seasonBusyDate = tripDateTime(fm.busyOpenDateStart)
        + '-' + tripDateTime(fm.busyOpenDateOver);
    // 淡季日期
    r.seasonSlackDate = tripDateTime(fm.slackOpenDateStart)
        + '-' + tripDateTime(fm.slackOpenDateOver);
    
    // 操作人ID
    r.operatorCode = this.vConfig.user.code;

    // 基站信息
    if (this.stationlist) {
        r.locations = this.stationlist.map((v) => {
            return v.lacId + '|' + v.cellId;
        }).join(',');
    } else {
        r.locations = '';
    }
    
    return r;
};
methods.checkForm = function () {
    if (!this.form.cityID) {
        mlayer.msg('请选择所属地市');
        return false;
    }
    
    if (!this.form.sceneryName) {
        mlayer.msg('景区名称不能为空');
        return false;
    }

    if (this.isModeEdit && !this.stationlist) {
        mlayer.msg('请圈选基站');
        return false;
    }

    return true;
};
methods.realSubmit = function (c = {}) {
    let loadingKey = c.auto ? 'loadingVisible' : 'loading';
    this[loadingKey] = true;
    let p = this.getParam();
    let pm;
    if (this.isModeCreate) {
        pm = request.insertSceneryInfoExtend(p);
    } else {
        p.sceneryID = this.id;
        pm = request.editSceneryInfoExtend(p);
    }
    pm.then((r) => {
        this[loadingKey] = false;
        if (r.success) {
            this.handleSuccess(r.data, c);
        } else {
            mlayer.msg(r.msg || '提交失败');
        }
    }).catch((e) => {
        this[loadingKey] = false;
        mlayer.msg('提交失败');
        LOG(e);
    });
};
methods.submit = function () {
    if (this.loading) {
        return;
    }
    if (!this.checkForm()) {
        return;
    }
    this.realSubmit();
};
methods.saveState = function () {
    this.saveSnapShot = JSON.stringify(this.getParam());
};
methods.updateArealist = function (o = {}) {
    request.getCountyByCityID(this.form.cityID).then((r) => {
        let options = r.map((v) => {
            return {
                text: v.name,
                value: v.id
            };
        });
        this.arealist = [{text: '请选择', value: ''}].concat(options);
        if (o.autoSelect) {
            this.form.areaID = this.arealist[0].value;
        }
        if (o.save) {
            this.saveState();
        }
    }).catch(() => {
        if (o.save) {
            this.saveState();
        }
    });
};
methods.getSceneryInfoExtend = function () {
    if (!this.getSceneryInfoExtendPromise) {
        this.getSceneryInfoExtendPromise = request.getSceneryInfoExtend(
            this.id
        );
    }
    return this.getSceneryInfoExtendPromise;
};
const recoverDate = (str) => {
    return [
        str.substr(0, 4),
        str.substr(4, 2),
        str.substr(6, 2)
    ].join('-');
};
const recoverTime = (str) => {
    return [
        str.substr(0, 2),
        str.substr(2, 2)
    ].join(':');
};
methods.fill = function (o) {
    LOG('fill:', o);
    tool.eacho(this.form, (v, key) => {
        if (o[key]) {
            this.form[key] = o[key];
        }
    });

    let [busyOpenTimeStart, busyOpenTimeOver] = o.openhoursBusyTime.split('-');
    let [slackOpenTimeStart, slackOpenTimeOver] = o.openhoursSlackTime.split('-');
    let [busyOpenDateStart, busyOpenDateOver] = o.seasonBusyDate.split('-');
    let [slackOpenDateStart, slackOpenDateOver] = o.seasonSlackDate.split('-');

    if (busyOpenTimeStart) {
        this.form.busyOpenTimeStart = recoverTime(busyOpenTimeStart);
    }
    if (busyOpenTimeOver) {
        this.form.busyOpenTimeOver = recoverTime(busyOpenTimeOver);
    }
    if (slackOpenTimeStart) {
        this.form.slackOpenTimeStart = recoverTime(slackOpenTimeStart);
    }
    if (slackOpenTimeOver) {
        this.form.slackOpenTimeOver = recoverTime(slackOpenTimeOver);
    }

    if (busyOpenDateStart) {
        this.form.busyOpenDateStart = recoverDate(busyOpenDateStart);
    }
    if (busyOpenDateOver) {
        this.form.busyOpenDateOver = recoverDate(busyOpenDateOver);
    }
    if (slackOpenDateStart) {
        this.form.slackOpenDateStart = recoverDate(slackOpenDateStart);
    }
    if (slackOpenDateOver) {
        this.form.slackOpenDateOver = recoverDate(slackOpenDateOver);
    }
    if (o.locations && o.locations.length) {
        this.stationlist = o.locations;
    }
    this.updateArealist({save: true});
};
methods.onGisReady = function () {
    this.getSceneryInfoExtend().then((result) => {
        if (result.locations) {
            const data = result.locations.map(v => {
                return {
                    lacId: v.lacId,
                    cellId: v.cellId,
                    cellName: v.cellName,
                    sceneryId: v.sceneryId
                }
            });
            IframeUtil.send('render_lacCellIds', data);
        }
    });
};
const starOptions = ['A', 'AA', 'AAA', 'AAAA', 'AAAAA', '未评级'];
const busiTypeOptions = [
    {text:'自然景观', value: 's01'},
    {text:'人文历史', value: 's02'},
    {text:'公园游乐', value: 's03'},
    {text:'休闲度假', value: 's04'},
    {text:'其他', value: 's05'}
];
const typeOptions = [
    {text: '旅游景区', value: 1},
    {text: '公共场所', value: 2},
    {text: '其他', value: 3}
];
let computed = {};
computed.starOptions = function () {
    return starOptions;
};
computed.busiTypeOptions = function () {
    return busiTypeOptions;
};
computed.typeOptions = function () {
    return typeOptions;
};
computed.mode = function () {
    if (this.id) {
        return 'edit';
    }
    return 'create';
};
computed.isModeCreate = function () {
    return (this.mode === 'create');
};
computed.isModeEdit = function () {
    return (this.mode === 'edit');
};
computed.submitButtonText = function () {
    return this.isModeCreate ? '下一步' : '保存';
};
computed.cityName = function () {
    if (this.form.cityID && this.citylist) {
        for (let i = 0; i < this.citylist.length; i++) {
            if (this.citylist[i].value == this.form.cityID) {
                return this.citylist[i].text;
            }
        }
    }
};
computed.myGisUrl = function () {
    let op = 'add';
    if (URL.query().id) {
        op = 'edit';
    }
    return [
        this.vConfig.gisUrlBase + '/travel/travelOpt.jsp',
        '?opType=' + op,
        '&sceneryName=' + encodeURIComponent(this.form.sceneryName),
        '&cityId=' + (this.form.cityID || ''),
        '&operatorCode=' + (this.vConfig.user.code || ''),
        '&sceneryId=' + (this.id || '')
    ].join('');
};
let watch = {};
watch.layerVisible = function (b) {
    if (b === false) {
        this.gisUrl = 'about:blank';
        return;
    }
    request.fetchGisToken().then((data) => {
        this.gisUrl = this.gisAddToken(this.myGisUrl, data);
    }).catch(() => {
        this.gisUrl = this.myGisUrl;
    });
};
const created = function () {};
const mounted = function () {
    window.VM = this;
    IframeUtil.on('gis_ready', this.onGisReady);
    IframeUtil.on('transfer_station_info', (data) => {
        LOG('transfer:', data);
        this.stationlist = data.map((v) => {
            let [lacId, cellId, cellName] = v.split('|');
            return {
                lacId, cellId, cellName
            };
        });
    });
    this.updateArealist();
    // 编辑
    if (this.id) {
        let cover = new Cover({
            opacity: 0.2
        });
        this.loadingVisible = true;
        this.getSceneryInfoExtend().then((r) => {
            this.loadingVisible = false;
            cover.remove();
            this.fill(r);
        }).catch((e) => {
            this.loadingVisible = false;
            cover.remove();
        });
        window.onbeforeunload = () => {
            let json = JSON.stringify(this.getParam());
            if (this.saveSnapShot && this.saveSnapShot !== json) {
                return '景区内容尚未保存，是否离开？';
            }
        };
    }
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let citylist = request.getStaticCityOptions();
    citylist.unshift({text: '请选择', value: ''});
    let o = {
        // URL携带，或者保存之后生成
        id: URL.query().id,
        gisUrl: 'about:blank',
        loading: false,
        citylist,
        arealist: null,
        stationlist: null,
        layerVisible: false,
        loadingVisible: false,
        form: {
            cityID: '',
            areaID: '',
            sceneryName: '',
            sceneryDesc: '',
            sceneryStar: starOptions[2],
            sceneryBusiType: busiTypeOptions[0].value,
            sceneryType: typeOptions[0].value,
            busyOpenTimeStart: '',
            busyOpenTimeOver: '',
            slackOpenTimeStart: '',
            slackOpenTimeOver: '',

            busyOpenDateStart: '',
            busyOpenDateOver: '',
            slackOpenDateStart: '',
            slackOpenDateOver: '',

            capacity: '',
            priceBusy: '',
            priceSlack: ''
        }
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
    mixins: [
        require('mixins/gis_iframe.js')
    ],
    beforeDestroy,
    components: {
        'file-upload': require('comp/common/file-upload.vue'),
        'je-date': require('comp/common/je-date.vue'),
        'v-chosen': require('comp/common/v-chosen.vue'),
        'input-number': require('comp/common/input-number.vue'),
        'close-box': require('comp/chart_layer/close-box.vue')
    }
};
</script>

<style scoped lang="less">
.v-main {
    padding-left: 15px;
}
.area-chosen {
    width: 160px;
}
.scenery-name-input {
    width: 360px;
}
@time-input-width: 120px;
.time-input,
.date-input {
    width: @time-input-width;
}
.input-break-span {
    margin-left: 10px;
    margin-right: 10px;
}
.money-input {
    width: 60px;
}
.capacity-input {
    width: 80px;
}
.form-item span {
    font-size: 13px;
}
.table-box {
    padding-left: 98px;
    padding-right: 20px;
}
.station-table {
    border-top: 1px solid #e7eaec;
}
</style>
