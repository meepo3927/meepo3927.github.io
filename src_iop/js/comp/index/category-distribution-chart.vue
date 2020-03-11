<template>
<div class="my-wrapper">
    
    <div class="text-section" v-if="dataReady">
        <div class="label-1">活动总量</div>
        <div class="data-1">
            <strong v-text="actTotalNum"></strong><span>个</span>
        </div>
        <div class="label-2">营销人次</div>
        <div class="data-2">
            <strong v-text="peopleTotalNum"></strong><span>人</span>
        </div>
    </div>

    <my-chart :o="o" />
</div>
</template>

<script>
const methods = {};
methods.getEmpty = function () {
    return {
        title: {
            text: '正在建设',
            left: 'center',
            top: 'middle'
        }
    };
};
methods.getOption = function (data) {
    if (!data.length) {
        return this.getEmpty();
    }
    return {
        tooltip: {
            confine: true,
            formatter: (p) => {
                return p.name + ':<br />'
                    + p.marker + '活动数量：' + p.value + '<br />'
                    + p.marker + '营销人次：' + p.data.peopleNum;
            }
        },
        legend: {
            data: data.map(v => v.offerNewType),
            bottom: 10
        },
        series: {
            type: 'pie',
            // startAngle: 0,
            center: ['50%', '40%'],
            radius: [70, 100],
            minAngle: 10,
            label: {
                normal: {
                    show: false
                }
            },
            data: data.map(v => {
                return {name: v.offerNewType, value: v.actNum, peopleNum: v.peopleNum}
            })
        }
    }
};
const computed = {};
computed.actTotalNum = function () {
    if (!this.data) {
        return undefined;
    }
    let total = 0;
    this.data.forEach((item) => {
        total += item.actNum;
    });
    return total;
};
computed.peopleTotalNum = function () {
    if (!this.data) {
        return undefined;
    }
    let total = 0;
    this.data.forEach((item) => {
        total += item.peopleNum;
    });
    if (total > 1000 * 10000) {
        return Math.round(total / 10000) + '万';
    } else if (total > 10 * 10000) {
        return (Math.round(total / 100) / 100) + '万';
    }
    return total;
};
const created = function () {};
computed.dataReady = function () {
    if (this.data === undefined || this.data === null) {
        return false;
    }
    return true;
};
const mounted = function () {
    Request.fetch2('/firstPageNew/getDistributionOfActivities').then((data) => {
        if (!data.length) {
            this.o = this.getEmpty();
            return;
        }
        this.data = data;
        this.o = this.getOption(data);
    }).catch(() => {
        this.o = this.getEmpty();
    });
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        data: undefined,
        o: null
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    props: [],
    mounted,
    mixins: [
        require('mixins/echarts_mix.js')
    ],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
.my-wrapper {
    height: 100%;
    position: relative;
}
.text-section {
    position: absolute;
    width: 100%;
    text-align: center;
    top: 20%;
    left: 0;
    .label-1, .label-2 {
        font-size: 16px;
    }
    .data-1, .data-2 {
        strong {
            color: #D74B46;
            font-size: 20px;
        }
        span {
            font-size: 14px;
        }
    }
}
</style>
