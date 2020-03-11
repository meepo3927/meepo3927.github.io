
var prefixerConfig = {
    browsers: ["last 100 versions", "> 1%"],
    cascade: false
};

module.exports = {
    plugins: {
        'autoprefixer': prefixerConfig
    }
};