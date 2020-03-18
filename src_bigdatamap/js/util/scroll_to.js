
let $ = require('jquery');
module.exports = (elem, options = {}) => {
    let $html = $(document.documentElement);
    let $body = $(document.body);
    let y = (options.y === undefined) ? 10 : options.y;
    if (elem && elem.jquery) {
        var $elem = elem;
    } else {
        $elem = $(elem);
    }

    if (!$elem.length) {
        return;
    }

    let top = $elem.offset().top - y;
    $html.animate({
        scrollTop: top
    });
    $body.animate({
        scrollTop: top
    });
};