const Vue = require('vue');
const $ = require('jquery');

const defaults = {
    // width in pixels of the visible scroll area
    width : 'auto',
    // height in pixels of the visible scroll area
    height : '250px',
    // width in pixels of the scrollbar and rail
    size : '7px',
    // scrollbar color, accepts any hex/color value
    color: '#000',
    // scrollbar position - left/right
    position : 'right',
    // distance in pixels between the side edge and the scrollbar
    distance : '1px',
    // default scroll position on load - top / bottom / $('selector')
    start : 'top',
    // sets scrollbar opacity
    opacity : .4,
    // enables always-on mode for the scrollbar
    alwaysVisible : false,
    // check if we should hide the scrollbar when user is hovering over
    disableFadeOut : false,
    // sets visibility of the rail
    railVisible : false,
    // sets rail color
    railColor : '#333333',
    // sets rail opacity
    railOpacity : .2,
    // whether we should enable bar dragging
    railDraggable : true,
    // defautlt CSS class of the rail
    railClass : 'mui-scroll-rail',
    // defautlt CSS class of the bar
    barClass : 'mui-scroll-bar',
    // defautlt CSS class of the wrapper
    wrapperClass : 'mui-scroll-wrapper',
    // check if mousewheel should scroll the window if we reach top/bottom
    allowPageScroll : false,
    // scroll amount applied to each mouse wheel step
    wheelStep : 20,
    // scroll amount applied when user is using gestures
    touchScrollStep : 200,
    // sets border radius
    borderRadius: '7px',
    // sets border radius of the rail
    railBorderRadius : '7px'
};
const minBarHeight = 30;
const divS = '<div></div>';
function Scroll(el, options) {
    this.el = el;
    if (this.el) {
        this.init(options);
    }
}
let proto = Scroll.prototype;
proto.init = function (options) {
    this.releaseScroll = false;
    var o = this.o = $.extend({}, defaults, options);
    var $el = this.$el = $(this.el);
    // ensure we are not binding it again
    if ($el.parent().hasClass(o.wrapperClass)) {
        return this.update(options);
    } else if (options.destroy === true) {
        return;
    }
    // 高度
    o.height = (o.height === 'auto') ? this.$el.parent().height() : o.height;
    // wrap content
    this.makeElem();
    this.initElem();
    this.attach();
    // set up initial height
    this.resetBarHeight();
    this.initPosition();
};
proto.makeElem = function () {
    const o = this.o;
    this.$wrapper = $(divS).addClass(o.wrapperClass).css({
        position: 'relative',
        overflow: 'hidden',
        width: o.width,
        height: o.height
    });

    // create scrollbar rail
    this.$rail = $(divS).addClass(o.railClass).css({
        'width': o.size,
        'height': '100%',
        'position': 'absolute',
        'top': 0,
        'display': (o.alwaysVisible && o.railVisible) ? 'block' : 'none',
        'border-radius': o.railBorderRadius,
        'background': o.railColor,
        'opacity': o.railOpacity,
        'zIndex': 90
    });

    // create scrollbar
    this.$bar = $(divS).addClass(o.barClass).css({
        'background': o.color,
        'width': o.size,
        'position': 'absolute',
        'top': 0,
        'opacity': o.opacity,
        'display': o.alwaysVisible ? 'block' : 'none',
        'border-radius' : o.borderRadius,
        'zIndex': 99
    });
    return {
        wrapper: this.$wrapper,
        rail: this.$rail,
        bar: this.$bar
    };
};
proto.initElem = function () {
    const o = this.o;
    // update style for the div
    this.$el.css({
        overflow: 'hidden',
        width: o.width,
        height: o.height
    });
    // set position
    var position = (o.position === 'right') ? {right: o.distance} : {left: o.distance};
    this.$rail.css(position);
    this.$bar.css(position);
    // wrap it
    this.$el.wrap(this.$wrapper);
    // append to parent div
    this.$el.parent().append(this.$bar);
    this.$el.parent().append(this.$rail);
};
proto.initPosition = function () {
    const o = this.o;
    if (o.start === 'top') {
        return;
    }
    // check start position
    if (o.start === 'bottom') {
        // scroll content to bottom
        this.$bar.css({ top: $el.outerHeight() - this.$bar.outerHeight() });
        this.scrollContent(0, true);
        return;
    }
    // 滚动到某[子元素]
    if (o.start && $(o.start).length) {
        let offset = $(o.start).position().top;
        // assume jQuery selector
        this.scrollContent(offset, false, true);
        // make sure bar stays hidden
        if (!o.alwaysVisible) {
            this.$bar.hide();
        }
    }
};
proto.attach = function () {
    const o = this.o;
    // make it draggable
    if (o.railDraggable) {
        this.attachDrag();
    }

    // on rail over
    this.$rail.hover(() => {
        this.showBar();
    }, () => {
        this.delayHideBar();
    });

    // on bar over
    this.$bar.hover(() => {
        this.isOverBar = true;
    }, () => {
        this.isOverBar = false;
    });

    // show on parent mouseover
    this.$el.hover(() => {
        this.isOverPanel = true;
        this.showBar();
        this.delayHideBar();
    }, () => {
        this.isOverPanel = false;
        this.delayHideBar();
    });
    // attach scroll events
    this.attachWheel();
    let touchY;
    // support for mobile
    this.$el.bind('touchstart', (e, b) => {
        if (e.originalEvent.touches.length) {
            // record where touch started
            touchY = e.originalEvent.touches[0].pageY;
        }
    });

    this.$el.bind('touchmove', function (e) {
        // prevent scrolling the page if necessary
        if (!this.releaseScroll) {
            e.originalEvent.preventDefault();
        }
        if (e.originalEvent.touches.length) {
            // see how far user swiped
            var diff = (touchY - e.originalEvent.touches[0].pageY) / o.touchScrollStep;
            // scroll content
            this.scrollContent(diff, true);
            touchY = e.originalEvent.touches[0].pageY;
        }
    });
};
proto.update = function (options) {
    const $el = this.$el;
    // start from last bar position
    var offset = $el.scrollTop();
    // find bar and rail
    this.$bar = $el.siblings('.' + this.o.barClass);
    this.$rail = $el.siblings('.' + this.o.railClass);
    this.resetBarHeight();

    if ($.isPlainObject(options)) {
        if (options.destroy === true) {
            return this.destroy();
        }
        // 先设置auto，获取重新计算后的高度
        if ('height' in options && options.height === 'auto') {
            $el.parent().css('height', 'auto');
            $el.css('height', 'auto');

            var height = $el.parent().parent().height();
            $el.parent().css('height', height);
            $el.css('height', height);

        } else if ('height' in options) {
            var h = options.height;
            $el.parent().css('height', h);
            $el.css('height', h);
        }

        if ('scrollTo' in options) {
            // jump to a static point
            offset = parseInt(o.scrollTo);
        } else if ('scrollBy' in options) {
            // jump by value pixels
            offset += parseInt(o.scrollBy);
        }

        // scroll content by the given offset
        this.scrollContent(offset, false, true);
    }
};
proto.fixTop = function (v) {
    return Math.min(Math.max(v, 0), this.getMaxTop());
};
proto.getMaxTop = function () {
    return this.$el.outerHeight() - this.$bar.outerHeight();
};
proto.getBarTop = function () {
    return parseInt(this.$bar.css('top'), 10);
};
proto.getWheelPixel = function (y) {
    const $bar = this.$bar;
    const o = this.o;
    let maxTop = this.getMaxTop();
    // move bar with mouse wheel
    let delta = this.getBarTop() + y * parseInt(o.wheelStep, 10) / 100 * $bar.outerHeight();

    // move bar, make sure it doesn't go out
    delta = this.fixTop(delta);

    // if scrolling down, make sure a fractional change to the
    // scroll position isn't rounded away when the scrollbar's CSS is set
    // this flooring of delta would happened automatically when
    // bar.css is set below, but we floor here for clarity
    return (y > 0) ? Math.ceil(delta) : Math.floor(delta);
};
proto.scrollContent = function (y, isWheel, isJump) {
    this.releaseScroll = false;
    const $el = this.$el;
    const $bar = this.$bar;
    const o = this.o;
    if (isWheel) {
        $bar.css({ top: this.getWheelPixel(y) + 'px' });
    }

    // calculate actual scroll amount
    this.percentScroll = this.getBarTop() / ($el.outerHeight() - $bar.outerHeight());
    let delta = this.percentScroll * (this.el.scrollHeight - $el.outerHeight());

    if (isJump) {
        delta = y;
        var offsetTop = delta / this.el.scrollHeight * $el.outerHeight();
        offsetTop = this.fixTop(offsetTop);
        $bar.css({ top: offsetTop + 'px' });
    }

    // scroll content
    $el.scrollTop(delta);
    // fire scrolling event
    $el.trigger('muiscrolling', ~~delta);

    // ensure bar is visible
    this.showBar();
    // trigger hide when scroll is stopped
    this.delayHideBar();
}
// 重新计算高度，并决定是否隐藏
proto.resetBarHeight = function () {
    let me = this.$el;
    // calculate scrollbar height and make sure it is not too small
    let barHeight = Math.max(
        (me.outerHeight() / me[0].scrollHeight) * me.outerHeight(),
        minBarHeight
    );
    this.$bar.css({height: barHeight + 'px'});

    // hide scrollbar if content is not long enough
    var display = barHeight == me.outerHeight() ? 'none' : 'block';
    this.$bar.css({display: display});
    this.barHeight = barHeight;
};

proto.showBar = function () {
    // recalculate bar height
    this.resetBarHeight();
    clearTimeout(this.queueHide);
    let percentScroll = this.percentScroll;
    // when bar reached top or bottom
    if (percentScroll == ~~percentScroll) {
        // release wheel
        this.releaseScroll = this.o.allowPageScroll;

        // publish approporiate event
        if (this.lastScroll != percentScroll) {
            var msg = (~~percentScroll == 0) ? 'top' : 'bottom';
            this.$el.trigger('muiscroll', msg);
        }
    } else {
        this.releaseScroll = false;
    }
    this.lastScroll = percentScroll;

    // show only when required
    if(this.barHeight >= this.$el.outerHeight()) {
        // allow window scroll
        this.releaseScroll = true;
        return;
    }
    this.$bar.stop(true, true).fadeIn('fast');
    if (this.o.railVisible) {
        this.$rail.stop(true, true).fadeIn('fast');
    }
};
proto.hideBar = function () {
    this.$bar.fadeOut('slow');
    this.$rail.fadeOut('slow');
};
proto.delayHideBar = function () {
    // only hide when options allow it
    if (this.o.alwaysVisible) {
        return;
    }
    this.queueHide = setTimeout(() => {
        if (this.o.disableFadeOut || this.isOverPanel) {
            return;
        }
        if (this.isOverBar || this.isDragging) {
            return;
        }

        this.hideBar();
    }, 600);
}
proto.attachWheel = function () {
    const _onWheel = (e) => {this.onWheel(e)};
    if (window.addEventListener) {
        this.el.addEventListener('DOMMouseScroll', _onWheel, false);
        this.el.addEventListener('mousewheel', _onWheel, false);
    } else {
        document.attachEvent("onmousewheel", _onWheel)
    }
};
proto.attachDrag = function () {
    this.$bar.bind("mousedown", (e) => {
        this.onBarMouseDown(e);
    }).bind("selectstart.muiscroll", function(e) {
        e.stopPropagation();
        e.preventDefault();
        return false;
    });
};
proto.onWheel = function (e) {
    // use mouse wheel only when mouse is over
    if (!this.isOverPanel) {
        return;
    }
    const o = this.o;
    e = e || window.event;

    let delta = 0;
    if (e.wheelDelta) {
        delta = -e.wheelDelta / 120;
    } else if (e.detail) {
        delta = e.detail / 3;
    }

    let target = e.target || e.srcTarget || e.srcElement;
    if ($(target).closest('.' + o.wrapperClass).is(this.$el.parent())) {
        // scroll content
        this.scrollContent(delta, true);
    }

    // stop window scroll
    if (e.preventDefault && !this.releaseScroll) {
        e.preventDefault();
    }
    if (!this.releaseScroll) {
        e.returnValue = false;
    }
};
proto.onBarMouseDown = function (e) {
    const $doc = $(document);
    const $bar = this.$bar;
    this.isDragging = true;
    let t = parseFloat($bar.css('top'));
    let startY = e.pageY;
    let currTop;
    $doc.bind("mousemove.muiscroll", (e) => {
        currTop = t + e.pageY - startY;
        $bar.css('top', currTop);
        this.scrollContent(0, $bar.position().top, false);
    });
    $doc.bind("mouseup.muiscroll", (e) => {
        this.isDragging = false;
        this.delayHideBar();
        $doc.unbind('.muiscroll');
    });
    return false;
};
proto.destroy = function () {
    this.$bar.remove();
    this.$rail.remove();
    this.$el.unwrap();
};

module.exports = {
    bind (el, binding, vnode) {
        let options = binding.value || {};
        Vue.nextTick(() => {
            el.__muiScroll = new Scroll(el, options);
        });
    },
    update (el, binding, vnode) {
        let options = binding.value || {};
        Vue.nextTick(() => {
            if (el.__muiScroll) {
                el.__muiScroll.init(options)
            } else {
                el.__muiScroll = new Scroll(el, options);
            }
        });
    },
    unbind (el, binding) {
        if (el.__muiScroll) {
            el.__muiScroll.destroy();
            delete el.__muiScroll;
        }
    }
};