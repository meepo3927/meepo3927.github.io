
let instances = [];
let inArray = (vm) => {
    for (let i = 0; i < instances.length; i++) {
        if (instances[i] === vm) {
            return true;
        }
    }

    return false;
};
let remove = (vm) => {
    for (let i = instances.length - 1; i >= 0; i--) {
        if (instances[i] === vm) {
            instances.splice(i, 1);
        }
    }
};
let loopStarted = false;


const interval = 60 * 1000;

const start = () => {
    if (loopStarted) {
        return;
    }
    loopStarted = true;
    setTimeout(loop, interval);
};
const loop = () => {
    for (let i = 0; i < instances.length; i++) {
        let vm = instances[i];
        if (vm.fetchRender) {
            vm.fetchRender();
        }
    }
    setTimeout(loop, interval);
};

const created = function () {
    this.myCharts = [];
};
const mounted = function () {
    if (!inArray(this)) {
        instances.push(this);
    }
    // 关闭
    // start();
};
const activated = function () {
    if (!inArray(this)) {
        instances.push(this);
    }
};
const deactivated = function () {
    remove(this);
};
const beforeDestroy = function () {
    remove(this);
};
let methods = {};
methods.disposeCharts = function () {
    this.myCharts.forEach((v) => {
        v && v.dispose();
    });
    this.myCharts = [];
};
let computed = {};
module.exports = {
    methods,
    computed,
    created,
    mounted,
    activated,
    deactivated,
    beforeDestroy
};