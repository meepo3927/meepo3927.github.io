<template>
<ul>
    <li v-for="v in list">
        <label v-text="v.label"></label>
        <div class="data-content">
            <strong v-text="v.value"></strong>
            <em v-text="v.unit"></em>
        </div>
    </li>
</ul>
</template>

<script>
const methods = {};
methods.handleUserNum = function (data) {
    const userNum = data.msisdnNum;
    if ((userNum + '').length > 6) {
        this.list[1].value = Math.round(userNum / 100) / 100;
        this.list[1].unit = '万户';
    } else {
        this.list[1].value = userNum;
        this.list[1].unit = '户';
    }
};
methods.handleRate = function (data) {
    const rate = data.rateOfSuccess;
    this.list[2].value = Math.round(rate * 1000) / 1000;
    this.list[2].unit = '%';
};
const computed = {};
const created = function () {};
const mounted = function () {
    Request.fetch2('/firstPageNew/getBranchData').then((result) => {
        this.list[0].value = result.svcNum;
        this.list[0].unit = '个';

        if (result.msisdnNum) {
            this.handleUserNum(result);
        } else {
            this.list[1].value = '--';
        }

        if (result.rateOfSuccess) {
            this.handleRate(result);
        } else {
            this.list[2].value = '--';
        }

        this.list[3].value = result.labelNum;
        this.list[3].unit = '个';
        
    });
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        list: [
            {label: '营销活动总数', value: undefined, unit: ''},
            {label: '活动覆盖用户数', value: undefined, unit: ''},
            {label: '活动平均成功率', value: undefined, unit: ''},
            {label: '使用标签数量', value: undefined, unit: ''}
        ]
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
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
@data-color-1:  #3B7580;
@data-color-2:  @data-color-1;
@data-color-3:  @data-color-2;
@data-color-4:  @data-color-3;
ul {
    height: 100%;
}
ul > li {
    height: 25%;
    border-bottom: 1px solid #DCDCDC;
    padding: 10px 0 10px 20px;
    &:nth-last-child(1) {
        border-bottom: none;
    }
    & > label {
        vertical-align: middle;
        display: inline-block;
        width: 54%;
        font-size: 16px;
    }
    & > .data-content {
        display: inline-block;
        vertical-align: middle;
        height: 100%;
        white-space: nowrap;
        padding-top: 5px;
        strong {
            font-size: 24px;
        }
        em {
            font-style: normal;
            font-size: 14px;
        }
    }
}
li:nth-child(1) > .data-content strong {color: @data-color-1;}
li:nth-child(2) > .data-content strong {color: @data-color-2;}
li:nth-child(3) > .data-content strong {color: @data-color-3;}
li:nth-child(4) > .data-content strong {color: @data-color-4;}
</style>
