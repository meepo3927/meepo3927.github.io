<template>
<div class="touch-detail" v-if="TouchDetailData">
    <!-- 实时在线 -->
    <div class="m-row-auto mb20" v-for="v in rows1">
        <div class="col-label"><label v-text="v.label + '：'"></label></div>
        <div class="col-content" v-text="v.content"></div>
    </div>
    <!-- 属性配置 -->
    <div class="m-row-auto mb20">
        <div class="col-label property-label">属性配置：</div>
        <div class="col-content">
            <table class="property-table">
                <thead>
                    <tr>
                        <th>属性编码</th>
                        <th>属性值</th>
                        <th>属性描述</th>
                    </tr>
                </thead>
                <tbody v-if="my.propertyList">
                    <tr v-for="v in my.propertyList">
                        <td v-text="v.id"></td>
                        <td v-text="v.value"></td>
                        <td  v-text="v.desc"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="m-row-auto mb20" v-for="v in rows2">
        <div class="col-label"><label v-text="v.label + '：'"></label></div>
        <div class="col-content" v-text="v.content"></div>
    </div>
</div>
</template>

<script>
const methods = {};

const computed = {};
computed.rows1 = function () {
    if (!this.TouchDetailData) {
        return [];
    }
    const data = this.TouchDetailData;
    const rows = [
        {label: '营销活动描述', content: data.marketDesc},
        {label: '营销触点', content: this.channelName}
    ].concat(this.$TouchDetailGetCommonRows());
    return rows;
};
computed.rows2 = function () {
    if (!this.TouchDetailData) {
        return [];
    }
    const data = this.TouchDetailData;
    const rows = [
        {label: '营销话术', content: data.marketSentence},
        {label: '营销短信', content: data.shortMessage}
    ];
    return rows;
};
computed.my = function () {
    return this.TouchDetailData || {};
};
computed.channelName = function () {
    for (let i = 0; i < this.channelList.length; i++) {
        if (this.channelList[i].value == this.my.channelId) {
            return this.channelList[i].text;
        }
    }
};
const created = function () {
    window.TouchDetail48 = this;
};
const mounted = function () {
    this.$TouchDetailFetchData();
    Request.getStaticInfo('TouchPoint').then((data) => {
        this.channelList = data.map(v => ({
            value: v.hashKey,
            text: v.hashValue
        }));
    });
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        channelList: []
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
    mixins: [require('mixins/touch_detail.js')],
    beforeDestroy,
    components: {
    }
};
</script>

<style scoped lang="less">
.property-label {
    line-height: 30px;
}
.property-table {
    width: 100%;
    thead > tr > th,
    tbody > tr > td {
        border: 1px solid #ccc;
        padding: 6px 12px;
    }
    thead > tr > th {
        background-color: #BBB;
    }
    tbody > tr > td {
    }
}
</style>
