/**
 * @描述  模拟触发click
 * @用法  click(node)
 */

(function (name, factory) {
    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define([], factory);
    } else {
        window[name] = factory();
    }
}('SimulatedClick', function () {
    "use strict";

    function simu(elem, options) {
        var evt = elem.ownerDocument.createEvent('MouseEvents');
        if (!elem) {
            return evt;
        }
        var opts = { // These are the default values, set up for un-modified left clicks
            type: 'click',
            canBubble: true,
            cancelable: true,
            view: elem.ownerDocument.defaultView,
            detail: 1,
            screenX: 0, //The coordinates within the entire page
            screenY: 0,
            clientX: 0, //The coordinates within the viewport
            clientY: 0,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false, //I *think* 'meta' is 'Cmd/Apple' on Mac, and 'Windows key' on Win. Not sure, though!
            button: 0, //0 = left, 1 = middle, 2 = right
            relatedTarget: null,
        };
        // Merge the options with the defaults
        if (options) {
            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    opts[key] = options[key];
                }
            }
        }

        //Pass in the options
        evt.initMouseEvent(
            opts.type,
            opts.canBubble,
            opts.cancelable,
            opts.view,
            opts.detail,
            opts.screenX,
            opts.screenY,
            opts.clientX,
            opts.clientY,
            opts.ctrlKey,
            opts.altKey,
            opts.shiftKey,
            opts.metaKey,
            opts.button,
            opts.relatedTarget
        );

        //Fire the event
        elem.dispatchEvent(evt);
        return evt;
    }

    var exports = function (elem, options) {
        try {
            var e = new MouseEvent('click');
            elem.dispatchEvent(e);
            return e;
        } catch(e) {
            return simu(elem, options);
        }
    };
    return exports;
}));