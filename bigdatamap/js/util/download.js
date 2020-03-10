
let $ = require('jquery');

let gid = 11111;
let genUniqueId = () => {
    let id = (gid++);
    id += '';
    id += (new Date()).getTime();
    id += parseInt(Math.random() * 9999999, 10);
    return id;
};

let exports = {};
exports.makeIframe = (fid) => {
    fid = fid || ('f' + genUniqueId());
    try {
        var iframe = document.createElement(`<iframe id="${fid}" name="${fid}"></iframe>`);
    } catch(e) {
        iframe = document.createElement('iframe');
        iframe.id = fid;
        iframe.name = fid;
    }
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    return {
        iframe,
        id: fid
    };
};

module.exports = exports;