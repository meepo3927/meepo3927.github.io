const methods = {};
const computed = {};
computed.muiAlertIconMap = function () {
    return {
        success: 'fa-check-circle',
        warning: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        error: 'fa-times-circle'
    };
};
module.exports = {
    methods,
    computed
};