
var Vue = require('vue');

const WIDTH_DIFF_MIN = 5;

const FAKE_GAP = 10;

var vendors = ['ms', 'moz', 'webkit', 'o'];
for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
    var vp = vendors[i];
    window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = (
        window[vp + 'CancelAnimationFrame']
        ||
        window[vp + 'CancelRequestAnimationFrame']
    );
}

function Marquee(el) {
    if (!el) {
        return;
    }
    this.el = el;

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
    this.setOffset(left - 1);

    // 内容已显示完全，加入fakeElem
    if (Math.abs(left) === this.widthDiff) {
        this.appendFakeElem();
    }
    if (Math.abs(left) === FAKE_GAP + this.elemWidth) {
        this.removeFakeElem();
        return this.reset();
    }
    this.timer = requestAnimationFrame(() => {
        this.loop();
    });
};
proto.appendFakeElem = function () {
    if (this.fakeElem) {
        return false;
    }
    var elem = this.el.cloneNode(true);
    elem.style.marginLeft = FAKE_GAP + 'px';
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
        cancelAnimationFrame(this.timer);
        this.timer = null;
    }
    this.stoped = true;
    this.removeFakeElem();
    this.setOffset('0');
};

const bind = function () {};
const inserted = function (el, binding) {
    if (!el.MarqueeInstance) {
        el.MarqueeInstance = new Marquee(el);
    }
    el.MarqueeInstance.init();
};

const updated = function (el, binding) {
    if (!el.MarqueeInstance) {
        el.MarqueeInstance = new Marquee(el);
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