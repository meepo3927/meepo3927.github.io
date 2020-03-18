
var Vue = require('vue');

const WIDTH_DIFF_MIN = 5;
const FAKE_GAP = 10;

function Marquee(el, options) {
    if (!el) {
        return;
    }
    this.el = el;
    this.options = options || {};

    let parent = el.parentNode || el.parentElement;

    this.parent = parent;
}
var proto = Marquee.prototype;
proto.getElemWidth = function () {
    return this.el.scrollWidth || this.el.clientWidth;
};
proto.getWidthDiff = function () {
    let parent = this.parent;

    var parentWidth = parent.clientWidth || parent.offsetWidth;
    var elemWidth = this.getElemWidth();
    return (elemWidth - parentWidth);
};
proto.init = function () {
    if (!this.el) {
        return;
    }
    this.start();
};
proto.start = function () {
    let diff = this.getWidthDiff();
    if (diff < WIDTH_DIFF_MIN) {
        return;
    }
    this.widthDiff = diff;
    this.elemWidth = this.getElemWidth();
    this.loop();
};
proto.reset = function () {
    this.setOffset('0');
    this.start();
};
proto.update = function () {
    if (!this.el) {
        return;
    }
};
proto.getElemOffset = function () {
    let left = this.el.style.marginLeft;
    if (left) {
        return parseInt(left, 10);
    }
    return 0;
};
proto.setOffset = function (v) {
    this.el.style.marginLeft = v + 'px';
};
proto.loop = function () {
    if (this.stoped) {
        return false;
    }
    let left = this.getElemOffset();
    let gap = this.options.gap || FAKE_GAP;
    this.setOffset(left - 1);

    // 内容已显示完全，加入fakeElem
    if (Math.abs(left) === this.widthDiff) {
        this.appendFakeElem();
    }
    if (Math.abs(left) === gap + this.elemWidth) {
        this.removeFakeElem();
        return this.reset();
    }
    this.timer = setTimeout(() => {
        this.loop();
    }, this.options.interval || 20);
};
proto.appendFakeElem = function () {
    if (this.fakeElem) {
        return false;
    }
    var elem = this.el.cloneNode(true);
    var gap = this.options.gap || FAKE_GAP;
    elem.style.marginLeft = gap + 'px';
    this.parent.appendChild(elem);

    this.fakeElem = elem;
};
proto.removeFakeElem = function () {
    if (this.fakeElem) {
        this.parent.removeChild(this.fakeElem);
        this.fakeElem = null;
    }
};
proto.dispose = function () {
    if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
    }
    this.stoped = true;
    this.removeFakeElem();
    this.setOffset('0');
};

const bind = function () {};
const inserted = function (el, binding) {
    if (!el.MarqueeInstance) {
        el.MarqueeInstance = new Marquee(el, binding.value);
    }
    el.MarqueeInstance.init();
};

const updated = function (el, binding) {
    if (!el.MarqueeInstance) {
        el.MarqueeInstance = new Marquee(el, binding.value);
    }
    el.MarqueeInstance.update();
};

const unbind = function (el, binding) {
    if (el.MarqueeInstance) {
        el.MarqueeInstance.dispose();
        el.MarqueeInstance = null;
    }
};

module.exports = Vue.directive('marquee', {
    bind: bind,
    inserted: inserted,
    componentUpdated: updated,
    unbind: unbind
});