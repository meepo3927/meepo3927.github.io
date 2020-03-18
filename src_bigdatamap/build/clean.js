var config = require('./config');
let fs = require('fs');

var deleteFolder = function (path) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                // recurse
                deleteFolder(curPath);
            } else {
                // delete file
                fs.unlinkSync(curPath);
            }

        });
        fs.rmdirSync(path);
    }
};

deleteFolder(config.DIST_PATH);