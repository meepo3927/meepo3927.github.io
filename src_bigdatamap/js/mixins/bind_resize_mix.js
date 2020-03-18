// 依赖vue.eventhandler.js

const created = function () {
    if (this._bind_resized) {
        return;
    }
    window.addEventListener('resize', this);
    this._bind_resized = true;
};

const beforeDestroy = function () {
    window.removeEventListener('resize', this);
    this._bind_resized = false;
};

module.exports = {
    created,
    beforeDestroy
};