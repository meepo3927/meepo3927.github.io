const BLOCK_CLASSNAME = 'vue-sticky-block';
/**
 * options
 */
function Sticky(elem, options) {
    this.elem = elem;
    this.options = options;
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
    window.addEventListener('scroll', this.onWindowScroll);
    window.addEventListener('resize', this.onWindowResize);
};
proto.unbind = function () {
    window.removeEventListener('scroll', this.onWindowScroll);
    window.removeEventListener('resize', this.onWindowResize);
};
proto.dispose = function () {
    this.unbind();
    this.detach();
};
proto.getOffset = function () {
    if (this.holder) {
        return this.holder.getBoundingClientRect();
    }
    return this.elem.getBoundingClientRect();
};
// 重新计算position and size
proto.renderElem = function () {
    let offset = this.getOffset();
    this.elem.style.left = offset.left + 'px';
    if (this.holder) {
        this.elem.style.width = this.holder.offsetWidth + 'px';
    }
};
proto.makeHolder = function () {
    if (!this.holder) {
        const deep = (this.options.deep === true) ? true : false;
        this.holder = this.elem.cloneNode(deep);
        this.holder.style.visibility = 'hidden';
        const p = this.elem.parentNode;
        if (p) {
            p.insertBefore(this.holder, this.elem);
        }
    }
    return this.holder;
};
proto.removeHolder = function () {
    if (this.holder) {
        const p = this.holder.parentNode;
        if (p) {
            p.removeChild(this.holder);
        }
        this.holder = null;
    }
};
proto.getStickyStyleText = function () {
    return [
        'position: fixed',
        'top: 0',
        'margin: 0',
        'z-index: 30'
    ].join(';');
};
proto.attach = function () {
    // 保存原状态
    this.oldCSSText = this.elem.style.cssText;
    const elemWidth = this.elem.offsetWidth;
    const elemHeight = this.elem.offsetHeight;
    this.makeHolder();
    // make it float
    this.elem.style.cssText = (this.oldCSSText || '') + this.getStickyStyleText();
    this.renderElem();
    this.elem.IS_STICKY_ATTACHED = true;
};
proto.detach = function () {
    // 还原
    this.elem.style.cssText = this.oldCSSText;
    this.elem.IS_STICKY_ATTACHED = false;
    this.oldCSSText = undefined;
    this.removeHolder();
};
proto._onWindowScroll = function () {
    var offset = this.getOffset();
    // element hidden
    if (offset.width === 0 && offset.height === 0) {
        return this.detach();
    }
    if (offset.top < 0 && !this.elem.IS_STICKY_ATTACHED) {
        // Change position to `fixed`, and make a block replace it.
        this.attach();
    } else if (offset.top > 0 && this.elem.IS_STICKY_ATTACHED) {
        this.detach();
    } else if (this.elem.IS_STICKY_ATTACHED) {
        this.renderElem();
    }
};
proto._onWindowResize = function () {
    // fix position
    if (this.elem.IS_STICKY_ATTACHED) {
        this.renderElem();
    }
};
// End Class define

export default {
    // Vue.directive('sticky', require('extend/vue.sticky.js'));
    bind (el, binding, vnode) {
        el.__vueSticky__ = new Sticky(el, {
            deep: binding.modifiers.deep
        });
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