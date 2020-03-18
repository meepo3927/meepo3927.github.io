const EChartUtil = require('util/echart.js');
const tool = require('util/tool.js');

const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};
methods.getGenderOption = function (data = {}) {
    return this.getPieOption({
        title: {
            text: '性别比例'
        },
        series: [{
            name: '性别比例',
            label: {
                normal: {
                    formatter: '{b}: {c}'
                }
            },
            data: [
                // {value: tool.getRandInt(20111, 34777), name: '女'},
                // {value: tool.getRandInt(18888, 36666), name: '男'}
                {value: data.famaleNum, name: '女'},
                {value: data.maleNum, name: '男'}
            ]
        }]
    });
};
methods.getAgeOption = function (data) {
    return this.getLineOption({
        title: {
            text: '年龄构成'
        },
        xAxis: {
            data: [
                '18岁以下', '18-25', '26-30',
                '31-40', '40岁以上'
            ],
            axisLabel: {
                interval: 0
            }
        },
        series: [{
            name: '人数',
            data: [
                data.num18AgeDown,
                data.num1825Age,
                data.num2630Age,
                data.num3140Age,
                data.num40AgeAbove
            ]
        }]
    });
};
const CARRER_MAP = {
    jobCiseNum: '公务员',
    jobDriverNum: '司机',
    jobFreelanceNum: '自由职业者',
    jobFthNum: '全职家庭主妇',
    jobGovNum: '机关干部',
    jobIndhIndhNum: '个体经营者',
    jobSalmSalmSalmNum: '推销/销售人员', // '业务员/推销员/销售人员',
    jobSemaperNum: '企业管理人员', // '中高级企业管理人员',
    jobSociNum: '社会名流',
    jobStudNum: '学生',
    jobTechDoctorTestNum: '教师/医生人员',
    jobWorkerGoNum: '工人一般职业',
    // jobUnknownNum: '未知',
    jobRfhNum: '退休人员',
    jobJohoNum: '无业人员',
    jobOthrNum: '其他',
};

methods.getCarrerOption = function (data) {
    let filtered = tool.filterHashData(CARRER_MAP, data, {sort: true});

    return this.getHorizontalBar({
        title: {
            text: '职业分布'
        },
        xAxis: {
            axisLabel: {show: false}
        },
        yAxis: {
            data: filtered.map((v) => v.name)
        },
        series: [{
            name: '人数',
            data: filtered.map(v => v.value)
        }]
    });
};
methods.getArpuOption = function (data) {
    return this.getVerticalBar({
        title: {
            text: '平均月消费(元)'
        },
        xAxis: {
            data: ['<200', '200-500', '500-1000', '>1000'],
            axisLabel: {
                interval: 0
            }
        },
        series: [{
            name: '人数',
            data: [
                data.arpuLt200Num,
                data.appu200500Num,
                data.arpu5001000Num,
                data.arpuGt1000Num
            ]
        }]
    });
};
methods.getPieOption = function (o) {
    return tool.extend(EChartUtil.getPieOption({
        tooltip : {
            position: 'inside'
        },
        series: [{
            radius: '75%',
            label: {
                normal: {position: 'inner'}
            },
            center: ['50%', '55%']
        }]
    }), o);
};
methods.getLineOption = function (o) {
    return tool.extend({
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false
        },
        yAxis: {
            type: 'value'
        },
        grid: {
            top: '18%',
            left: '15',
            right: '35',
            bottom: '4%',
            containLabel: true
        },
        series: [{
            type: 'line',
            areaStyle: {normal: {}},
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            }
        }]
    }, o);
};
methods.getHorizontalBar = function (o) {
    return tool.extend({
        tooltip: EChartUtil.getBarTooltip(),
        grid: {
            left: '5',
            right: '25',
            top: '40',
            bottom: '0%',
            containLabel: true
        },
        xAxis : {
            type: 'value',
            boundaryGap: [0, '20%']
        },
        yAxis : {
            type: 'category',
            axisTick: {show: false}
        },
        series: [{
            name: '数量',
            type: 'bar',
            barMaxWidth: 35,
            label: {
                normal: {
                    show: true,
                    position: 'right'
                }
            }
        }]
    }, o);
};
methods.getVerticalBar = function (o) {
    return tool.extend({
        tooltip: EChartUtil.getBarTooltip(),
        grid: {
            top: '40',
            left: '5',
            right: '5',
            bottom: '5',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            axisTick: {
                alignWithLabel: true
            }
        },
        yAxis: {
            type : 'value'
        },
        series: [{
            name: '数量',
            type: 'bar',
            barMaxWidth: 45,
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            }
        }]
    }, o);
};
let computed = {};
let watch = {};
module.exports = {
    props: [],
    data: function () {
        var o = {};
        return o;
    },
    watch,
    methods,
    computed,
    created,
    mounted,
    activated,
    deactivated,
    beforeDestroy,
    mixins: [],
    components: {}
};