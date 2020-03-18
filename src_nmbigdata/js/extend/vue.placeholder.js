const Vue = require('vue');
const $ = require('jquery');

const EMPTY_CLASSNAME = 'placeholder-empty';

function mPlaceholder(el, binding) {
	var text = el.getAttribute('placeholder');
	if (!text) {
		return;
	}
	el.removeAttribute('placeholder');
	this.text = text;
	this.elem = el;
	this.$elem = $(el);
	this.binding = binding;
	this.bind();
	this.init();
}
var proto = mPlaceholder.prototype;
proto.bind = function () {
	this.elem.addEventListener('focus', this);
	this.elem.addEventListener('blur', this);
	this.elem.addEventListener('input', this);
};
proto.unbind = function () {
	this.elem.removeEventListener('focus', this);
	this.elem.removeEventListener('blur', this);
	this.elem.removeEventListener('input', this);
};
proto.init = function () {
	if (this.elem.value === '') {
		this.elem.value = this.text;
		this.setEmpty();
	} else {
		this.setNormal();
	}
};
proto.setEmpty = function () {
	this.state = 'empty';
	this.$elem.addClass(EMPTY_CLASSNAME);
};
proto.setNormal = function () {
	this.state = 'normal';
	this.$elem.removeClass(EMPTY_CLASSNAME);
};
proto.destroy = function () {
	this.unbind();
};
proto.handleEvent = function (e) {
	var type = e.type;
	var name = type.charAt(0).toUpperCase() + type.substr(1).toLowerCase();
	var method = 'handle' + name;
	if (this[method]) {
		this[method](e);
	}
};
proto.handleFocus = function (e) {
	setTimeout(() => {
		if (this.state === 'empty') {
			this.elem.value = '';
			this.setNormal();
		}
	});
};
proto.handleBlur = function (e) {
	var foo = () => {
		if (this.elem.value === '') {
			this.renderEmpty();
		}
	};
	setTimeout(foo, 80);
	setTimeout(foo, 180);
};
proto.renderEmpty = function () {
	this.elem.value = this.text;
	this.setEmpty();
};
proto.handleInput = function (e) {
};
const bind = function (el, binding) {
	if ('placeholder' in el) {
		return;
	}
	if (!el.mPlaceholder) {
		el.mPlaceholder = new mPlaceholder(el, binding);
	}
};
const inserted = function (el, binding) {
};
const unbind = function (el, binding) {
	if (el.mPlaceholder) {
		el.mPlaceholder.destroy();
	}
};
module.exports = {
	bind: bind,
	inserted: inserted,
	unbind: unbind
};
