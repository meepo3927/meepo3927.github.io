var fs = require('fs');
var path = require('path');
// webapp 路径
var webappPath = [
    path.resolve(__dirname, '../..'),
    'webapp'
].join(path.sep);
// version 文件路径
var filePath = [
    webappPath, 'views', 'include', 'taglib.jsp'
].join(path.sep);
function padZero(n) {
    return (n < 10) ? ('0' + n) : n;
}
function getVersion() {
    var d = new Date();
    var month = padZero(d.getMonth() + 1);
    var day = padZero(d.getDate());
    var hours = padZero(d.getHours());
    var minites = padZero(d.getMinutes());
    var seconds = padZero(d.getSeconds());
    var milli = d.getMilliseconds();
    var rand = Math.round(Math.random() * 9999);
    return [
        month, day, '_',
        hours, minites, seconds, milli,
        rand
    ].join('');
}

function replaceVersion(content) {
    var pattern = /(\"staticVersion\"\s+value=\")\w+(\")/g;

    var newContent = content.replace(pattern, (match, v1, v2) => {
        var version = getVersion();
        return v1 + version + v2;
    });
    return newContent;
}

function modifyVersion() {
    try {
        var content = fs.readFileSync(filePath, 'utf8');
    } catch(e) {
        console.log('readfile error:');
        console.log(e.message)
        return false;
    }

    if (!content) {
        return console.log('File Content Empty.');
    }

    var newContent = replaceVersion(content);
    fs.writeFileSync(filePath, newContent);
    console.log('Rewrite staticVersion done.');
}

modifyVersion(filePath);