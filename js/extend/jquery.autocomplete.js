/**
 * autoComplete
 * 用法：$('.xxx').autoComplete('init', {
 *     getData: function (val, callback) {},
 *     onClick: function (val) {}
 * });
 */

define(['jquery'], function ($) {

    /**
     * Form表单对象
     *
     * @param      {HtmlElement}  elem    The element
     * @param      {jQuery}       $elem   The element
     */
    function autoComplete(elem, $elem) {
        this.elem = elem;
        this.$elem = $elem;
    }
    var proto = autoComplete.prototype;
    proto.init = function (options) {
        options = options || {};
        this.options = options;
        this.getData = options.getData || $.noop;
        this.onClick = options.onClick || $.noop;
        this.bind();
    };
    proto.bind = function () {
        // 防止重复绑定
        this.unbind();
        this.elem.addEventListener('input', this);
        this.elem.addEventListener('blur', this);
        this.elem.addEventListener('focus', this);
        window.addEventListener('resize', this);
    };
    proto.unbind = function () {
        this.elem.removeEventListener('input', this);
        this.elem.removeEventListener('blur', this);
        this.elem.addEventListener('focus', this);
        window.removeEventListener('resize', this);
    };
    proto.destroy = function () {
        this.unbind();
        this.$box.remove();
        this.$box = null;
    };
    proto.handleEvent = function (e) {
        var type = e.type;
        if (type === 'input') {
            return this.handleInput(e);
        } else if (type === 'blur') {
            return this.handleBlur(e);
        } else if (type === 'focus') {
            return this.handleFocus(e);
        } else if (type === 'resize') {
            return this.handleResize(e);
        }
    };
    proto.handleInput = function (e) {
        if (this.inputTimer) {
            clearTimeout(this.inputTimer);
        }
        var self = this;
        var target = e.currentTarget;
        this.inputTimer = setTimeout(function () {
            self.inputTimer = null;
            self.fetch(target.value);
        }, 300);
    };
    proto.handleBlur = function (e) {
        this.focused = false;
        if (this.blurTimer) {
            clearTimeout(this.blurTimer);
        }
        var self = this;
        this.blurTimer = setTimeout(function () {
            self.hideBox();
        }, 200);
    };
    proto.handleFocus = function (e) {
        this.focused = true;
        var self = this;
        if (this.options.showOnFocus) {
            if (this.inputTimer) {
                clearTimeout(this.inputTimer);
            }
            if (this.blurTimer) {
                clearTimeout(this.blurTimer);
            }
            this.inputTimer = null;
            setTimeout(function () {
                self.fetch(self.elem.value);
            }, 50);
        }
    };
    proto.handleResize = function (e) {
        if (!this.$box) {
            return;
        }
        if (this.$box.css('display') === 'none') {
            return;
        }
        this.position();
    };
    proto.onItemClick = function (e) {
        var target = e.currentTarget;
        var index = target.getAttribute('data-index');
        var value = (this.list ? this.list[index] : null) || target.getAttribute('title');
        this.onClick.call(this, value, e);
        this.hideBox();
    };

    proto.fetch = function (val) {
        if (!val) {
            this.hideBox();
            return false;
        }
        this.getData(val, this.getDataCallback.bind(this));
    };
    proto.getDataCallback = function (list) {
        if (this.inputTimer || !this.focused) {
            return;
        }
        // console.log('getDataCallback:');
        // console.log(list);
        this.showBox(list);
    };
    proto.makeBox = function (list) {
        if (!this.$box) {
            this.$box = $('<ul class="auto-complete-box theme-1" style="display: none;"></ul>');
            $(document.body).append(this.$box);
            this.$box.on('click', 'li', this.onItemClick.bind(this));
        }
        // 最大高度
        if (this.options.maxHeight) {
            var maxHeight = this.options.maxHeight;
            this.$box.css('maxHeight', isNaN(maxHeight) ? maxHeight : (maxHeight + 'px'));
        }
        list = list || [];
        this.list = list;
        var html = '';
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var text = item;
            var value = item;
            if (typeof item === 'object') {
                if (item.text) {
                    text = item.text;
                }
                if (item.value) {
                    value = item.value;
                }
            }

            if (!text) {
                return;
            }
            if (value === undefined) {
                value = text;
            }
            value = value.replace(/"/g, '');
            html += [
                '<li data-index="' + i + '" title="' + value + '">' + text + '</li>'
            ].join('');
        }
        this.$box.html(html);
        return this.$box;
    };
    proto.position = function () {
        // top, left, width
        var inputOffset = this.$elem.offset();
        var inputHeight = this.$elem.outerHeight();
        var inputWidth = this.$elem.outerWidth();

        var top = inputOffset.top + inputHeight;
        var left = inputOffset.left;
        var width = inputWidth;
        this.$box.css({
            position: 'absolute',
            top: top,
            left: left,
            minWidth: width
        });
    };
    proto.showBox = function (list) {
        var $box = this.makeBox(list);
        this.position();
        $box.show();
        this.positionTimer = setInterval(this.position.bind(this), 500)
    };
    proto.hideBox = function () {
        if (this.$box) {
            this.$box.hide();
        }
        if (this.positionTimer) {
            clearInterval(this.positionTimer);
            this.positionTimer = null;
        }
        this.list = null;
    };
    /**
     * Exports
     *
     */
    $.fn.autoComplete = function (method) {
        var args = Array.prototype.slice.call(arguments, 1);
        var result;
        this.each(function () {
            if (!this.mAutoComplete) {
                this.mAutoComplete = new autoComplete(this, $(this));
            }
            // Init
            if ($.isPlainObject(method)) {
                args = [method];
                method = 'init';
            }
            var instance = this.mAutoComplete;
            if (instance[method]) {
                var ret = instance[method].apply(instance, args);
                // 只返回第一个返回值
                if (result === undefined) {
                    result = ret;
                }
            }
        });
        return result;
    };
});
