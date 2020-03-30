const Tooltip = require('./mui-tooltip.js');
// Vue.directive('tooltip', MUITooltip);
const buildOptions = (targetElem, binding) => {
    let text;
    let o = binding.value;
    if (o !== undefined && o !== null) {
        if (typeof o !== 'object') {
            text = o + '';
        } else {
            text = o.text;
        }
    } else if (binding.expression) {
        text = binding.expression;
    }
    return {
        target: targetElem,
        text
    };
};
module.exports = {
    bind (el, binding, vnode) {
        let options = buildOptions(el, binding);
        if (options.text === '') {
            return;
        }
        el.__MUITooltip = new Tooltip(options);
    },
    update (el, binding) {
        if (el.__MUITooltip) {
            let options = buildOptions(el, binding);
            el.__MUITooltip.update(options);
        }
    },
    unbind (el, binding) {
        if (el.__MUITooltip) {
            el.__MUITooltip.destroy();
            el.__MUITooltip = undefined;
            delete el.__MUITooltip;
        }
    }
};