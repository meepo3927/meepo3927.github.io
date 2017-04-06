
exports.getImageCanvas = function (img, w, h) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    w = w || img.width || 100;
    h = h || img.height || 100;
    canvas.width = w;
    canvas.height = h;
    context.drawImage(img, 0, 0, w, h);

    return canvas;
};