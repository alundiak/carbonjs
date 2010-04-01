/**
 * Carbon.JS - A simple JavaScript framework
 *
 * Carbon.JS Utilities Module - Common functions
 *
 * @author		Dmitry Poluhov <admin@sjs-tech.ru>
 * @license		http://www.gnu.org/licenses/gpl.html
 * @version		1.0.1 
 */
 
CarbonJS.modules.utilities = "enabled";
CarbonJS.Browsers = {
	IE: function() {
		return ('\v' == 'v');
	},
	FF: function() {
		return (navigator.userAgent.toLowerCase().indexOf("firefox") != -1);
	},
	Opera: function() {
		return (navigator.userAgent.toLowerCase().indexOf("opera") != -1);
	},
	Safari: function() {
		return (navigator.userAgent.toLowerCase().indexOf("safari") != -1);
	}
};
CarbonJS.events = [];
window.onunload = function() {
	while (CarbonJS.events.length > 0) {
		Q(CarbonJS.events[0].obj).removeEvent(CarbonJS.events[0].evt);
	}
};
CarbonJS.extend({
	require: function(src) {
		var ns = document.createElement("script");
		ns.setAttribute("src", src);
		ns.setAttribute("type", "text/javascript");
		Q("head")[0].appendChild(ns);
		return this;
	},
	attr: function() {
		if (typeof arguments[0] == "object") {
			var argsN = [];
			var an = 0;
			for (n in arguments[0]) {
				argsN[an] = n;
				an++;
			}
			var pr = arguments[0];
			this.forEach(function() {
				for (var i = 0; i < an; i++) {
					if (CarbonJS.Browsers.IE()) {
						this[argsN[i]] = pr[argsN[i]];
					} else {
						this.setAttribute(argsN[i], pr[argsN[i]]);
					}
				}
			});
			return this;
		} else if (typeof arguments[0] == "string") {
			return CarbonJS.Browsers.IE() ? this[0][arguments[0]] : this[0].getAttribute(arguments[0]);
		}
	},
	css: function() {
		var cur = "";
		if (typeof arguments[0] == "object") {
			var argsN = [];
			var an = 0;
			for (n in arguments[0]) {
				argsN[an] = n;
				an++;
			}
			var pr = arguments[0];
			this.forEach(function() {
				for (var i = 0; i < an; i++) {
					var r = argsN[i];
					if (argsN[i] != "MozOpacity" && argsN[i] != "KhtmlOpacity") {
						cur = r.replace(/\-(\w)/g, function() {
							return arguments[1].toUpperCase();
						});
					} else {
						cur = r;
					}
					this.style[cur] = pr[argsN[i]];
				}
			});
			return this;
		} else if (typeof arguments[0] == "string") {
			cur = arguments[0];
			if (cur != "MozOpacity" && cur != "KhtmlOpacity") {
				cur = cur.replace(/\-(\w)/g, function() {
					return arguments[1].toUpperCase();
				});
			}
			if (window.getComputedStyle) {
				return window.getComputedStyle(this[0], null)[cur];
			} else {
				return this[0].currentStyle[cur];
			}
		}
	},
	transparence: function(method) {
		var opElem = "undefined";
		if (document.body.filters) {
			opElem = "filter";
		} else if (typeof document.body.style.MozOpacity == "string") {
			opElem = "MozOpacity";
		} else if (typeof document.body.style.KhtmlOpacity == "string") {
			opElem = "KhtmlOpacity";
		} else if (typeof document.body.style.opacity == "string") {
			opElem = "opacity";
		}
		if (this.length == 0) {
			return opElem;
		} else {
			if (method == null) {
				if (opElem != "filter") {
					return parseInt(parseFloat(this.css(opElem)) * 100);
				} else {
					return parseInt(this.attr("transparence"));
				}
			} else {
				if (opElem != "filter") {
					if (opElem == "MozOpacity") {
						this.css({MozOpacity: parseInt(method) / 100});
					} else if (opElem == "KhtmlOpacity") {
						this.css({KhtmlOpacity: parseInt(method) / 100});
					} else if (opElem == "opacity") {
						this.css({opacity: parseInt(method) / 100});
					}
				} else {
					this.css({filter: "progid:DXImageTransform.Microsoft.Alpha(opacity=" + parseInt(method) + ")"}).attr({transparence: parseInt(method)});
				}
				return this;
			}
		}
	},
	addClass: function(name) {
		this.forEach(function() {
			if (!(new RegExp("(^|\s)" + name + "(\s|$)").test(this.className))) {
				this.className += " " + name;
			}
		});
		return this;
	},
	removeClass: function(name) {
		this.forEach(function() {
			if (name != null) {
				var ncl = "";
				var cl = (Q(this).attr("className") != null) ? Q(this).attr("className") : Q(this).attr("class");
				cl = cl.split(" ");
				for (var i = 0; i < cl.length; i++) {
					if (cl[i] == name) {
						cl.splice(i, 1);
					}
				}
				for (var i = 0; i < cl.length; i++) {
					ncl += cl[i];
				}
				if (Q(this).attr("className") != null) {
					Q(this).attr({"className": ncl});
				} else {
					Q(this).attr({"class": ncl});
				}
			} else {
				if (Q(this).attr("className") != null) {
					Q(this).attr({"className": ""});
				} else {
					Q(this).attr({"class": ""});
				}
			}
		});
		return this;
	},
	x: function(evt) {
		if (this.length == 0) {
			if (CarbonJS.Browsers.FF()) {
				return parseInt(evt.pageX);
			} else {
				return parseInt(event.x);
			}
		} else {
			if (evt != null) {
				if (this.css("position") != "absolute") this.css({position: "absolute"});
				this.css({left: parseInt(evt) + "px"});
				return this;
			} else {
				var left = this[0].offsetLeft;
				for (var parent = this[0].offsetParent; parent; parent = parent.offsetParent) {
					left += parent.offsetLeft - parent.scrollLeft;
				}
				return parseInt(left);
			}
		}
	},
	y: function(evt) {
		if (this.length == 0) {
			var y;
			if (CarbonJS.Browsers.FF()) {
				y = parseInt(evt.pageY);
			} else {
				y = parseInt(event.y);
			}
			y += (Q().transparence() != "MozOpacity") ? document.body.scrollTop : "";
			return parseInt(y);
		} else {
			if(evt != null) {
				this.css("position") != "absolute" ? this.css({position: "absolute"}) : "";
				this.css({top: parseInt(evt) + "px"});
				return this;
			} else {
				var top = this[0].offsetTop;
				for (var parent = this[0].offsetParent; parent; parent = parent.offsetParent) {
					top += parent.offsetTop - parent.scrollTop;
				}
				top += document.body.scrollTop;
				return parseInt(top);
			}
		}
	},
	addEvent: function(evnt,func) {
		this.forEach(function() {
			if (typeof this.addEventListener != "undefined") {
				this.addEventListener(evnt, func, false);
			} else if (typeof this.attachEvent != "undefined") {
				this.attachEvent("on" + evnt, func);
			} else {
				this["on" + evnt] = func;
			}
			CarbonJS.events.push({
				obj: this,
				evt: evnt,
				func: func
			});
		});
		return this;
	},
	removeEvent: function(evnt) {
		this.forEach(function() {
			for (var k = 0; k < CarbonJS.events.length; k++) {
				if (CarbonJS.events[k].obj == this && CarbonJS.events[k].evt == evnt) {
					if(typeof this.removeEventListener != "undefined") {
						this.removeEventListener(evnt, CarbonJS.events[k].func, false);
					} else if(typeof this.detachEvent != "undefined") {
						this.detachEvent("on" + evnt, CarbonJS.events[k].func);
					} else {
						this["on" + evnt] = "";
					}
					CarbonJS.events.splice(k, 1);
					break;
				}
			}
		});
		return this;
	}
});
CarbonJS.onLoad = function(newfunc) {
	var oldfunc = window.onload;
	if (typeof window.onload != "function") {
		window.onload = newfunc;
	} else {
		window.onload = function() {
			oldfunc();
			newfunc();
		}
	}
};
CarbonJS.onDOMready = function(func) {
	var load_events = [];
	var load_timer, script, done, exec, old_onload;
	function init() {
		done = true;
		clearInterval(load_timer);
		while (exec = load_events.shift()) {
			exec();
		}
		if (script) {
			script.onreadystatechange = "";
		}
	}
	if (done) {
		return func();
	}
	if (!load_events[0]) {
		if (document.addEventListener) {
			document.addEventListener("DOMContentLoaded", init, false);
		}
		if (CarbonJS.Browsers.IE()) {
			document.write("<script id=__ie_onload defer src=//0><\/scr" + "ipt>");
			script = Q("#__ie_onload")[0];
			script.onreadystatechange = function() {
				if (this.readyState == "complete") {
					init();
				}
			}
		}
		if (CarbonJS.Browsers.Safari()) {
			load_timer = setInterval(function() {
				if (/loaded|complete/.test(document.readyState)) {
					init();
				}
			}, 10);
		}
		CarbonJS.onLoad(init);
	}
	load_events.push(func);
};
