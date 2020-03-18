
const $ = require('jquery');

const isFirefox = navigator.userAgent.match(/Firefox\/([\d.]+)/);
const MY_CLASSNAME = 'v-sticky';
const BLOCK_CLASSNAME = 'v-sticky-block';

function Sticky(elem) {
    this.originValues = {};
    this.replaceProperties = {
        position: 'fixed',
        top: 0,
        zIndex: 3000,
        marginLeft: 0,
        marginTop: 0
    };
    this.$elem = $(elem);
    this.onWindowScroll = (e) => {
        this._onWindowScroll(e);
    };
    this.onWindowResize = (e) => {
        this._onWindowResize(e);
    };
    this.bind();
    this.onWindowScroll();
}
var proto = Sticky.prototype;
proto.bind = function () {
    $(window).on('scroll', this.onWindowScroll)
        .on('resize', this.onWindowResize);
};
proto.unbind = function () {
    $(window).off('scroll', this.onWindowScroll)
        .off('resize', this.onWindowResize);
};
proto.dispose = function () {
    this.unbind();
    this.restore();
};
proto.getOffset = function () {
    var $block = this.$elem.next('.' + BLOCK_CLASSNAME);
    if ($block.length) {
        return $block.offset();
    }
    return this.$elem.offset();
};
proto.saveOrigin = function () {
    for (var i in this.replaceProperties) {
        if (this.replaceProperties.hasOwnProperty(i)) {
            this.originValues[i] = this.$elem.css(i);
        }
    }
};
proto.makeBlock = function () {
    if (!this.$block || this.$block.length === 0) {
        this.$block = $('<div class="' + BLOCK_CLASSNAME + '"></div>');
        this.$block.insertAfter(this.$elem);
    }
    return this.$block;
};
proto.make = function (offset) {
    var $elem = this.$elem;
    // 保存原状态
    this.saveOrigin();
    var elemWidth = $elem.width();
    var elemHeight = $elem.height();
    var $block = this.makeBlock();
    $block.css({
        width: elemWidth + 'px',
        height: elemHeight + 'px'
    });

    for (var i in this.replaceProperties) {
        $elem.css(i, this.replaceProperties[i]);
    }
    var width = 'auto';
    if (isFirefox) {
        width = elemWidth + 'px';
    }
    $elem.css({
        width: width,
        left: offset.left + 'px'
    });
    $elem.addClass(MY_CLASSNAME);
};
proto.restore = function () {
    var $elem = this.$elem;
    for (var i in this.originValues) {
        if (this.originValues.hasOwnProperty(i)) {
            $elem.css(i, this.originValues[i]);
        }
    }
    $elem.removeClass(MY_CLASSNAME);
    if (this.$block) {
        this.$block.remove();
        this.$block = null;
    }
};
proto._onWindowScroll = function () {
    var offset = this.getOffset();
    var offsetTop = offset.top;

    var winScrollTop = $(window).scrollTop();
    if (winScrollTop > offsetTop && !this.$elem.hasClass(MY_CLASSNAME)) {
        // Change position to `fixed`, and make a block replace it.
        this.make(offset);
    } else if (winScrollTop < offsetTop && this.$elem.hasClass(MY_CLASSNAME)) {
        // restore the status
        this.restore();
    }
};
proto._onWindowResize = function () {
    if (this.$elem.hasClass(MY_CLASSNAME)) {
        let offset = this.getOffset();
        this.$elem.css({
            //width: width,
            left: offset.left + 'px'
        });
    }
};
// End Class define

module.exports = {
    // Vue.directive('sticky', require('extend/vue.sticky.js'));
    bind (el, binding, vnode) {
        el.__vueSticky__ = new Sticky(el);
    },
    update () {
    },
    unbind (el, binding) {
        if (el.__vueSticky__) {
            el.__vueSticky__.dispose();
            delete el.__vueSticky__;
        }
    }
};