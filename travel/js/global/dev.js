
const LOG = function () {
    if (window.console && window.console.log) {
        var len = arguments.length;
        for (var i = 0; i < len; i++) {
            window.console.log(arguments[i]);
        }
    }
};

let env = '';
let local = (location.host === 'localhost:8899')
        || (location.hostname === '172.20.10.3');
try {
    env = process.env.NODE_ENV;
} catch(e) {
    LOG('get env error.', e);
}

const tripNodes = () => {
    let list = document.querySelectorAll('[only-prod]');
    for (let i = 0; i < list.length; i++) {
        let node = list[i];
        (node.parentNode || node.parentElement).removeChild(node);
    }
};

const processEnv = function () {
    if (env === 'development') {
        tripNodes();
    }
    if (local) {
        __webpack_public_path__ = '/dist/';
    }
    // Hack IE
    let IE = window.getIEVersion();
    // Hack Echarts
    if (IE === 10 || IE === 11) {
        window.Float32Array = undefined;
    }
    window.LOG = LOG;
};
exports.env = env;
exports.LOG = LOG;
exports.processEnv = processEnv;