let $ = require('jquery');
const calPosition = ($elem, x, y) => {
    let elemWidth = $elem.width();
    let elemHeight = $elem.height();
    let left = (x - elemWidth) - 15;
    let top = y - Math.floor(elemHeight / 2);

    let ret = {};
    ret.left = left + 'px';
    ret.top = top + 'px';

    return ret;
};
let queue = [];
let inited = false;
function documentHandler (e) {
    for (let i = queue.length - 1; i >= 0; i--) {
        let $elem = queue[i];
        if ($elem[0] === e.target) {
            continue;
        }
        if ($.contains($elem[0], e.target)) {
            continue;
        }

        $elem.remove();
        queue.splice(i, 1);
    }
}
const init = function () {
    if (inited) {
        return;
    }

    inited = true;
    document.addEventListener('click', documentHandler);
};

let exports = function (html, options = {}) {
    init();
    let popHtml = `
        <div class="popover left">
            <div class="arrow"></div>
            <h3 class="popover-title">图表注解</h3>
            <div class="popover-content">
                ${html}
            </div>
        </div>
    `.trim();
    let $div = $(popHtml);
    $div.css({
        position: 'absolute',
        zIndex: 19900420 + 6666,
        visiblity: 'hidden'
    });
    $(document.body).append($div);
    let event = options.event;
    if (event) {
        let position = calPosition($div, event.clientX, event.clientY);
        $div.css({
            left: position.left,
            top: position.top
        });
    }

    $div.css('visiblity', 'visible');
    setTimeout(() => {
        queue.push($div);
    }, 50);
    return $div;
};

module.exports = exports;