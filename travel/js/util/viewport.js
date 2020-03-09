(function (doc, win) {
    if (!doc.addEventListener) {
        return;
    }
    var docEl = doc.documentElement;
    function recalc(e) {
        var width = docEl.clientWidth || 640;
        var fontSize = 50 * (width / 320);
        docEl.style.fontSize = fontSize + 'px';
        window.rootFontSize = fontSize;
    }
    try {
        recalc();
    } catch(e) {}
    win.addEventListener('orientationchange', recalc, false);
    win.addEventListener('resize', recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);