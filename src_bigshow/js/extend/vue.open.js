
const wParam = [
    'toolbar=no',
    'menubar=no',
    'status=no',
    'location=yes',
    'scrollbars=yes',
    'resizable=yes',
    'width=1366px',
    'height=768px'
].join(',');

module.exports = {
    // Vue.directive('open', vueOpen);
    bind (el, binding, vnode) {
        if (binding.value) {
            el.__VueOpenUrl = binding.value;
        }
        el.__VueOpenClickFunc = () => {
            if (el.__VueOpenUrl) {
                window.open(el.__VueOpenUrl, '', wParam);
            }
        };
        el.addEventListener('click', el.__VueOpenClickFunc);
    },
    update (el, binding) {
        el.__VueOpenUrl = binding.value;
    },
    unbind (el, binding) {
        el.removeEventListener('click', el.__VueOpenClickFunc);
        delete el.__VueOpenClickFunc;
        delete el.__VueOpenUrl;
    }
};