<template>
<div class="guide-files-page">
    <!-- 主体内容 -->
    <div class="m-container">
        <page-title main="帮助中心" ></page-title>
        <!-- table -->
        <div class="table-panel mt20" >
            <table class="table m-table">
                <thead>
                    <tr>
                        <th>名称</th>
                        <th>文件名</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody v-for="v in list">
                    <tr>
                        <td v-text="v.itemName"></td>
                        <td v-text="v.fileName"></td>
                        <td>
                            <button class="btn btn-primary" type="button"
                                v-if="v.type === 'video'"
                                @click="openVideo(v)">查看</button>
                            <a class="btn btn-primary" target="_blank"
                                v-else :href="v.fileUrl">下载</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
</template>

<script>
import VideoLayer from 'comp/video-layer.vue';
const methods = {};
methods.openVideo = function (item) {
    this.videoLayer = Vue.$newComponent(VideoLayer, {
        src: item.fileUrl
    });
};
const computed = {};
const created = function () {};
const mounted = function () {
    this.list = [
        {
            itemName: '内蒙古移动集中运营平台(IOP)系统功能介绍V2.4',
            fileName: 'IOP_guide_v2.4.zip',
            fileUrl: Config.staticPath + '/assets/IOP_guide_v2.4.zip'
        },
        {
            itemName: 'IOP操作视频V20190912',
            fileName: 'IOP操作视频V20190912.mp4',
            type: 'video',
            fileUrl: '/iop/video/showVideo.action'
        },
        {
            itemName: 'BOSS营销审计名单推送V1.0',
            fileName: 'BOSS营销审计名单推送V1.0.zip',
            fileUrl: Config.staticPath + '/assets/BOSS营销审计名单推送V1.0.zip'
        },
    ];
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        list: []
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
    components: {
        
    }
};
</script>

<style scoped lang="less">

</style>
