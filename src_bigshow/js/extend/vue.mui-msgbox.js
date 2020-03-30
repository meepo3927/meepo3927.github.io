
import Main from 'comp/mui/msgbox.vue';
const MsgConstructor = Vue.extend(Main);

let MsgBox = function (options) {
    // options = convertOptions(options);
    let instance = new MsgConstructor({
        data: options
    });

    instance.vm = instance.$mount();
    document.body.appendChild(instance.vm.$el);
    return instance.vm;
};
MsgBox.alert = function (text, callback) {
    let options = {};
    if (typeof text === 'object' && text) {
        options = text;
    } else {
        options.type = 'alert';
        options.text = text;
        options.callback = callback;
    }
    return MsgBox(options);
};

MsgBox.confirm = function (text, title, callback) {
    let options = {};
    if (typeof text === 'object' && text) {
        options = text;
        options.type = 'confirm';
    } else {
        options.type = 'confirm';
        options.text = text;
        options.title = title || '';
        options.callback = callback;
    }
    return MsgBox(options);
};

MsgBox.prompt = function (text, title, callback) {
    let options = {};
    if (typeof text === 'object' && text) {
        options = text;
        options.type = 'prompt';
    } else {
        options.type = 'prompt';
        options.text = text;
        options.title = title || '';
        options.callback = callback;
    }
    return MsgBox(options);
};

export default MsgBox;