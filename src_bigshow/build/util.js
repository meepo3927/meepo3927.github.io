const fs = require('fs');
const path = require('path');

function getEntry(dirPath) {
    var files = fs.readdirSync(dirPath);
    var entries = {};
    for (var i = 0; i < files.length; i++) {
        let fileName = files[i];
        let extname = path.extname(fileName);
        let basename = path.basename(fileName, extname);
        // Full Path
        entries[basename] = dirPath + fileName;
    }
    return entries;
}

module.exports = {
    getEntry
};