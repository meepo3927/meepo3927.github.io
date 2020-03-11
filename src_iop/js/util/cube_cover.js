/**
 * @描述  cube遮罩
 * @用法  {
 *     
 * }
 */
const CSS = {
    position: 'fixed',
    zIndex: 70000,
    backgroundColor: '#000',
    opacity: .5,
    filter: 'alpha(opacity=50)'
};
function CubeCover(options = {}) {
    this.setOptions(options);
    this.init();
}
const proto = CubeCover.prototype;
proto.init = function () {
    let $topCover = $('<div></div>');
    let $leftCover = $('<div></div>');
    let $rightCover = $('<div></div>');
    let $bottomCover = $('<div></div>');

    $topCover.css(this.getTopCSS());
    $leftCover.css(this.getLeftCSS());
    $rightCover.css(this.getRightCSS());
    $bottomCover.css(this.getBottomCSS());

    this.$topCover = $topCover;
    this.$leftCover = $leftCover;
    this.$rightCover = $rightCover;
    this.$bottomCover = $bottomCover;

    $(document.body).append($topCover);
    $(document.body).append($leftCover);
    $(document.body).append($rightCover);
    $(document.body).append($bottomCover);
};

proto.setOptions = function (options) {
    let rect;
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 99999;
    this.y2 = 99999;
    this.height = undefined;

    if (options.rect) {
        rect = options.rect;
    } else if (options.elem) {
        rect = options.elem.getBoundingClientRect();
    }
    if (rect) {
        this.x1 = Math.floor(rect.left);
        this.y1 = Math.floor(rect.top);
        this.x2 = Math.round(rect.left + rect.width);
        this.y2 = Math.round(rect.top + rect.height);
    }

    if (options.x1 !== undefined) {
        this.x1 = Math.max(options.x1, 0);
    }
    if (options.y1 !== undefined) {
        this.y1 = Math.max(options.y1, 0);
    }
    if (options.x2 !== undefined) {
        this.x2 = options.x2;
    }
    if (options.y2 !== undefined) {
        this.y2 = options.y2;
    }
    if (this.height === undefined && this.y2) {
        this.height = this.y2 - this.y1;
    }

    this.CSS = $.extend({}, CSS, options.CSS);
};
proto.update = function (options) {
    this.setOptions(options);
    if (this.$topCover) {
        this.$topCover.css(this.getTopCSS());
    }
    if (this.$leftCover) {
        this.$leftCover.css(this.getLeftCSS());
    }
    if (this.$rightCover) {
        this.$rightCover.css(this.getRightCSS());
    }
    if (this.$bottomCover) {
        this.$bottomCover.css(this.getBottomCSS());
    }
};
proto.getTopCSS = function () {
    return $.extend({}, this.CSS, {
        top: 0,
        left: 0,
        right: 0,
        height: this.y1 + 'px'
    });
};
proto.getLeftCSS = function () {
    return $.extend({}, this.CSS, {
        top: this.y1 + 'px',
        left: 0,
        width: this.x1 + 'px',
        height: this.height + 'px'
    })
};
proto.getRightCSS = function () {
    return $.extend({}, this.CSS, {
        top: this.y1 + 'px',
        left: this.x2 + 'px',
        right: 0,
        height: this.height + 'px'
    })
};
proto.getBottomCSS = function () {
    return $.extend({}, this.CSS, {
        top: this.y2 + 'px',
        left: 0,
        right: 0,
        bottom: 0
    })
};
proto.dispose = proto.remove = function () {
    this.$topCover.remove();
    this.$leftCover.remove();
    this.$rightCover.remove();
    this.$bottomCover.remove();

    this.$topCover = null;
    this.$leftCover = null;
    this.$rightCover = null;
    this.$bottomCover = null;
};


module.exports = CubeCover;