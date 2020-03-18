
const LOG = function () {
    if (window.console && window.console.log) {
        var len = arguments.length;
        for (var i = 0; i < len; i++) {
            window.console.log(arguments[i]);
        }
    }
};

let env = '';

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
    window.LOG = LOG;
};
exports.env = env;
exports.LOG = LOG;
exports.processEnv = processEnv;