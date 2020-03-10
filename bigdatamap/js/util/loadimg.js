let UUID = 1;
const getUid = () => {
    return '__loadimg__' + (UUID++);
};
const exports = (arr, callback = function () {}, error = function () {}) => {
    if (!arr || arr.length === 0) {
        return;
    }
    let count = 0;
    arr.forEach((src) => {
        let img = new Image();
        window[getUid()] = img;
        img.src = src;
        img.onload = () => {
            count++;

            if (count >= arr.length) {
                callback();
            }
        };
        img.onerror = () => {
            error(src);
        };
    });
};

module.exports = exports;