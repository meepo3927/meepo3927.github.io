(function (window, document, undefined) {
	var getIEVersion = function () {
		var versions = {
			objectobject: 7, //IE7-8
			objectundefined: 6, //IE6
			undefinedfunction: 0, // other modern browsers
			undefinedobject: 0
		};
		return document.documentMode || versions[typeof document.all + typeof XMLHttpRequest];
	};
	var IE = getIEVersion();
	var loadJS = function (url, callback) {
		var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
		var script = document.createElement("script");
		script.async = "async";
		script.src = url;
		script.onerror = function () {
			script.onload = script.onreadystatechange = script.onerror = null;
		};
		script.onload = script.onreadystatechange = function(event) {
			event = event || window.event;
			if (event.type === "load" || (/loaded|complete/.test(script.readyState) && (!IE || IE < 9))) {
				// Handle memory leak in IE
				script.onload = script.onreadystatechange = script.onerror = null;
				if (head && script.parentNode) {
					head.removeChild(script);
				}
				// Dereference the script
				script = undefined;
				if (callback) {
					setTimeout(callback, 1);
					callback = null;
				}
			}
		};
		head.appendChild(script);
	};
	function getCurrentScriptUrl() {
		if (document.currentScript) { //firefox 4+
			return document.currentScript.src;
		}
		// 参考 https://github.com/samyk/jiagra/blob/master/jiagra.js
		var stack;
		try {
			Meepo.meepo(); //强制报错
		} catch(e) { //safari的错误对象只有line,sourceId,sourceURL
			stack = e.stack;
			if (!stack && window.opera) {
				//opera 9没有e.stack,但有e.Backtrace,但不能直接取得,需要对e对象转字符串进行抽取
				stack = (String(e).match(/of linked script \S+/g) || []).join(" ");
			}
		}
		if (stack) {
			stack = stack.split(/[@ ]/g).pop(); //取得最后一行,最后一个空格或@之后的部分
			stack = stack.replace(/^\s+|\s+$/g, '');
			stack = stack[0] === '(' ? stack.slice(1,-1) : stack;
			return stack.replace(/(:\d+)?:\d+$/i, ''); //去掉行号与或许存在的出错字符起始位置
		}
		var nodes = document.getElementsByTagName('script'); //只在head标签中寻找
		var node;
		for (var i = 0; i < nodes.length; i++) {
			node = nodes[i];
			if (node.readyState === 'interactive') {
				return node.src;
			}
		}
		return node && node.src;
	}
	function getEntry() {
		var scripts = document.getElementsByTagName('script');
		for (var i = scripts.length - 1; i >= 0; i--) {
			var entry = scripts[i].getAttribute('entry');
			if (entry) {
				return entry;
			}
		}
		var url = location.href.split('?')[0];
		var pos = url.lastIndexOf('/');
		if (pos < 0) {
			return 'index';
		}
		var fileName = url.substr(pos + 1);
		fileName = fileName.split('#')[0];
		if (!fileName) {
			return 'index';
		}
		pos = fileName.lastIndexOf('.');
		if (pos < 0) {
			return fileName;
		}
		return fileName.substr(0, pos);
	}
	function tripPath(url, deep) {
		if (!url) {
			return url;
		}
		var pos = url.lastIndexOf('/');
		if (pos < 0) {
			return '';
		}
		url = url.substr(0, pos);
		if (deep === undefined || deep <= 1) {
			return url;
		}
		return tripPath(url, deep - 1);
	}
	var getBasePath = function () {
		var url = getCurrentScriptUrl();
		return tripPath(url, 2) || '.';
	};
	var loadCommon = function () {
		var file = '/dist/commons.js';
		loadJS(getBasePath() + file, loadEntry);
	};
	var loadEntry = function () {
		var entry = getEntry();
		if (!entry) {
			throw ('Entry not found');
			return false;
		}
		var file = '/dist/' + entry;
		if (file.indexOf('.js') < 0) {
			file += '.js';
		}
		loadJS(getBasePath() + file);
	};
	window.LOG = function () {
		if (window.console && window.console.log) {
			var len = arguments.length;
			for (var i = 0; i < len; i++) {
				window.console.log(arguments[i]);
			}
		}
	};
	if (IE && IE <= 8) {
		loadJS(getBasePath() + '/js/ie8Overlay.js');
	} else {
		loadCommon();
	}
})(window, document);