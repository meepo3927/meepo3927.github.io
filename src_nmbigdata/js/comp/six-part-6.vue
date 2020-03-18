<template>
<div class="six-part six-part-6 inner-main">
    <div class="six-part-banner">
        <img :src="getBannerImg(5)" />
        <h3 v-text="sixTitle[5]"></h3>
        <h4 v-text="sixSubTitle[5]"></h4>
    </div>

    <!-- 描述 -->
    <div class="six-intro-text mt15" v-text="sixWholeDesc[5]"></div>
    <!-- section 1 -->
    <div class="main-section mt15">
        <div class="section-col">
            <h3 class="six-section-h3">
                <i class="fa fa-lightbulb-o"></i> 热点资讯
            </h3>
            <ul class="nav nav-tabs mt15">
                <li v-for="(v, i) in cates" :class="{active: v === activeCate1}">
                    <a href="javascript:;" v-text="v" @click="onTabClick(v, i)"></a>
                </li>
            </ul>
            <div class="tab-content news-content" >
                <rank-table :list="newsRankData" />
            </div>
        </div><!--
     --><div class="section-col">
            <h3 class="six-section-h3">
                <i class="fa fa-clock-o"></i> 实时搜索关键词
            </h3>

            <div class="bubble-wrapper">
                <word-bubble class="word-bubble" :city-id="cityId" />
            </div>
        </div>
    </div>

    <!-- section 2 -->
    <div class="main-section mt15">
        <div class="section-col">
            <h3 class="six-section-h3">
                <i class="fa fa-sort-amount-desc"></i> 搜索排名
            </h3>

            <div class="m-row-auto-mid">
                <label class="pl5">选择行业：</label>
                <div class="pl15">
                    <select class="form-control" v-model="activeCate2">
                        <option v-for="v in cates" v-text="v"></option>
                    </select>
                </div>
                <div class="pl15">
                    <select class="form-control" v-model="secondLevel">
                        <option v-for="v in subCates" v-text="v"></option>
                    </select>
                </div>
            </div>
            <div class="chart-box-1">
                <div class="chart-1"><my-chart :o="o1" /></div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
const tool = require('util/tool.js');
const EChartUtil = require('util/echart.js');

const NEWS_LIMIT = 100;
let secondLevelCache = {};
const getShortWord = (w, len = 12) => {
    if (!w) {
        return '';
    }
    let word = w.split('_').pop();
    if (word.length > len) {
        return word.substr(0, len - 3) + '...' + word.substr(word.length - 3)
    }
    return word;
};
let methods = {};
methods.onTabClick = function (v, i) {
    this.activeCate1 = v;
};

methods.fetchRenderHotWords = function () {
    let p = {
        firstLevel: encodeURIComponent(this.activeCate1),
        limit: NEWS_LIMIT,
        func: 'opinionListByCate'
    };
    this.newsRankData = 'loading';
    let req = this.vRequest.fetch3('/rest/monitor', p);
    this.setPromise('opinionListByCate', req).then((data) => {
        if (!data) {
            this.newsRankData = null;
            return;
        }
        this.newsRankData = data.map((v) => ({
            status: (v.searchWords.length % 2 === 0) ? 'up' : 'down',
            searchWords: v.searchWords,
            secondLevel: v.secondLevel,
            totalTimes: v.totalTimes,
            open: false
        }));
    }).catch((e) => {
        this.newsRankData = null;
        LOG(e);
    });
};
methods.fetchRenderIndustryWords = function () {
    let p = {
        func: 'searchRank',
        firstLevel: encodeURIComponent(this.activeCate2),
        secondLevel: encodeURIComponent(this.secondLevel),
        days: 30,
        limit: 10
    };
    this.o1 = null;
    const req = this.vRequest.fetch3('/rest/monitor', p);
    this.setPromise('fetchRenderIndustryWords', req).then((result) => {
        let data = result.map((v) => {
            let word = getShortWord(v.searchWords);
            return {
                word,
                searchWords: v.searchWords,
                value: v.totalTimes
            };
        });
        this.o1 = this.getRankOption(data);
    }).catch((e) => {
        this.o1 = 'empty';
        LOG(e);
    });
};


methods.fetchSecondLevel = function () {
    let t = this.activeCate2;
    if (secondLevelCache[t]) {
        this.subCates = secondLevelCache[t];
        this.secondLevel = this.subCates[0];
        return true;
    }
    this.subCates = [];
    this.vRequest.opinionCate({firstLevel: encodeURIComponent(t)}).then((arr) => {
        let result = [];
        arr.forEach((v) => {
            if (v.secondLevel) {
                result.push(v.secondLevel);
            }
        })
        secondLevelCache[t] = result.slice();
        this.subCates = result;
        this.secondLevel = this.subCates[0];
    }).catch(() => {
        this.subCates = [];
        this.secondLevel = [];
    });
};
methods.getRankOption = function (data) {
    if (data) {
        data.sort((a, b) => {
            return a.value - b.value;
        });
    }

    return this.getHorizontalBar({
        title: {
            text: '搜索词热度排行'
        },
        tooltip: {
            confine: true,
            formatter: (a) => {
                let p = a[0];
                return p.data.searchWords
            }
        },
        xAxis: {
            minInterval: '10',
            axisLine: {
                show: true
            }
        },
        yAxis: {
            data: data.map(v => v.word)
        },
        series: [{
            name: '搜索次数',
            data: data
        }]
    });
};
methods.getWordCloudOption = function (data) {
    return {
        tooltip: {},
        series: [EChartUtil.getWordCloudSeries({
            data
        })]
    };
};
methods.getTrendOption = function (data, word = '') {
    return this.getLineOption({
        title: {
            text: '[' + word + '] 曝光量近期走势',
            top: 16
        },
        xAxis: {
            data: data.map(v => v.calDate)
        },
        series: [{
            name: '曝光量',
            data: data.map(v => v.totalTimes)
        }]
    });
};
let computed = {};

let watch = {};
watch.activeCate1 = function (v) {
    if (v) {
        this.fetchRenderHotWords();
    }
};
watch.activeCate2 = function (v) {
    if (v) {
        this.fetchSecondLevel();
    }
};
watch.secondLevel = function (v) {
    if (v) {
        this.fetchRenderIndustryWords();
    }
};
const created = function () {};
const mounted = function () {
    window.SixPart6 = this;
    // 类别
    this.vRequest.opinionCate().then((data) => {
        this.cates = data.map((v) => {
            return v.firstLevel
        });
        this.activeCate1 = this.cates[0];
        this.activeCate2 = this.cates[0];
    });
    // 负面报道
    this.$nextTick(this.fetchRenderBadWords);
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        o1: null,
        newsRankData: undefined,
        cates: [],
        subCates: [],
        activeCate1: undefined,
        activeCate2: undefined,
        secondLevel: undefined,
        newsIndex: 0,
        cityId: 471
    };
    return o;
};
module.exports = {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: [],
    mounted,
    mixins: [
        require('mixins/six_part.js')
    ],
    beforeDestroy,
    components: {
        'rank-table': require('comp/hotword-rank-table.vue'),
        'word-bubble': require('comp/publico-word-bubble.vue')
    }
};
</script>

<style scoped lang="less">
@import "./ref";
@news-content-height:   564px;
@section-col-pad:       30px;
.six-part-6 {
}
.six-section-h3 {
    margin-bottom: 25px;
}
.section-col {
    vertical-align: top;
    display: inline-block;
    width: 50%;
    &:nth-child(1) {
        padding-right: @section-col-pad;
    }
    &:nth-child(2) {
        padding-left: @section-col-pad;
    }
}
.news-content {
    height: @news-content-height;
    overflow-x: hidden;
    overflow-y: auto;
}
.industry-sel-border {
    margin-top: 10px;
    margin-right: 15px;
    border-bottom: 1px solid #dcdcdc;
    height: 1px;
}
.chart-box-1 {
    border: 1px solid #dcdcdc;
    margin-top: 20px;
    padding: 20px;
    height: @news-content-height;
}
.chart-1 {
    height: 100%;
}
.bubble-wrapper {
    margin-top: 34px;
    height: @news-content-height + 35px;
    // width: 50%;
    // padding-right: @section-col-pad;
    .word-bubble {
        background-color: #f1f1f1;
        background: linear-gradient(to top, #f1f1f1, #fff);
    }
}

</style>
