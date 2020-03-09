/**
 * 浮层工具库
 * mlayer.msg('some msg', options);
 * mlayer.iconMsg('some msg', options);
 * mlayer.alert('some msg', options|callback);
 * mlayer.confirm('some msg', options|callback);
 * mlayer.loading(options);
 * mlayer.html(html, options);
 *
 * 通用options: {
 *     coverZIndex: 10000,    // 遮罩层zindex, 默认19900415
 *     coverOpacity: .3,      // 遮罩层透明度, 默认0.3
 *     withCover: true,       // 遮罩层
 *     zIndex: 10000,         // Content浮层zindex, 默认19900420
 *     hookContentShow: func, // Content显示方法, 用于替代默认show方法
 *
 *     width: '100px',
 *     width: '80%',          // Content宽度
 *
 *     height: '200px',
 *     height: '80%',         // Content高度
 *
 *     overflow: 'auto',      // Content Overflow
 *
 *     closeBtn: true,        // 显示关闭按钮
 *
 *     time: 3000,            // 关闭时间, 毫秒
 * }
 */

define(['jquery'], function ($) {

    var globalName = 'mlayer';
    var BOX_CLASS_NAME = 'mlayer-box';
    var COVER_CLASS_NAME = 'mlayer-cover';

    function classInherit(Child, Parent) {
        var F = function () {};
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;
        Child.uber = Parent.prototype;
        return Child;
    }
    var $html = $(document.documentElement);
    var $body = $(document.body);
    var Z_INDEX = 19900420;

    var makeAttr = function (obj) {
        var arr = [];
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                var value = obj[i] || '';
                if (value.replace) {
                    value = value.replace(/"/g, '');
                }
                arr.push(i + '="' + value + '"');
            }
        }
        return ' ' + arr.join(' ') + ' ';
    };

    var getNumberPixel = function (w) {
        if (isNaN(w)) {
            return w;
        }
        return w + 'px';
    };

    /**
     * 基类
     *
     * @class      Base
     */
    function Base() {}
    Base.prototype.createCover = function () {
        var html = '<div class="' + COVER_CLASS_NAME + '">&nbsp;</div>';
        var $cover = $(html);
        $body.append($cover);
        return $cover;
    };
    Base.prototype.showCover = function () {
        if (!this.$cover) {
            this.$cover = this.createCover();
        }
        if (this.options.coverZIndex !== undefined) {
            this.$cover.css('z-index', this.options.coverZIndex);
        }
        if (this.options.coverOpacity !== undefined) {
            var ieValue = this.options.coverOpacity * 100;
            this.$cover.css('opacity', this.options.coverOpacity);
            this.$cover.css('filter', 'alpha(opacity=' + ieValue + ')');
        }
        this.$cover.show();
    };
    Base.prototype.hideCover = function () {
        if (this.$cover) {
            this.$cover.hide();
        }
    };
    Base.prototype.createBox = function (html, type) {
        type = type || '';
        var boxClassName = BOX_CLASS_NAME;
        var contentClassName = 'mlayer-content ';
        if (type) {
            boxClassName += ' mlayer-box-' + type;
            contentClassName += ' mlayer-content-' + type;
        }
        var html = [
            '<div class="' + boxClassName + '" style="display: none;">',
                '<div class="mlayer-box-height-wrapper">',
                    '<div class="mlayer-box-inner">',
                        '<div class="' + contentClassName + '">',
                            (html || ''),
                        '</div>',
                    '</div>',
                '</div>',
            '</div>'
        ].join('');

        var $box = $(html);
        $body.append($box);
        $box[0].mlayerInstance = this;

        if (this.options.zIndex !== undefined) {
            $box.css('z-index', this.options.zIndex);
        }
        this.$wrapper = $box.children('.mlayer-box-height-wrapper');
        this.$innerBox = this.$wrapper.children('.mlayer-box-inner');
        this.$content = this.$innerBox.children('.mlayer-content');

        if (this.options.hookContentShow) {
            this.$content.hide();
        }
        if (this.options.overflow) {
            this.$content.css('overflow', this.options.overflow);
        }
        return $box;
    };
    Base.prototype.showBox = function () {
        if (!this.$box) {
            return;
        }
        if (this.options.withCover) {
            this.showCover();
        }
        this.$box.show();
    };
    Base.prototype.hideBox = function () {
        if (!this.$box) {
            return;
        }
        this.$box.hide();
        if (this.options.withCover) {
            this.hideCover();
        }
    };
    Base.prototype.show = function () {
        if (window.attachEvent) {
            // this.hackIE();
        }
        this.showBox();
        if (this.options.hookContentShow && this.$content) {
            this.options.hookContentShow.call(this, this.$content);
        }
    };
    Base.prototype.hide = function () {
        this.stopHackIE();
        this.hideBox();
        if (this.options.hookContentShow && this.$content) {
            this.$content.hide();
        }
    };

    Base.prototype.close = function () {
        if (this.closeTimer) {
            clearTimeout(this.closeTimer);
        }
        this.trigger('beforeClose');
        this.hide();
        if (this.$box) {
            this.$box.remove();
            this.$box = null;
        }

        if (this.$cover) {
            this.$cover.remove();
            this.$cover = null;
        }
    };
    Base.prototype.renderSize = function () {
        if (this.options.width) {
            var width = getNumberPixel(this.options.width);
            this.$content.css('width', width);
        }
        if (this.options.height) {
            var height = getNumberPixel(this.options.height);
            this.$innerBox.css('height', height);
            this.$content.css('height', '100%');
        }
    };
    Base.prototype.trigger = function (name) {
        if (!name) {
            return false;
        }
        if (typeof name === 'function') {
            var func = name;
        } else if (typeof this.options[name] === 'function') {
            func = this.options[name];
        }

        if (func) {
            var args = Array.prototype.slice.call(arguments, 1);
            return func.apply(this, args);
        }
    };

    /**
     * 基础事件绑定
     */
    Base.prototype.baseBind = function () {
        var self = this;
        this.$content.children('.x-close-btn').click(function () {
            self.close();
        });
        this.$innerBox.delegate('.x-button-box button', 'click', function () {
            var i = this.getAttribute('data-i');
            if (self.options['btn' + i]) {
                self.trigger(self.options['btn' + i].onClick);
            }
        });
    };

    /**
     * 设置wrapper的高度
     */
    Base.prototype.renderWrapperHeight = function () {
        this.$wrapper.css('height', window.innerHeight + 'px');
    };

    /**
     * 关闭按钮HTML
     *
     * @return     {string}
     */
    Base.prototype.getCloseBtnHtml = function () {
        return [
            '<a href="javascript:;" class="x-close-btn">',
                '<img src="' + (window.xPath || '') + 'images/mlayer/close.png" />',
            '</a>'
        ].join('');
    };

    /**
     * 获取底部按钮html
     */
    Base.prototype.getButtonHtml = function () {
        var html = '';
        for (var i = 1; this.options['btn' + i]; i++) {
            var item = this.options['btn' + i];
            var attrs = {};
            attrs['class'] = 'x-btn';
            if (item.type) {
                attrs['class'] += ' button-' + item.type;
            }
            attrs['data-i'] = i;
            html += '<button ' + makeAttr(attrs) + '>' + (item.text || '确定') + '</button>';
        }
        if (!html) {
            return '';
        }
        var className = [
            'x-button-box',
            'clearfix'
        ];
        if (this.options.btnAlign) {
            className.push('align-' + this.options.btnAlign);
        }
        return '<div class="' + className.join(' ') + '">' + html + '</div>';
    };

    /**
     * IE8下, 在content高度变化时, 不会自动居中
     */
    Base.prototype.hackIE = function () {
        if (this.$box) {
            this.$box.find('.mlayer-content');
        }
        var self = this;
        this.hackIETimer = setTimeout(function () {
            self.hackIE();
        }, 500);
    };
    Base.prototype.stopHackIE = function () {
        if (this.hackIETimer) {
            clearTimeout(this.hackIETimer);
            this.hackIETimer = null;
        }
    };

    /**
     * 浮层-构造函数
     *
     * @constructor
     * @class      Mlayer
     */
    function Mlayer(options) {
        this.options = $.extend(true, {}, Mlayer.config, options);
        if (this.options.html) {
            this.$box = this.createBox(this.getHtml(), this.options.type || 'html');
            this.renderSize();
        } else if (this.options.type === 'loading') {
            this.$box = this.createBox('', 'loading');
        }
        this.baseBind();
        this.show();
    }
    classInherit(Mlayer, Base);
    Mlayer.config = {
        closeBtn: true,
        withCover: true
    };
    Mlayer.prototype.getHtml = function () {
        return [
            this.options.closeBtn ? this.getCloseBtnHtml() : '',
            this.options.html || '',
            this.getButtonHtml()
        ].join('');
    };

    /**
     * 消息提示框
     *
     */
    function Message(options) {
        this.options = options || {};
        this.$box = this.createBox(this.getHtml(), this.options.type || 'message');
        this.show();
        var self = this;
        var time = this.options.time || 3000;
        if (time < 60) {
            time *= 1000;
        }
        this.closeTimer = setTimeout(function () {
            self.close();
        }, time);
    }
    classInherit(Message, Base);
    Message.prototype.getHtml = function () {
        var text = this.options.text || '';
        var iconHtml = '';
        if (this.options.type === 'iconmsg') {
            var iconClass = 'x-icon-' + (this.options.icon || '1');
            iconHtml = '<i class="' + iconClass + '"></i>';
        }
        return [
            iconHtml,
            '<p>' + text + '</p>'
        ].join('');
    };

    /**
     * 接口
     */
    if (window.parent && window.parent[globalName]) {
        window[globalName] = window.parent[globalName];
        return window.parent[globalName];
    }

    var exports = {};

    /**
     * 自定义Html浮层
     *
     * @param      {string}  html     The html
     * @param      {object}  options  The options
     * @return     {Mlayer}
     */
    exports.html = function (html, options) {
        options = options || {};
        options.html = html;
        return new Mlayer(options);
    };

    /**
     * 消息提示
     *
     * @param      {string}   text     The text
     * @param      {object}   options  The options
     * @return     {Message}
     */
    exports.msg = function (text, options) {
        exports.close('iconmsg');
        exports.close('message');
        options = options || {};
        options.text = text;
        return new Message(options);
    };

    /**
     * 带icon的msg
     *
     * @param      {string}  text     The text
     * @param      {object}  options  The options
     */
    exports.iconMsg = function (text, options) {
        exports.close('iconmsg');
        exports.close('message');
        options = options || {};
        options.type = 'iconmsg';
        options.text = text;
        return new Message(options);
    };

    exports.alert = function (text, options) {
        if (typeof options === 'function') {
            var callback = options;
            options = {};
        } else {
            options = options || {};
        }
        options.type = 'alert';
        options.html = [
            '<div class="x-alert-box">',
                (text || ''),
            '</div>'
        ].join('');
        options.btnAlign = 'center';
        options.btn1 = options.btn1 || {
            text: '确定',
            onClick: function () {
                var foo = callback || options.onCallback;
                if (foo) {
                    foo.call(this);
                }
                this.close();
            }
        };

        return new Mlayer(options);
    };

    /**
     * 确认框
     *
     * @param      {string}  text     The text
     * @param      {object}  options  The options
     */
    exports.confirm = function (text, options) {
        if (typeof options === 'function') {
            var func1 = options;
            options = {};
        } else {
            options = options || {};
        }
        options.type = 'confirm';
        options.html = [
            '<div class="x-confirm-box">',
                (text || ''),
            '</div>'
        ].join('');
        options.btnAlign = 'right';
        options.btn1 = options.btn1 || {
            text: '确定',
            onClick: function () {
                var foo = func1 || options.onConfirm;
                if (foo) {
                    foo.call(this);
                }
                this.close();
            }
        };
        options.btn2 = options.btn2 || {
            text: '取消',
            type: 'cancel',
            onClick: function () {
                this.close();
            }
        };
        return new Mlayer(options);
    };

    /**
     * 显示loading
     *
     * @param      {object}  options  The options
     */
    exports.loading = function (options) {
        exports.close('loading');
        options = options || {};
        options.type = 'loading';
        options.closeBtn = false;
        options.zIndex = Z_INDEX + 10;
        options.coverZIndex = options.zIndex - 5;
        options.coverOpacity = 0;
        return new Mlayer(options);
    };

    /**
     * 关闭
     *
     * @param      {string}  type    The type
     */
    exports.close = function (type) {
        if (type) {
            var $layers = $('.mlayer-box-' + type);
        } else {
            $layers = $('.' + BOX_CLASS_NAME);
        }

        if ($layers.length) {
            $layers.each(function () {
                var instance = this.mlayerInstance;
                if (instance) {
                    instance.close();
                }
            });
        }
        return $layers;
    };

    window[globalName] = exports;
    return exports;
});