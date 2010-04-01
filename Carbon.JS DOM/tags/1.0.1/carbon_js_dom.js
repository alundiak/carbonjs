/**
 * Carbon.JS - A simple JavaScript framework
 *
 * Carbon.JS DOM Module - Basic DOM functions
 *
 * @author		Dmitry Poluhov <admin@sjs-tech.ru>
 * @license		http://www.gnu.org/licenses/gpl.html
 * @version		1.0.1
 */
 
CarbonJS.modules.dom = "enabled";
CarbonJS.refreshCache = function() {
	CarbonJS.__cache = {};
}
CarbonJS.extend({
	html: function() {
		if (arguments.length == 0) {
			return this[0].innerHTML;
		} else if (arguments.length == 1) {
			var cnt = arguments[0];
			this.forEach(function() {
				this.innerHTML = cnt;
			});
			CarbonJS.refreshCache();
			return this;
		}
	},
	text: function() {
		if (this[0].nodeType == 3 || this[0].nodeType == 4) {
			return this[0].data;
		}
		var text = [];
		for (var i = 0; i < this[0].childNodes.length; i++) {
			text.push(Q(this[0].childNodes[i]).text());
		}
		return text.join(" ");
	},
	createDOM: function() {
		if (CarbonJS.modules.utilities == "enabled") {
			var dom = "";
			for (var a = 0; a < arguments.length; a++) {
				if (typeof(arguments[a]) == "string") {
					if (/^#\w+$/.test(arguments[a])) {
						dom = Q(arguments[a])[0];
					} else {
						dom = document.createTextNode(arguments[a]);
					}
				} else if (typeof(arguments[a]) == "object") {
					if (arguments[a].tag == null) {
						dom = arguments[a];
					} else {
						dom = document.createElement(arguments[a].tag);
						if (arguments[a].id) {
							dom.setAttribute("id", arguments[a].id);
						}
						if (arguments[a].css) {
							Q(dom).css(arguments[a].css);
						}
						if (arguments[a].attr) {
							Q(dom).attr(arguments[a].attr);
						}
						if (arguments[a].children) {
							for (var i = 0; i < arguments[a].children.length; i++) {
								dom.appendChild(Q().createDOM(arguments[a].children[i]));
							}
						}
					}
				}
			}
			return dom;
		} else {
			alert("Модуль Carbon.JS Utilities не загружен!");
		}
	},
	append: function() {
		for (var i = 0; i < arguments.length; i++) {
			if (this.length > 1) {
				var arg = arguments[i];
				this.forEach(function() {
					this.appendChild(Q().createDOM(arg));
				});
			} else {
				this[0].appendChild(Q().createDOM(arguments[i]));
			}
		}
		CarbonJS.refreshCache();
		return this;
	},
	prepend: function() {
		for (var i = (arguments.length - 1); i >= 0; i--) {
			if (this.length > 1) {
				var arg = arguments[i];
				this.forEach(function() {
					this.insertBefore(Q().createDOM(arg), this.firstChild);
				});
			} else {
				this[0].insertBefore(Q().createDOM(arguments[i]),this[0].firstChild);
			}
		}
		CarbonJS.refreshCache();
		return this;
	},
	addBeforeIt: function() {
		for (var i = 0; i < arguments.length; i++) {
			if (this.length > 1) {
				var arg = arguments[i];
				this.forEach(function() {
					this.parentNode.insertBefore(Q().createDOM(arg), this);
				});
			} else {
				this[0].parentNode.insertBefore(Q().createDOM(arguments[i]), this[0]);
			}
		}
		CarbonJS.refreshCache();
		return this;
	},
	addAfterIt: function() {
		for(var i = 0; i < arguments.length; i++) {
			if (this.length > 1) {
				var arg = arguments[i];
				this.forEach(function() {
					this.parentNode.insertBefore(Q().createDOM(arg), this.nextSibling);
				});
			} else {
				this[0].parentNode.insertBefore(Q().createDOM(arguments[i]), this[0].nextSibling);
			}
		}
		CarbonJS.refreshCache();
		return this;
	},
	clear: function() {
		if (arguments.length > 0) {
			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				this.forEach(function() {
					QF(this, arg).remove();
				});
			}
		} else {
			this.forEach(function() {
				var el = this;
				while (el.firstChild) {
					el.removeChild(el.firstChild);
				}
			});
		}
		CarbonJS.refreshCache();
		return this;
	},
	clone: function(depth) {
		if (depth == null) {
			return this[0].cloneNode(true);
		} else {
			return this[0].cloneNode(depth);
		}
	},
	remove: function() {
		this.forEach(function() {
			this.parentNode.removeChild(this);
		});
		CarbonJS.refreshCache();
		return this;
	},
	parentNode: function() {
		return Q(this[0].parentNode);
	},
	firstChild: function() {
		return Q(this[0].firstChild);
	},
	lastChild: function() {
		return Q(this[0].lastChild);
	},
	nextSibling: function() {
		var ns = this[0];
		while ((ns = ns.nextSibling) && ns.nodeType != 1) {}
		return Q(ns);
	},
	prevSibling: function() {
		var ps = this[0];
		while ((ps = ps.previousSibling) && ps.nodeType != 1) {}
		return Q(ps);
	}
});