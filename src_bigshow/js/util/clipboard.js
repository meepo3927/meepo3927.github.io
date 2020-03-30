function Clipboard(text) {
    if (!(this instanceof Clipboard)) {
        return new Clipboard(text).copy();
    }
    const elem = this.makeTextElem();
    elem.value = text;
    this.selectAll(elem);
    this.dispose = () => {
        document.body.removeChild(elem);
    };
}
const proto = Clipboard.prototype;
proto.copy = function () {
    setTimeout(this.dispose, 800);
    try {
        return document.execCommand('copy');
    } catch (err) {
        return false;
    }
};
proto.makeTextElem = function () {
    const elem = document.createElement('textarea');
    elem.style.position = 'absolute';
    elem.style.opacity = 0;
    elem.style.top = '-99999px';
    elem.style.left = '-99999px';
    elem.style.width = '600px';
    elem.style.height = '240px';
    document.body.appendChild(elem);
    return elem;
};
proto.selectAll = function (elem) {
    elem.select();
    elem.setSelectionRange(0, elem.value.length + 1);
};
module.exports = Clipboard;