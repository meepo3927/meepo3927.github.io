/**
 * 遮罩层
 */

define([], function () {
    var zIndex = 2;
    var opacity = 0.6;
    function Cover(options = {}) {
        var elem = document.createElement('div');
        elem.className = '';
        elem.style.display = 'none';
        elem.style.width = '100%';
        elem.style.height = '100%';
        elem.style.backgroundColor = options.backgroundColor || '#000';
        elem.style.position = 'fixed';
        elem.style.top = '0';
        elem.style.left = '0';
        elem.style.right = '0';
        elem.style.bottom = '0';
        elem.style.zIndex = options.zIndex || zIndex;
        elem.style.opacity = options.opacity || opacity;
        elem.style.filter = 'alpha(opacity=' + (100 * opacity) + ')';
        if (options.className) {
            elem.className += options.className;
        }
        document.body.appendChild(elem);
        this.elem = elem;
        this.options = options;
        this.init();
    }
    var proto = Cover.prototype;
    proto.init = function () {
        // 默认显示
        if (this.options.show !== false) {
            this.show();
        }
        // 点击事件
        if (this.options.onClick) {
            this.elem.addEventListener('click', this.options.onClick, true);
        }
    };
    proto.show = function () {
        this.elem.style.display = 'block';
    };
    proto.hide = function () {
        this.elem.style.display = 'none';
    };
    proto.remove = function () {
        document.body.removeChild(this.elem);
    };

    return Cover;
});
