/*
  * TransitionEnd
*/
define([], function () {
    var transitions = {
        'transition'       : 'transitionend',
        'WebkitTransition' : 'webkitTransitionEnd',
        'MozTransition'    : 'transitionend',
        'OTransition'      : 'oTransitionEnd otransitionend'
    };
    function getPropertyTime(value) {
        var arr = value.split(',');
        var result = [];
        for (var i = 0; i < arr.length; i++) {
            var val = arr[i];
            var num = parseFloat(val) || 0;
            if (val.substr(val.length - 2) === 'ms') {
                result.push(num);
            } else if (val.charAt(val.length - 1) === 's') {
                result.push(num * 1000);
            } else {
                result.push(num);
            }
        }
        return Math.max.apply(Math, result);
    }
    function getPropertyValue(props, propName) {
        propName = propName.substr(0, 1).toUpperCase() + propName.substr(1).toLowerCase();
        for (var i in transitions) {
            if (props[i + propName] !== undefined) {
                return props[i + propName];
            }
        }
        return '';
    }
    function getTransitionTime(elem) {
        var props = window.getComputedStyle(elem, null);
        var duration = getPropertyValue(props, 'duration');
        var durationTime = getPropertyTime(duration);
        var delay = getPropertyValue(props, 'delay');
        var delayTime = getPropertyTime(delay);
        var time = durationTime + delayTime;
        var plus = Math.min(Math.round(time * .1), 100);
        return time + plus;
    }
    function getTransitionEventName(elem) {
        for (var t in transitions) {
            if (elem.style[t] !== undefined) {
                return transitions[t];
            }
        }
        return 'transitionend';
    }
    var exports = function (elem, callback) {
        var noop = function () {};
        if (!elem) {
            return {
                remove: noop,
                name: 'ElemUndefined'
            };
        }
        if (typeof elem === 'string') {
            elem = document.querySelector(elem);
        }

        var eventName = getTransitionEventName(elem);
        var holder = {
            name: eventName
        };
        holder.remove = function () {
            elem.removeEventListener(eventName, eventHandler, false);
            if (holder.timer) {
                clearTimeout(holder.timer);
            }
            holder.timer = null;
            try {
                delete elem.transitionEnd;
            } catch (e) {
                elem.transitionEnd = undefined;
            }
        };
        var eventHandler = function () {
            if (holder.fired) {
                return false;
            }
            callback(elem);
            holder.fired = true;
            holder.remove();
        };
        // start
        elem.addEventListener(eventName, eventHandler, false);
        holder.timer = setTimeout(eventHandler, getTransitionTime(elem));
        elem.transitionEnd = holder;
        return holder;
    };
    return exports;
});