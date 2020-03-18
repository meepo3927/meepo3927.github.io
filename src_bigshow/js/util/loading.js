
var loading = function (el, options) {
    if (!(this instanceof loading)) {
        return new loading(el, options);
    }
    this.el = el;
    this.render();
};
var proto = loading.prototype;
proto.render = function () {
    this.el.innerHTML = `
        <div class="loading-1 size-100p"></div>
    `.trim();
};
proto.clean = function () {
    this.el.innerHTML = '';
};

module.exports = loading;