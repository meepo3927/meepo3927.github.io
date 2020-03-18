/**
 * Created by TDInstaller on 2017/2/17.
 */
define(['jquery'], function ($) {
    var $html = $(document.documentElement);
    var $body = $(document.body);
    function Menu(options) {
        this.$box = $('<div class="context-menu" style="display: none;"></div>');
        this.options = options || {};
        $body.append(this.$box);
        this.bind();
    }
    function getScrollTop() {
        return $html.scrollTop() || $body.scrollTop();
    }
    function getScrollLeft() {
        return $html.scrollLeft() || $body.scrollLeft();
    }
    var MenuProto = Menu.prototype;
    MenuProto.bind = function () {
        // 自动隐藏
        $html.bind("mousedown", (e) => {
            if (e.target === this.$box[0]) {
                return;
            }
            if ($.contains(this.$box[0], e.target)) {
                return;
            }
            this.hide();
        });
    };
    MenuProto.show = function (options = {}) {
        var x = getScrollLeft()
        var y = getScrollTop();
        options = $.extend(true, {}, this.options, options);
        this.$box.append(this.getList(options.items));
        if (options.event) {
            x += options.event.clientX;
            y += options.event.clientY;
        }
        this.$box.css({
            left: x + 'px',
            top: y + 'px'
        });
        this.$box.show();
    };
    MenuProto.hide = function () {
        this.$box.hide().empty();
    };
    MenuProto.getList = function (items) {
        items = items || [];
        var self = this;
        var $ul = $('<ul></ul>');
        items.forEach((item) => {
            if (!item) {
                return;
            }
            var text;
            if (typeof item === 'string') {
                text = item;
            } else if (typeof item === 'object') {
                text = item.text;
            }
            var $li = $(`<li>${text}</li>`);
            $li.on('click', (e) => {
                var fn = item.onClick || self.options.onClick;
                if (fn && fn.call(this, e, $li) === true) {
                    self.hide();
                }
            });
            $ul.append($li);
        });
        return $ul;
    };
    return Menu;
});