module.exports = {
    // Vue.directive('touchoutside', TouchOutSide);
    bind (el, binding, vnode) {
        function documentHandler (e) {
            if (el.contains(e.target)) {
                return false;
            }
            if (binding.expression) {
                binding.value(e);
            }
        }
        el.__vueTouchOutside__ = documentHandler;
        document.addEventListener('touchstart', documentHandler);
    },
    update () {

    },
    unbind (el, binding) {
        document.removeEventListener('touchstart', el.__vueTouchOutside__);
        delete el.__vueTouchOutside__;
    }
};