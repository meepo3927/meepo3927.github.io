import 'lib/xss.min.js';

const XSS_OPTIONS = {
    onTagAttr: (tag, name, value, white) => {},
    onIgnoreTagAttr: (tag, name, value, white) => {
        // LOG(tag + ' -- ' + name + ' -- ' + value + ' -- ' + white);
        // 允许style属性
        if (name === 'style') {
            return name + '="' + filterXSS.escapeAttrValue(value) + '"';
        }
    }
};
const filter = (str) => {
    if (window.filterXSS) {
        const x = new filterXSS.FilterXSS(XSS_OPTIONS);
        return x.process(str);
    } else {
        throw Error('window.filterXSS not fount');
    }
};

export default filter;