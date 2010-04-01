/**
 * Carbon.JS - A simple JavaScript framework
 *
 * Carbon.JS Utilities Module - Common functions
 *
 * @author		Dmitry Poluhov <admin@sjs-tech.ru>
 * @license		http://www.gnu.org/licenses/gpl.html
 * @version		1.0.2
 */

/**
 * This means that this module was connected to the document by loadModule or by script-tag
 */  
CarbonJS.modules.utilities = "enabled";

/**
 * The definition of browsers
 */
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

/**
 * Array of event handlers used in Carbon.JS
 */
CarbonJS.events = [];

/**
 * Garbage collector, erasing the event-handlers of selected elements in order to avoid memory leaks
 */
window.onunload = function() {
	while (CarbonJS.events.length > 0) Q(CarbonJS.events[0].obj).removeEvent(CarbonJS.events[0].evt);
};

CarbonJS.extend({
	
	/**
	 * Dynamically connect the script to the document
	 * @param {String} src URL of the script-file
	 * @return {NodeList}
	 */
	require: function(src) {
		var ns = document.createElement("script");
		ns.setAttribute("src", src);
		ns.setAttribute("type", "text/javascript");
		Q("head")[0].appendChild(ns);
		return this;
	},
	
	/**
	 * This function may get and set the parameters of selected elements
	 * @param {Object} attrs The list of attributes and their values
	 * @return {String, NodeList}
	 */
	attr: function(attrs) {
		if (typeof attrs == "object") {
			var argsN = [];
			var an = 0;
			for (n in attrs) {
				argsN[an] = n;
				an++;
			}
			var pr = attrs;
			this.forEach(function() {
				var i = -1;
				while (++i < an) {
					if (CarbonJS.Browsers.IE()) {
						this[argsN[i]] = pr[argsN[i]];
					} else {
						this.setAttribute(argsN[i], pr[argsN[i]]);
					}
				}
			});
			return this;
		} else if (typeof attrs == "string") {
			return CarbonJS.Browsers.IE() ? this[0][attrs] : this[0].getAttribute(attrs);
		}
	},
	
	/**
	 * This function may get and set the css-styles of selected elements
	 * @param {Object} attrs The list of css-attributes and their values
	 * @return {String, NodeList}
	 */
	css: function(attrs) {
		var cur = "";
		if (typeof attrs == "object") {
			var argsN = [];
			var an = 0;
			for (n in attrs) {
				argsN[an] = n;
				an++;
			}
			var pr = attrs;
			this.forEach(function() {
				var i = -1;
				while (++i < an) {
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
		} else if (typeof attrs == "string") {
			cur = attrs;
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
	
	/**
	 * Get and set transparence of selected elements
	 * @param {Number, String} val The degree of transparency
	 * @return {Number}
	 */
	transparence: function(val) {
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
			if (val == null) {
				if (opElem != "filter") {
					return parseInt(parseFloat(this.css(opElem)) * 100);
				} else {
					return parseInt(this.attr("transparence"));
				}
			} else {
				if (opElem != "filter") {
					if (opElem == "MozOpacity") {
						this.css({MozOpacity: parseInt(val) / 100});
					} else if (opElem == "KhtmlOpacity") {
						this.css({KhtmlOpacity: parseInt(val) / 100});
					} else if (opElem == "opacity") {
						this.css({opacity: parseInt(val) / 100});
					}
				} else {
					this.css({filter: "progid:DXImageTransform.Microsoft.Alpha(opacity=" + parseInt(val) + ")"}).attr({transparence: parseInt(val)});
				}
				return this;
			}
		}
	},
	
	/**
	 * Apply some css-class to selected elements
	 * @param {String} name Name of the class
	 * @return {NodeList}
	 */
	addClass: function(name) {
		this.forEach(function() {
			if (!(new RegExp("(^|\s)" + name + "(\s|$)").test(this.className))) this.className += " " + name;
		});
		return this;
	},
	
	/**
	 * Remove some css-class from selected elements
	 * @param {String} name Name of the class
	 * @return {NodeList}
	 */
	removeClass: function(name) {
		this.forEach(function() {
			if (name != null) {
				var ncl = "";
				var cl = (Q(this).attr("className") != null) ? Q(this).attr("className") : Q(this).attr("class");
				cl = cl.split(" ");
				var i = -1;
				while (++i < cl.length) {
					if (cl[i] == name) cl.splice(i, 1);
				}
				i = -1
				while (++i < cl.length) ncl += cl[i];
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
	
	/**
	 * Get and set the X-coordinate of selected elements and get the X-coordinate of the mouse
	 * @param {String, Number, Object} evt Coordinate or event-object
	 * @return {Number, NodeList}
	 */
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
				for (var parent = this[0].offsetParent; parent; parent = parent.offsetParent) left += parent.offsetLeft - parent.scrollLeft;
				return parseInt(left);
			}
		}
	},
	
	/**
	 * Get and set the Y-coordinate of selected elements and get the Y-coordinate of the mouse
	 * @param {String, Number, Object} evt Coordinate or event-object
	 * @return {Number, NodeList}
	 */
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
			if (evt != null) {
				this.css("position") != "absolute" ? this.css({position: "absolute"}) : "";
				this.css({top: parseInt(evt) + "px"});
				return this;
			} else {
				var top = this[0].offsetTop;
				for (var parent = this[0].offsetParent; parent; parent = parent.offsetParent) top += parent.offsetTop - parent.scrollTop;
				top += document.body.scrollTop;
				return parseInt(top);
			}
		}
	},
	
	/**
	 * Add an event-handler to selected elements
	 * @param {String} evnt Types of events like "click", "mouseover", etc.
	 * @param {Function} func Function to be executed for selected elements when a specified event
	 * @return {NodeList}
	 */
	addEvent: function(evnt, func) {
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
	
	/**
	 * Remove event-handlers from selected elements
	 * @param {String} evnt Name of type of event that must be removed from selected elements
	 * @return {NodeList}
	 */
	removeEvent: function(evnt) {
		this.forEach(function() {
			var k = -1;
			while (++k < CarbonJS.events.length) {
				if (CarbonJS.events[k].obj == this && CarbonJS.events[k].evt == evnt) {
					if (typeof this.removeEventListener != "undefined") {
						this.removeEventListener(evnt, CarbonJS.events[k].func, false);
					} else if (typeof this.detachEvent != "undefined") {
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

/**
 * This function put all received functions to window.onload
 * @param {Function} newfunc Function that must be executed after loading of the document
 */
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

/**
 * This function executes all received functions after the creation of DOM
 * @param {Function} newfunc
 */
CarbonJS.onDOMready = function(func) {
	var load_events = [];
	var load_timer, script, done, exec, old_onload;
	function init() {
		done = true;
		clearInterval(load_timer);
		while (exec = load_events.shift()) exec();
		if (script) script.onreadystatechange = "";
	}
	if (done) return func();
	if (!load_events[0]) {
		if (document.addEventListener) document.addEventListener("DOMContentLoaded", init, false);
		if (CarbonJS.Browsers.IE()) {
			document.write('<script id="__ie_onload" defer="defer" src="javascript:void(0)"><\/scr' + 'ipt>');
			script = Q("#__ie_onload")[0];
			script.onreadystatechange = function() {
				if (this.readyState == "complete") init();
			}
		}
		if (CarbonJS.Browsers.Safari()) {
			load_timer = setInterval(function() {
				if (/loaded|complete/.test(document.readyState)) init();
			}, 10);
		}
		CarbonJS.onLoad(init);
	}
	load_events.push(func);
};
