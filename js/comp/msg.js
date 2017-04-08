var canvas = require('comp/canvas.js');
var config = require('global/config.js');
var Width = canvas.w;
var Height = canvas.h;
var HEAD_HEIGHT = config.HEAD_HEIGHT;

function Msg(options = {}) {
    var elem = document.createElement('div');
    elem.className = 'comp-msg';
    elem.innerHTML = options.text;
    elem.style.display = 'none';
    document.body.appendChild(elem);
    var $elem = $(elem);

    if (options.color) {
        $elem.css('color', options.color);
    }

    this.animDiraction = 'up';
    (options.position || '').split(' ').forEach((val) => {
        $elem.addClass(val);
        let offset = msgCount * 24;
        if (val === 'left') {
            $elem.css('marginLeft', -(Width / 2) + 'px');
        } else if (val === 'right') {
            $elem.css('marginRight', -(Width / 2) + 'px');
        } else if (val === 'bottom') {
            let top = (Height * .75 + offset);
            $elem.css('top', top + 'px');
            this.animDiraction = 'up';
        } else if (val === 'top') {
            let top = HEAD_HEIGHT - offset;
            $elem.css('top', top + 'px');
            this.animDiraction = 'down';
        }
    });
    this.$elem = $elem;
    msgCount++;
}
var proto = Msg.prototype;
proto.show = function () {
    var animTop = (this.animDiraction === 'down') ? '+=' : '-=';
    animTop += '50px';
    this.$elem.show();
    this.$elem.animate({
        top: animTop,
        opacity: 0.1
    }, 1200, () => {
        msgCount--;
        this.$elem.remove();
    });
};
let msgCount = 0;
exports.pop = (msg, options = {}) => {
    if (!msg) {
        return;
    }
    options.text = msg;
    var msg = new Msg(options);
    msg.show();
    return msg;
};