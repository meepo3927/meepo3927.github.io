/**
 * jquery扩展
 * 元素吸顶
 */

define(['jquery'], function ($) {
    // var $ = window.jQuery;
    var X_CLASSNAME = 'x-sticky';
    var X_BLOCK_CLASSNAME = 'x-sticky-block';
    var $window = $(window);
    var $html = $(document.documentElement);
    function Sticky($elem) {
        this.originValues = {};
        this.replaceProperties = {
            position: 'fixed',
            top: 0,
            zIndex: 3000,
            marginLeft: 0,
            marginTop: 0
        };
        this.$elem = $elem;
        this.bind();
        this.onWindowScroll();
    }
    var proto = Sticky.prototype;
    proto.bind = function () {
        $window.on('scroll', this.onWindowScroll.bind(this));
    };
    proto.getOffset = function () {
        var $block = this.$elem.next('.' + X_BLOCK_CLASSNAME);
        if ($block.length) {
            return $block.offset();
        }

        return this.$elem.offset();
    };
    proto.onWindowScroll = function (e) {
        var offset = this.getOffset();
        var offsetTop = offset.top;

        var winScrollTop = $window.scrollTop();
        if (winScrollTop > offsetTop && !this.$elem.hasClass(X_CLASSNAME)) {
            // Change position to `fixed`, and make a block replace it.
            this.make(offset);
        } else if (winScrollTop < offsetTop && this.$elem.hasClass(X_CLASSNAME)) {
            // restore the status
            this.restore();
        }
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
            this.$block = $('<div class="' + X_BLOCK_CLASSNAME + '"></div>');
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
        $elem.css({
            width: 'auto',
            left: offset.left + 'px'
        });
        $elem.addClass(X_CLASSNAME);
    };
    proto.restore = function () {
        var $elem = this.$elem;
        for (var i in this.originValues) {
            if (this.originValues.hasOwnProperty(i)) {
                $elem.css(i, this.originValues[i]);
            }
        }
        $elem.removeClass(X_CLASSNAME);
        if (this.$block) {
            this.$block.remove();
            this.$block = null;
        }
    };
    // Extend
    $.fn.sticky = function () {
        this.each(function () {
            if (!this.stickyInstance) {
                this.stickyInstance = new Sticky($(this));
            }
        });
    };
});