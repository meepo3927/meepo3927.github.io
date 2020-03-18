<template>
<div class="product-slide">
    <div class="product-slide-wrapper" @mousedown.capture="onMouseDown">
        <div class="slide-inner-wrapper">
            <ul ref="ul">
                <!-- list -->
                <li v-for="(v, i) in olist" :class="[getPositionClass(i)]"
                    :data-index="i"
                    :data-name="v.name">
                    <a href="javascript:;" :data-product="v.name"
                        @dragstart.prevent
                        @click.prevent
                        @mousemove.prevent>
                        <!-- 缩略图 -->
                        <img :src="getProductImg(v)" class="product-img" 
                             />
                        <!-- 产品名 -->
                        <h4 v-text="v.name"></h4>
                        <!-- 图标 -->
                        <i class="fa fa-play-circle product-play-icon pos-center"></i>
                    </a>
                </li>

            </ul>
        </div>
    </div>
    <a href="javascript:;" class="v-left-btn arrow-btn" @click="prev">
        <img :src="getImageUrl('/arrow_left.png')" alt="">
    </a>
    <a href="javascript:;" class="v-right-btn arrow-btn" @click="next">
        <img :src="getImageUrl('/arrow_right.png')" alt="">
    </a>
</div>
</template>

<script>
const $ = require('jquery');

const ITEM_WIDTH = 490;
const ITEM_MARGIN = 0;
const STEP_PX = ITEM_WIDTH + ITEM_MARGIN;
let methods = {};
methods.onMouseDown = function (e) {
    this.startX = e.clientX;
    this.touching = true;

    window.addEventListener('mouseup', this.onMouseUp, true);
};
methods.onMouseUp = function (e) {
    if (!this.touching) {
        return;
    }
    window.removeEventListener('mouseup', this.onMouseUp, true);
    if (!$.contains(this.$el, e.target)) {
        return;
    }
    let distance = e.clientX - this.startX;
    if (distance > 30) {
        this.prev();
    } else if (distance < -30) {
        this.next();
    } else {
        let $a = $(e.target).parent('a');
        let dataProduct = $a.attr('data-product');
        if (dataProduct) {
            this.$emit('open', dataProduct);
        }
    }
};

methods.getPositionClass = function (i) {
    let cur = this.curIndex;
    let head = cur - this.total;
    let tail = cur + this.total;
    let arr = [];
    if (i === cur || i === head || i === tail) {
        return 'item-active';
    } else if (cur < i) {
        return 'item-next';
    } else {
        return 'item-prev';
    }
};
methods.getCurPosition = function () {
    let v = $(this.$refs.ul).css('left');
    return parseInt(v, 10) || 0;
};
methods.getStepPosition = function (n) {
    return -(n * STEP_PX);
};
methods.animateDone = function () {
    this.animating = false;
    if (this.curIndex === 1) {
        // 修正
        let fixedPosition = this.getStepPosition(this.total);
        $(this.$refs.ul).css('left', fixedPosition + 'px');
        this.curIndex = this.total + 1;
    } else if (this.curIndex === this.total + 2) {
        // 修正
        let fixedPosition = this.getStepPosition(1);
        $(this.$refs.ul).css('left', fixedPosition + 'px');
        this.curIndex = 2;
    }

    if (this.doneFunc) {
        this.doneFunc();
        this.doneFunc = null;
    }
};
methods.prev = function () {
    if (this.animating) {
        this.doneFunc = this.prev;
        return;
    }
    this.animating = true;
    this.curIndex--;
    let pos = this.getCurPosition() + STEP_PX;
    $(this.$refs.ul).animate({
        left: pos + 'px'
    }, () => {
        this.animateDone();
    });
};
methods.next = function () {
    if (this.animating) {
        this.doneFunc = this.next;
        return;
    }
    this.animating = true;
    this.curIndex++;
    let pos = this.getCurPosition() - STEP_PX;
    $(this.$refs.ul).animate({
        left: pos + 'px'
    }, () => {
        this.animateDone();
    });
};
let computed = {};
computed.headFake = function () {
    return this.list.slice(this.list.length - 2);
};
computed.tailFake = function () {
    return this.list.slice(0, 2);
};
computed.list = function () {
    return this.products;
};
computed.olist = function () {
    return this.headFake.concat(this.list).concat(this.tailFake);
};
computed.total = function () {
    return this.list.length;
};
let watch = {};
const created = function () {};
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        curIndex: 3,
        animating: false,
        doneFunc: null
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
        require('mixins/product_case.js')
    ],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
@import "./ref";
@item-margin:    0;
@scale:          0.75;
@product-img-width:   490px;
@product-img-ratio:   1.7778;
@arrow-offset:        60px;
@product-img-height:  round(@product-img-width / @product-img-ratio);

@item-width:   @product-img-width;
@item-text-height: 60px;
@item-height:      @product-img-height + @item-text-height;

@step:            @item-width + @item-margin;
@box-width:       @item-width * 3 + @item-margin * 4;
.product-slide {
    position: relative;
    .arrow-btn {
        position: absolute;
        top: 50%;
        margin-top: -30px;
        left: 50%;
    }
    .v-left-btn {
        margin-left: -(@main-width / 2) - @arrow-offset - 15px;
    }
    .v-right-btn {
        margin-left: (@main-width / 2) + @arrow-offset - 15px;
    }
}
@media (max-width: 1540px) {
    .product-slide .arrow-btn {
        display: none;
    }
}
.product-slide-wrapper {
    width: @main-width;
    height: @item-height;
    position: relative;
    overflow: hidden;
    margin-left: auto;
    margin-right: auto;
}
.slide-inner-wrapper {
    width: @box-width;
    height: 100%;
    overflow: hidden;
    position: relative;
    margin-left: -(@box-width - @main-width) / 2;
}

ul {
    display: block;
    width: 999999px;
    padding-left: @item-margin;
    position: absolute;

    // 初始状态
    left: -2 * (@step);
}
li {
    display: block;
    width: @item-width;
    height: @item-height;
    margin-right: @item-margin;
    float: left;
    text-align: center;
    
    transition: all .5s ease 0s;
    &:nth-last-child(1) {
        margin-right: 0;
    }
    &.item-prev,
    &.item-next {
        transform: scale(@scale);
    }
}
li > a {
    width: 100%;
    height: 100%;
    display: block;
    position: relative;
    & > .fa-play-circle {
        top: @product-img-height / 2 - 36px;
    }
    & > img {
        width: 100%;
        height: @product-img-height;
        margin: 0;
    }
    & > h4 {
        color: #333;
        margin: 0;
        background-color: #fff;
        height: @item-text-height;
        line-height: @item-text-height;
        font-size: 20px;
    }
}


</style>
