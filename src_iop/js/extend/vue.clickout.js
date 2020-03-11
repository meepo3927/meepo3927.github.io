const FocusOut = require('lib/focusoutside.js');
module.exports = {
    // Vue.directive('clickout', vueClickOut);
    bind (el, binding, vnode) {
        FocusOut.bind(el, binding.value);
    },
    unbind (el, binding) {
        FocusOut.unbind(el, binding.value);
    }
};