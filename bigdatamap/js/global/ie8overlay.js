;(function (window, document, undefined) {

    var docMode = document.documentMode;
    if (!docMode || docMode > 8) {
        return 'Not IE8';
    }
    var overlayWidth = 840;
    var overlayHeight = 250;
    var warnColor = 'red';
    var styleText = `
        .ie8-overlay,
        .ie8-overlay *,
        .ie8-overlay-cover,
        .ie8-overlay-cover * {
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
        }
        .ie8-overlay {
            width: ${overlayWidth}px;
            height: ${overlayHeight}px;
            background-color: #fff;
            z-index: 9999999;
            border: 5px solid #ccc;
        }
        .ie8-overlay.ie-8,
        .ie8-overlay.ie-7 {
            position: fixed;
            left: 50%;
            top: 50%;
            margin-left: ${-(overlayWidth / 2)}px;
            margin-top: ${-(overlayHeight / 2)}px;
        }
        .ie8-overlay.ie-6 {
            position: absolute;
            left: 50%;
            margin-left: ${-(overlayWidth / 2)}px;
            top: 240px;
        }
        .ie8-overlay .x-content {
            padding: 25px 25px 1px;
            word-wrap: break-word;
            word-break: break-all;
            font-size: 15px;
            line-height: 1;
            margin-bottom: 1px;
            color: #333;
        }
        .ie8-overlay .x-content em {
            font-style: normal;
            color: #FC2523;
            font-size: 48px;
            display: block;
            margin-bottom: 4px;
        }
        .ie8-overlay .x-content p {
            font-size: 32px;
            margin-top: 20px;
            line-height: 54px;
        }
        .ie8-overlay .x-content span {
            color: #FC2523;
        }
        .ie8-overlay .x-content a {
            color: blue;
        }
        .ie8-overlay .x-content a:hover {
            color: red;
        }

        .ie8-overlay-cover {
            z-index: 9999995;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            opacity: .4;
            filter: alpha(opacity=40);
            background-color: #000;
            width: 100%;
            height: 100%;
            margin-left: 0;
        }
        .ie8-overlay-cover.ie-8,
        .ie8-overlay-cover.ie-7 {
            position: fixed;
        }
        .ie8-overlay-cover.ie-6 {
            position: absolute;
        }
    `;
    var head = document.getElementsByTagName('head')[0];
    function IE8Overlay() {
        this.elem = document.createElement('div');
        this.elem.className = 'ie8-overlay ' + this.getClassNameSubfix();
        
    }
    var proto = IE8Overlay.prototype;
    proto.init = function () {
        document.body.appendChild(this.elem);
        this.elem.style.display = 'none';
        this.insertStyle();
        this.elem.innerHTML = this.getHtml();
        this.show();
    };
    proto.getClassNameSubfix = function () {
        if (docMode >= 8) {
            return 'ie-8';
        } else if (docMode === 7) {
            return 'ie-7';
        } else {
            return 'ie-6';
        }
    };
    proto.showCover = function () {
        if (!this.cover) {
            this.cover = document.createElement('div');
            this.cover.className = 'ie8-overlay-cover ' + this.getClassNameSubfix();
            document.body.appendChild(this.cover);
        }
        this.cover.style.display = 'block';
    };
    proto.insertStyle = function () {
        var elem = document.createElement('style');
        elem.type = 'text/css';
        if (elem.styleSheet) {
            elem.styleSheet.cssText = styleText;
        } else {
            elem.innerHTML = styleText;
        }
        head.appendChild(elem);
    };
    proto.getHtml = function () {
        var url = 'http://10.220.19.39:8080/fin/plugins.zip';
        return `
            <div class="x-wrapper">
                <div class="x-content">
                    <em>尊敬的用户：</em>
                    <p>
                        您正在使用Internet Explorer ${docMode}，请<span>升级到最新版本</span>，
                        或下载 <a href="${url}" target="_blank">IE增强插件</a>
                    </p>
                </div>
            </div>
        `;
    };
    proto.show = function () {
        this.showCover();
        this.elem.style.display = 'block';
    };

    var o = new IE8Overlay();
    var init = function () {
        if (document.readyState === 'complete') {
            clearInterval(timer);
            o.init();
        }
    };
    var timer = setInterval(init, 100);

})(window, document);