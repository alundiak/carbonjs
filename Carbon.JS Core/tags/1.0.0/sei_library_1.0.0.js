/**
 * SEI Library - A simple JavaScript framework
 *
 * @author		Dmitry Poluhov <admin@sjs-tech.ru>
 * @license		http://www.gnu.org/licenses/gpl.html
 * @version		1.0.0 
 */

var $ = window.$ = function() {
	return this instanceof $ ? this.get(arguments) : new $(arguments);
}
Array.prototype.inArray = function(value) {
	for(var i = 0; i < this.length; i++) {
		if(this[i] === value) {
			return true;
		}
	}
	return false;
};
Function.prototype.bind = function(object) {
	var param = this;
	return function() {
		return param.apply(object,arguments);
	}
};
var __globalEvents = [];
var __globalActions = [];
window.onunload = function() {
	while(__globalEvents.length > 0) {
		$(__globalEvents[0].obj).removeEvent(__globalEvents[0].evt);
	}
};
$.prototype = {
	//--------------- Общие функции ---------------
	get: function(selector) {
		this.length = 1;	
		this[0] = document;
		var elems = [];
		var params = selector[0];
		for(var args = 0; args < params.length; args++) {
			if((params[args] != "undefined" || params[args] != "") && typeof params[args] == "string") {
				if(params[args].indexOf(" ") == -1) {
					if(/^#\w+$/.test(params[args])) {
						if(!elems.inArray(document.getElementById(params[args].split("#")[1]))) {
							elems.push(document.getElementById(params[args].split("#")[1]));
						}
					} else if(/^[a-zA-Z]+#\w+$/.test(params[args])) {
						if(!elems.inArray(document.getElementById(params[args].split("#")[1])) && document.getElementById(params[args].split("#")[1]).tagName.toLowerCase() == params[args].split("#")[0]) {
							elems.push(document.getElementById(params[args].split("#")[1]));
						}
					} else if(/^[a-zA-Z*]+$/.test(params[args])) {
						for(var i = 0; i < document.getElementsByTagName(params[args]).length; i++) {
							if(!document.getElementsByTagName(params[args])[i].id) {
								document.getElementsByTagName(params[args])[i].id = "sei" + Math.floor(Math.random() * 99999);
							}
							if(!elems.inArray(document.getElementById(document.getElementsByTagName(params[args])[i].id))) {
								elems.push(document.getElementById(document.getElementsByTagName(params[args])[i].id));
							}
						}
					} else if(/^\.{1}\w+$/.test(params[args])) {
						for(var i = 0; i < document.getElementsByTagName("*").length; i++) {
							if(new RegExp("(^|\s)" + params[args].split(".")[1] + "(\s|$)").test(document.getElementsByTagName("*")[i].className)) {
								if(!document.getElementsByTagName("*")[i].id) {
									document.getElementsByTagName("*")[i].id = "sei" + Math.floor(Math.random() * 99999);
								}
								if(!elems.inArray(document.getElementById(document.getElementsByTagName("*")[i].id))) {
									elems.push(document.getElementById(document.getElementsByTagName("*")[i].id));
								}
							}
						}
					} else if(/^[a-zA-Z]+\.\w+$/.test(params[args])) {
						for(var i = 0; i < document.getElementsByTagName(params[args].split(".")[0]).length; i++) {
							if(new RegExp("(^|\s)" + params[args].split(".")[1] + "(\s|$)").test(document.getElementsByTagName(params[args].split(".")[0])[i].className)) {
								if(!document.getElementsByTagName(params[args].split(".")[0])[i].id) {
									document.getElementsByTagName(params[args].split(".")[0])[i].id = "sei" + Math.floor(Math.random() * 99999);
								}
								if(!elems.inArray(document.getElementById(document.getElementsByTagName(params[args].split(".")[0])[i].id))) {
									elems.push(document.getElementById(document.getElementsByTagName(params[args].split(".")[0])[i].id));
								}
							}
						}
					}
				} else {
					for(var i = 0; i < $(params[args].split(" ")[0]).len(); i++) {
						if(/^[a-zA-Z*]+$/.test(params[args].split(" ")[1])) {
							for(var j = 0; j < $(params[args].split(" ")[0]).arr(i).getElementsByTagName(params[args].split(" ")[1]).length; j++) {
								if(!$(params[args].split(" ")[0]).arr(i).getElementsByTagName(params[args].split(" ")[1])[j].id) {
									$(params[args].split(" ")[0]).arr(i).getElementsByTagName(params[args].split(" ")[1])[j].id = "sei" + Math.floor(Math.random() * 99999);
								}
								if(!elems.inArray($(params[args].split(" ")[0]).arr(i).getElementsByTagName(params[args].split(" ")[1])[j])) {
									elems.push($(params[args].split(" ")[0]).arr(i).getElementsByTagName(params[args].split(" ")[1])[j]);
								}
							}
						} else if(/^\.{1}\w+$/.test(params[args].split(" ")[1])) {
							for(var j = 0; j < $(params[args].split(" ")[0]).arr(i).getElementsByTagName("*").length; j++) {
								if(new RegExp("(^|\s)" + params[args].split(" ")[1].split(".")[1] + "(\s|$)").test($(params[args].split(" ")[0]).arr(i).getElementsByTagName("*")[j].className)) {
									if(!$(params[args].split(" ")[0]).arr(i).getElementsByTagName("*")[j].id) {
										$(params[args].split(" ")[0]).arr(i).getElementsByTagName("*")[j].id = "sei" + Math.floor(Math.random() * 99999);
									}
									if(!elems.inArray($(params[args].split(" ")[0]).arr(i).getElementsByTagName("*")[j])) {
										elems.push($(params[args].split(" ")[0]).arr(i).getElementsByTagName("*")[j]);
									}
								}
							}
						} else if(/^[a-zA-Z]+\.\w+$/.test(params[args].split(" ")[1])) {
							for(var j = 0; j < $(params[args].split(" ")[0]).arr(i).getElementsByTagName(params[args].split(" ")[1].split(".")[0]).length; j++) {
								if(new RegExp("(^|\s)" + params[args].split(" ")[1].split(".")[1] + "(\s|$)").test($(params[args].split(" ")[0]).arr(i).getElementsByTagName(params[args].split(" ")[1].split(".")[0])[j].className)) {
									if(!$(params[args].split(" ")[0]).arr(i).getElementsByTagName(params[args].split(" ")[1].split(".")[0])[j].id) {
										$(params[args].split(" ")[0]).arr(i).getElementsByTagName(params[args].split(" ")[1].split(".")[0])[j].id = "sei" + Math.floor(Math.random() * 99999);
									}
									if(!elems.inArray($(params[args].split(" ")[0]).arr(i).getElementsByTagName(params[args].split(" ")[1].split(".")[0])[j])) {
										elems.push($(params[args].split(" ")[0]).arr(i).getElementsByTagName(params[args].split(" ")[1].split(".")[0])[j]);
									}
								}
							}
						}
					}
				}
			} else if((params[args] != "undefined" || params[args] != "") && typeof params[args] == "object") {
				elems.push(params[args]);
			}
		}
		if(elems.length != 0) {
			this[0] = elems;
		}
		return this;
	},
	isOpera: function() {
		return (navigator.userAgent.toLowerCase().indexOf("opera") != -1);
	},
	isIE: function() {
		return (!this.isOpera() && (navigator.userAgent.toLowerCase().indexOf("msie") != -1));
	},
	isFF: function() {
		return (navigator.userAgent.toLowerCase().indexOf("firefox") != -1);
	},
	isSafari: function() {
		return (navigator.userAgent.toLowerCase().indexOf("safari") != -1);
	},
	require: function(src) {
		var ns = document.createElement("script");
		ns.setAttribute("src",src);
		ns.setAttribute("type","text/javascript");
		$("head").arr(0).appendChild(ns);
		return this;
	},
	len: function() {
		if(this[0] != document) {
			return this[0].length ? this[0].length : 0;
		} else {
			return "undefined";
		}
	},
	arr: function(ind) {
		if(this[0] != document) {
			if(ind != null) {
				return this[0][ind];
			} else {
				return this[0];
			}
		} else {
			return "undefined";
		}
	},
	attr: function() {
		if(this[0] != document) {
			if(typeof arguments[0] == "object") {
				var argsN = [];
				var an = 0;
				for(n in arguments[0]) {
					argsN[an] = n;
					an++;
				}
				var pr = arguments[0];
				this.forEach(function(id,j) {
					for(var i = 0; i < an; i++) {
						this[j].setAttribute(argsN[i],pr[argsN[i]]);
					}
				}.bind(this[0]));
				return this;
			} else if(typeof arguments[0] == "string") {
				return this[0][0].getAttribute(arguments[0]);
			}
		} else {
			if(typeof arguments[0] == "object") {
				return this;
			} else if(typeof arguments[0] == "string") {
				return "undefined";
			}
		}
	},
	css: function() {
		if(this[0] != document) {
			var cur = "";
			if(typeof arguments[0] == "object") {
				var argsN = [];
				var an = 0;
				for(n in arguments[0]) {
					argsN[an] = n;
					an++;
				}
				var pr = arguments[0];
				this.forEach(function(id,k) {
					for(var i = 0; i < an; i++) {
						var r = argsN[i];
						if(argsN[i] != "MozOpacity" && argsN[i] != "KhtmlOpacity") {
							cur = r.replace(/\-(\w)/g,function() {
								return arguments[1].toUpperCase();
							});
						} else {
							cur = r;
						}
						this[k].style[cur] = pr[argsN[i]];
					}
				}.bind(this[0]));
				return this;
			} else if(typeof arguments[0] == "string") {
				cur = arguments[0];
				if(cur != "MozOpacity" && cur != "KhtmlOpacity") {
					cur = cur.replace(/\-(\w)/g,function() {
						return arguments[1].toUpperCase();
					});
				}
				if(window.getComputedStyle) {
					return window.getComputedStyle(this[0][0],null)[cur];
				} else {
					return this[0][0].currentStyle[cur];
				}
			}
		} else {
			if(typeof arguments[0] == "object") {
				return this;
			} else if(typeof arguments[0] == "string") {
				return "undefined";
			}
		}
	},
	addClass: function(name) {
		if(this[0] != document) {
			this.forEach(function(id,j) {
				if(!(new RegExp("(^|\s)" + name + "(\s|$)").test(this[j].className))) {
					this[j].className += " " + name;
				}
			}.bind(this[0]));
		}
		return this;
	},
	removeClass: function(name) {
		if(this[0] != document) {
			this.forEach(function(id) {
				if(name != null) {
					var ncl = "";
					var cl = $("#" + id).attr("className") != null ? $("#" + id).attr("className") : $("#" + id).attr("class");
					cl = cl.split(" ");
					for(var i = 0; i < cl.length; i++) {
						if(cl[i] == name) {
							cl.splice(i,1);
						}
					}
					for(var i = 0; i < cl.length; i++) {
						ncl += cl[i];
					}
					if($("#" + id).attr("className") != null) {
						$("#" + id).attr({"className": ncl});
					} else {
						$("#" + id).attr({"class": ncl});
					}
				} else {
					if($("#" + id).attr("className") != null) {
						$("#" + id).attr({"className": ""});
					} else {
						$("#" + id).attr({"class": ""});
					}
				}
			});
		}
		return this;
	},
	x: function(evt) {
		evt = arguments[0];
		if(this[0] == document) {
			if($().isFF()) {
				return parseInt(evt.pageX);
			} else {
				return parseInt(event.x);
			}
		} else {
			if(evt != null) {
				this.css("position") != "absolute" ? this.css({position: "absolute"}) : "";
				this.css({left: parseInt(evt) + "px"});
				return this;
			} else {
				var left = $("#" + this.attr("id")).arr(0).offsetLeft;
				for(var parent = $("#" + this.attr("id")).arr(0).offsetParent; parent; parent = parent.offsetParent) {
					left += parent.offsetLeft - parent.scrollLeft;
				}
				return parseInt(left);
			}
		}
	},
	y: function(evt) {
		if(this[0] == document) {
			var y;
			if($().isFF()) {
				y = parseInt(evt.pageY);
			} else {
				y = parseInt(event.y);
			}
			($().transparence() != "MozOpacity") ? y += document.body.scrollTop : "";
			return parseInt(y);
		} else {
			if(evt != null) {
				this.css("position") != "absolute" ? this.css({position: "absolute"}) : "";
				this.css({top: parseInt(evt) + "px"});
				return this;
			} else {
				var top = $("#" + this.attr("id")).arr(0).offsetTop;
				for(var parent = $("#" + this.attr("id")).arr(0).offsetParent; parent; parent = parent.offsetParent) {
					top += parent.offsetTop - parent.scrollTop;
				}
				top += document.body.scrollTop;
				return parseInt(top);
			}
		}
	},
	addEvent: function(evnt,func) {
		if(this[0] != document) {
			this.forEach(function(id,j) {
				if(typeof this[j].addEventListener != "undefined") {
					this[j].addEventListener(evnt,func,false);
				} else if(typeof this[j].attachEvent != "undefined") {
					this[j].attachEvent("on" + evnt,func);
				} else {
					this[j]["on" + evnt] = func;
				}
				__globalEvents.push({
					obj: this[j],
					evt: evnt,
					func: func
				});
			}.bind(this[0]));
		}
		return this;
	},
	removeEvent: function(evnt) {
		if(this[0] != document) {
			this.forEach(function(id,j) {
				for(var k = 0; k < __globalEvents.length; k++) {
					if(__globalEvents[k].obj == this[j] && __globalEvents[k].evt == evnt) {
						if(typeof this[j].removeEventListener != "undefined") {
							this[j].removeEventListener(evnt,__globalEvents[k].func,false);
						} else if(typeof this[j].detachEvent != "undefined") {
							this[j].detachEvent("on" + evnt,__globalEvents[k].func);
						} else {
							this[j]["on" + evnt] = "";
						}
						__globalEvents.splice(k,1);
						break;
					}
				}
			}.bind(this[0]));
		}
		return this;
	},
	onLoad: function(newfunc) {
		var oldfunc = window.onload;
		if(typeof window.onload != "function") {
			window.onload = newfunc;
		} else {
			window.onload = function() {
				oldfunc();
				newfunc();
			}
		}
		return this;
	},
	onDOMready: function(func) {
		var load_events = [];
		var load_timer, script, done, exec, old_onload;
		function init() {
			done = true;
			clearInterval(load_timer);
			while(exec = load_events.shift()) {
				exec();
			}
			if(script) {
				script.onreadystatechange = "";
			}
		}
		if(done) {
			return func();
		}
		if(!load_events[0]) {
			if(document.addEventListener) {
				document.addEventListener("DOMContentLoaded",init,false);
			}
			if($().isIE()) {
				document.write("<script id=__ie_onload defer src=//0><\/scr" + "ipt>");
				script = $("#__ie_onload").arr(0);
				script.onreadystatechange = function() {
					if(this.readyState == "complete") {
						init();
					}
				}
			}
			if($().isSafari()) {
				load_timer = setInterval(function() {
					if(/loaded|complete/.test(document.readyState)) {
						init();
					}
				},10);
			}
			$().onLoad(init);
		}
		load_events.push(func);
		return this;
	},
	toggle: function(param) {
		if(this[0] != document) {
			if(param == null) {
				if(this.css("display") != "none") {
					this.css({display: "none"});
				} else {
					this.css({display: "block"});
				}
			} else {
				if(!this.attr("toggle") || this.attr("toggle") == "on") {
					param.off();
					this.attr({toggle: "off"});
				} else if(this.attr("toggle") == "off") {
					param.on();
					this.attr({toggle: "on"});
				}
			}
		}
		return this;
	},
	forEach: function(func) {
		if(this[0] != document) {
			for(var e = 0; e < this[0].length; e++) {
				func(this[0][e] ? this[0][e].id : "",e);
			}
		}
		return this;
	},
	stop: function() {
		if(this[0] != document) {
			var args = arguments;
			this.forEach(function(id,j) {
				for(var i = 0; i < __globalActions.length; i++) {
					if(args.length == 0) {
						if(__globalActions[i].obj == this[j]) {
							clearInterval(__globalActions[i].tmr);
							__globalActions.splice(i,1);
						}
					} else {
						if(args[0] == "changing") {
							if(__globalActions[i].obj == this[j] && __globalActions[i].type == "changing") {
								clearInterval(__globalActions[i].tmr);
								__globalActions.splice(i,1);
								break;
							}
						} else if(args[0] == "moving") {
							if(__globalActions[i].obj == this[j] && __globalActions[i].type == "moving") {
								clearInterval(__globalActions[i].tmr);
								__globalActions.splice(i,1);
								break;
							}
						}
					}
				}
			}.bind(this[0]));
		}
		return this;
	},
	//--------------- Манипуляции DOM ---------------
	html: function() {
		if(arguments.length == 0) {
			if(this[0] != document) {
				return this[0][0].innerHTML;
			} else {
				return "undefined";
			}
		} else if(arguments.length == 1) {
			if(this[0] != document) {
				var cnt = arguments[0];
				this.forEach(function(id) {
					$("#" + id).arr(0).innerHTML = cnt;
				});
			}
			return this;
		}
	},
	text: function() {
		if(this[0] != document) {
			if (this[0][0].nodeType == 3 || this[0][0].nodeType == 4) {
				return this[0][0].data;
			}
			var text = [];
			for(var i = 0; i < this[0][0].childNodes.length; i++) {
				text.push($(this[0][0].childNodes[i]).text());
			}
			return text.join(" ");
		} else {
			return "undefined";
		}
	},
	createDOM: function() {
		var dom = "";
		for(var a = 0; a < arguments.length; a++) {
			if(typeof(arguments[a]) == "string") {
				if(/^#\w+$/.test(arguments[a])) {
					dom = $(arguments[a]).arr(0);
				} else {
					dom = document.createTextNode(arguments[a]);
				}
			} else if(typeof(arguments[a]) == "object") {
				if(arguments[a].tag == null) {
					dom = arguments[a];
				} else {
					dom = document.createElement(arguments[a].tag);
					if(arguments[a].id) {
						dom.setAttribute("id",arguments[a].id);
					}
					if(arguments[a].css) {
						$(dom).css(arguments[a].css);
					}
					if(arguments[a].attr) {
						$(dom).attr(arguments[a].attr);
					}
					if(arguments[a].children) {
						for(var i = 0; i < arguments[a].children.length; i++) {
							dom.appendChild($().createDOM(arguments[a].children[i]));
						}
					}
				}
			}
		}
		return dom;
	},
	append: function() {
		if(this[0] != document) {
			for(var i = 0; i < arguments.length; i++) {
				if(this[0].length > 1) {
					var arg = arguments[i];
					this.forEach(function(id,j) {
						this[j].appendChild($().createDOM(arg));
					}.bind(this[0]));
				} else {
					this[0][0].appendChild($().createDOM(arguments[i]));
				}
			}
		}
		return this;
	},
	prepend: function() {
		if(this[0] != document) {
			for(var i = (arguments.length - 1); i >= 0; i--) {
				if(this[0].length > 1) {
					var arg = arguments[i];
					this.forEach(function(id,j) {
						this[j].insertBefore($().createDOM(arg),this[j].firstChild);
					}.bind(this[0]));
				} else {
					this[0][0].insertBefore($().createDOM(arguments[i]),this[0][0].firstChild);
				}
			}
		}
		return this;
	},
	addBeforeIt: function() {
		if(this[0] != document) {
			for(var i = 0; i < arguments.length; i++) {
				if(this[0].length > 1) {
					var arg = arguments[i];
					this.forEach(function(id,j) {
						this[j].parentNode.insertBefore($().createDOM(arg),this[j]);
					}.bind(this[0]));
				} else {
					this[0][0].parentNode.insertBefore($().createDOM(arguments[i]),this[0][0]);
				}
			}
		}
		return this;
	},
	addAfterIt: function() {
		if(this[0] != document) {
			for(var i = 0; i < arguments.length; i++) {
				if(this[0].length > 1) {
					var arg = arguments[i];
					this.forEach(function(id,j) {
						this[j].parentNode.insertBefore($().createDOM(arg),this[j].nextSibling);
					}.bind(this[0]));
				} else {
					this[0][0].parentNode.insertBefore($().createDOM(arguments[i]),this[0][0].nextSibling);
				}
			}
		}
		return this;
	},
	clear: function() {
		if(this[0] != document) {
			if(arguments.length > 0) {
				for(var i = 0; i < arguments.length; i++) {
					var arg = arguments[i];
					this.forEach(function(id) {
						$("#" + id + " " + arg).remove();
					});
				}
			} else {
				this.forEach(function(id,j) {
					var el = this[j];
					while(el.firstChild) {
						el.removeChild(el.firstChild);
					}
				}.bind(this[0]));
			}
		}
		return this;
	},
	clone: function(depth) {
		if(this[0] != document) {
			if(depth == null) {
				return this[0][0].cloneNode(true);
			} else {
				return this[0][0].cloneNode(depth);
			}
		} else {
			return "undefined";
		}
	},
	remove: function() {
		if(this[0] != document) {
			this.forEach(function(id,j) {
				this[j].parentNode.removeChild(this[j]);
			}.bind(this[0]));
		}
		return this;
	},
	parentNode: function() {
		if(this[0] != document) {
			return $(this[0][0].parentNode);
		} else {
			return "undefined";
		}
	},
	firstChild: function() {
		if(this[0] != document) {
			return $(this[0][0].firstChild);
		} else {
			return "undefined";
		}
	},
	lastChild: function() {
		if(this[0] != document) {
			return $(this[0][0].lastChild);
		} else {
			return "undefined";
		}
	},
	nextSibling: function() {
		if(this[0] != document) {
			while(this[0][0] = this[0][0].nextSibling) {
				if(this[0][0].nodeType == 1) {
					return $(this[0][0]);
				}
			}
		} else {
			return "undefined";
		}
	},
	prevSibling: function() {
		if(this[0] != document) {
			while(this[0][0] = this[0][0].previousSibling) {
				if(this[0][0].nodeType == 1) {
					return $(this[0][0]);
				}
			}
		} else {
			return "undefined";
		}
	},
	//--------------- Визуальные эффекты ---------------
	changeIt: function(carr) {
		if(this[0] != document) {
			var fw = carr.width ? parseInt(carr.width.from) : null;
			var fh = carr.height ? parseInt(carr.height.from) : null;
			var ft = carr.transparence ? parseInt(carr.transparence.from) : null;
			var tw = carr.width ? parseInt(carr.width.to) : null;
			var th = carr.height ? parseInt(carr.height.to) : null;
			var tt = carr.transparence ? parseInt(carr.transparence.to) : null;
			var spW = carr.width ? parseInt(carr.width.speed) : null;
			var spH = carr.height ? parseInt(carr.height.speed) : null;
			var spT = carr.transparence ? parseInt(carr.transparence.speed) : null;
			var delay = carr.delay ? parseInt(carr.delay) : 10;
			var timer = "";
			var chW = false;
			var chH = false;
			var chT = false;
			var obj = this[0][0];
			this.css({overflow: "hidden"});
			if(this.css("display") == "none") {
				this.css({display: "block"});
			}
			var tid = this.attr("id");
			if((ft != null) && (tt != null) && (spT != null)) {
				this.transparence(ft ? ft : "100");
			}
			if((fw != null) && (tw != null) && (spW != null)) {
				this.css({width: carr.width.from});
				var neww = parseInt(carr.width.from);
			}
			if((fh != null) && (th != null) && (spH != null)) {
				this.css({height: carr.height.from});
				var newh = parseInt(carr.height.from);
			}
			var op = carr.transparence ? carr.transparence.from : "100";
			var newt = carr.transparence ? carr.transparence.from : 100;
			function change() {
				if((fw != null) && (tw != null) && (spW != null)) {
					if(fw > tw) {
						if(parseInt($("#" + tid).css("width")) > (tw + spW)) {
							neww = neww - spW;
							$("#" + tid).css({width: neww});
						} else if(parseInt($("#" + tid).css("width")) <= (tw + spW)) {
							$("#" + tid).css({width: tw});
							if(tw == "0") {
								$("#" + tid).css({display: "none"});
								chH = true;
								chT = true;
							}
							chW = true;
						}
					} else if(tw > fw) {
						if(parseInt($("#" + tid).css("width")) < (tw - spW)) {
							neww = neww + spW;
							$("#" + tid).css({width: neww});
						} else if(parseInt($("#" + tid).css("width")) >= (tw - spW)) {
							$("#" + tid).css({width: tw});
							chW = true;
						}
					}
				} else {
					chW = true;
				}
				if((fh != null) && (th != null) && (spH != null)) {
					if(fh > th) {
						if(parseInt($("#" + tid).css("height")) > (th + spH)) {
							newh = newh - spH;
							$("#" + tid).css({height: newh});
						} else if(parseInt($("#" + tid).css("height")) <= (th + spH)) {
							$("#" + tid).css({height: th});
							if(th == "0") {
								$("#" + tid).css({display: "none"});
								chW = true;
								chT = true;
							}
							chH = true;
						}
					} else if(th > fh) {
						if(parseInt($("#" + tid).css("height")) < (th - spH)) {
							newh = newh + spH;
							$("#" + tid).css({height: newh});
						} else if(parseInt($("#" + tid).css("height")) >= (th - spH)) {
							$("#" + tid).css({height: th});
							chH = true;
						}
					}
				} else {
					chH = true;
				}
				if((ft != null) && (tt != null) && (spT != null)) {
					if(ft > tt) {
        	  				if($("#" + tid).transparence() > tt) {
        	  					newt = newt - spT;
        	   					$("#" + tid).transparence(newt);
        	  				} else if(newt <= tt) {
        	  					$("#" + tid).transparence(tt);
							if(tt == "0") {
								$("#" + tid).css({display: "none"});
								chW = true;
								chH = true;
							}
        	    			chT = true;
        	  			}
					} else if(tt > ft) {
        	  			if($("#" + tid).transparence() < tt) {
        	  				newt = parseInt(newt) + spT;
        	   				$("#" + tid).transparence(newt);
        	  			} else if($("#" + tid).transparence() >= tt) {
        	  				$("#" + tid).transparence(tt);
        	    			chT = true;
        	  			}
					}
				} else {
					chT = true;
				}
				if(((fw != null) && (tw != null) && (spW != null)) || ((fh != null) && (th != null) && (spH != null)) || ((ft != null) && (tt != null) && (spT != null))) {
					if(carr.onChanging != null) {
						carr.onChanging();
					}
				}
				if((chW && chH && chT) || (!chW && fw == tw) || (!chH && fh == th) || (!chT && ft == tt)) {
					clearInterval(timer);
					if(carr.onChanged != null) {
						carr.onChanged();
					}
					for(var t = 0; t < __globalActions.length; t++) {
						if(__globalActions[t].obj == obj && __globalActions[t].tmr == timer && __globalActions[t].type == "changing") {
							__globalActions.splice(t,1);
							break;
						}
					}
				}
			}
			if(carr.onStart != null) {
				carr.onStart();
			}
			timer = setInterval(change,delay);
			__globalActions.push({
				obj: obj,
				tmr: timer,
				type: "changing"
			});
		}
		return this;
	},
	moveIt: function(marr) {
		if(this[0] != document) {
			this.css({position: "absolute"});
			if(this.css("display") == "none") {
				this.css({display: "block"});
			}
			var tsp = parseInt(marr.speed);
			var x1 = parseInt(marr.from.x);
			var y1 = parseInt(marr.from.y);
			var x2 = parseInt(marr.to.x);
			var y2 = parseInt(marr.to.y);
			var delay = marr.delay ? parseInt(marr.delay) : 10;
			this.x(x1).y(y1);
			var difX = x2 - x1;
			var difY = y2 - y1;
			var x = x1;
			var y = y1;
			var tm = "";
			var tid = this.attr("id");
			var obj = this[0][0];
			function stopIt(obj,tm) {
				for(var t = 0; t < __globalActions.length; t++) {
					if(__globalActions[t].obj == obj && __globalActions[t].tmr == tm && __globalActions[t].type == "moving") {
						__globalActions.splice(t,1);
						break;
					}
				}
			}
			if(marr.onStart != null) {
				marr.onStart();
			}
			if(difX == 0) {
				function moveIt1() {
					if(y1 < y2) {
						if(y < y2) {
							$("#" + tid).y(y);
							y += tsp;
						} else if(y >= y2) {
							clearInterval(tm);
							$("#" + tid).x(x2).y(y2);
							if(marr.onMoved != null) {
								marr.onMoved();
							}
							stopIt(obj,tm);
						}
					} else if(y1 > y2) {
						if(y > y2) {
						$("#" + tid).y(y);
							y -= tsp;
						} else if(y <= y2) {
							clearInterval(tm);
							$("#" + tid).x(x2).y(y2);
							if(marr.onMoved != null) {
								marr.onMoved();
							}
							stopIt(obj,tm);
						}
					}
					if(marr.onMoving != null) {
						marr.onMoving();
					}
				}
				tm = setInterval(moveIt1,delay);
			} else if(difY == 0) {
				function moveIt2() {
					if(x1 < x2) {
						if(x < x2) {
							$("#" + tid).x(x);
							x += tsp;
						} else if(x >= x2) {
							clearInterval(tm);
							$("#" + tid).x(x2).y(y2);
							if(marr.onMoved != null) {
								marr.onMoved();
							}
							stopIt(obj,tm);
						}
					} else if(x1 > x2) {
						if(x > x2) {
							$("#" + tid).x(x);
							x -= tsp;
						} else if(x <= x2) {
							clearInterval(tm);
							$("#" + tid).x(x2).y(y2);
							if(marr.onMoved != null) {
								marr.onMoved();
							}
							stopIt(obj,tm);
						}
					}
					if(marr.onMoving != null) {
						marr.onMoving();
					}
				}
				tm = setInterval(moveIt2,delay);
			} else if(Math.abs(difX) > Math.abs(difY)) {
				function moveIt3() {
					if(x1 < x2) {
						if(x < x2) {
							x += tsp;
							y = ((y2 - y1)*(x - x1)) / (x2 - x1) + y1;
							$("#" + tid).x(x).y(y);
						} else if(x >= x2) {
							clearInterval(tm);
							$("#" + tid).x(x2).y(y2);
							if(marr.onMoved != null) {
								marr.onMoved();
							}
							stopIt(obj,tm);
						}
					} else if(x1 > x2) {
						if(x > x2) {
							x -= tsp;
							y = ((y2 - y1)*(x - x1)) / (x2 - x1) + y1;
							$("#" + tid).x(x).y(y);
						} else if(x <= x2) {
							clearInterval(tm);
							$("#" + tid).x(x2).y(y2);
							if(marr.onMoved != null) {
								marr.onMoved();
							}
							stopIt(obj,tm);
						}
					}
					if(marr.onMoving != null) {
						marr.onMoving();
					}
				}
				tm = setInterval(moveIt3,delay);
			} else if(Math.abs(difX) < Math.abs(difY)) {
				function moveIt4() {
					if(y1 < y2) {
						if(y < y2) {
							y += tsp;
							x = ((x2 - x1)*(y - y1) + x1 * (y2 - y1)) / (y2 - y1);
							$("#" + tid).x(x).y(y);
						} else if(y >= y2) {
							clearInterval(tm);
							$("#" + tid).x(x2).y(y2);
							if(marr.onMoved != null) {
								marr.onMoved();
							}
							stopIt(obj,tm);
						}
					} else if(y1 > y2) {
						if(y > y2) {
							y -= tsp;
							x = ((x2 - x1)*(y - y1) + x1 * (y2 - y1)) / (y2 - y1);
							$("#" + tid).x(x).y(y);
						} else if(y <= y2) {
							clearInterval(tm);
							$("#" + tid).x(x2).y(y2);
							if(marr.onMoved != null) {
								marr.onMoved();
							}
							stopIt(obj,tm);
						}
					}
					if(marr.onMoving != null) {
						marr.onMoving();
					}
				}
				tm = setInterval(moveIt4,delay);
			} else if(Math.abs(difX) == Math.abs(difY)) {
				function moveIt5() {
					if(x1 < x2) {
						if(x < x2) {
							x += tsp;
							y += tsp;
							$("#" + tid).x(x).y(y);
						} else if(x >= x2) {
							clearInterval(tm);
							$("#" + tid).x(x2).y(y2);
							if(marr.onMoved != null) {
								marr.onMoved();
							}
							stopIt(obj,tm);
						}
					} else if(x1 > x2) {
						if(x > x2) {
							x -= tsp;
							y -= tsp;
							$("#" + tid).x(x).y(y);
						} else if(x <= x2) {
							clearInterval(tm);
							$("#" + tid).x(x2).y(y2);
							if(marr.onMoved != null) {
								marr.onMoved();
							}
							stopIt(obj,tm);
						}
					}
					if(marr.onMoving != null) {
						marr.onMoving();
					}
				}
				tm = setInterval(moveIt5,delay);
			}
			__globalActions.push({
				obj: this[0][0],
				tmr: tm,
				type: "moving"
			});
		}
		return this;
	},
	dragIt: function(ddarr) {
		if(this[0] != document) {
			var flag = true;
			var difX = 5;
			var difY = 5;
			var glid = "";
			var tid = this.attr("id");
			var drX = ddarr.dragX;
			var drY = ddarr.dragY;
			if(ddarr.maxX != null) {
				$("#" + tid).attr({maxX: parseInt(ddarr.maxX)});
			}
			if(ddarr.maxY != null) {
				$("#" + tid).attr({maxY: parseInt(ddarr.maxY)});
			}
			if(ddarr.minX != null) {
				$("#" + tid).attr({minX: parseInt(ddarr.minX)});
			}
			if(ddarr.minY != null) {
				$("#" + tid).attr({minY: parseInt(ddarr.minY)});
			}
			$("#" + tid).addEvent("mousedown",function(evt) {
				if($("#" + tid).css("position") != "absolute") {
					$("#" + tid).css({
						position: "absolute",
						top: $("#" + tid).y(),
						left: $("#" + tid).x()
					});
				}
				if(ddarr.onClicked != null) {
					ddarr.onClicked();
				}
				difX = $().x(evt) - $("#" + tid).x();
				difY = $().y(evt) - $("#" + tid).y();
				flag = true;
				if(typeof document.body.onselectstart != "undefined") {
					$(document.body).addEvent("selectstart",function() {
						return false;
					});
				} else if(typeof document.body.style.MozUserSelect != "undefined") {
					document.body.style.MozUserSelect = "none";
				} else {
					$(document.body).addEvent("mousedown",function() {
						return false;
					});
				}
				$(document).addEvent("mousemove",function(evt) {
					if(flag) {
						if(drX == true) {
							if($("#" + tid).attr("maxX") && !$("#" + tid).attr("minX")) {
								if(($().x(evt) - difX) <= $("#" + tid).attr("maxX")) $("#" + tid).x($().x(evt) - difX);
							} else if(!$("#" + tid).attr("maxX") && $("#" + tid).attr("minX")) {
								if(($().x(evt) - difX) >= $("#" + tid).attr("minX")) $("#" + tid).x($().x(evt) - difX);
							} else if($("#" + tid).attr("maxX") && $("#" + tid).attr("minX")) {
								if(($().x(evt) - difX) >= $("#" + tid).attr("minX") && ($().x(evt) - difX) <= $("#" + tid).attr("maxX")) $("#" + tid).x($().x(evt) - difX);
							} else {
								$("#" + tid).x($().x(evt) - difX);
							}
						}
						if(drY == true) {
							if($("#" + tid).attr("maxY") && !$("#" + tid).attr("minY")) {
								if(($().y(evt) - difY) <= $("#" + tid).attr("maxY")) $("#" + tid).y($().y(evt) - difY);
							} else if(!$("#" + tid).attr("maxY") && $("#" + tid).attr("minY")) {
								if(($().y(evt) - difY) >= $("#" + tid).attr("minY")) $("#" + tid).y($().y(evt) - difY);
							} else if($("#" + tid).attr("maxY") && $("#" + tid).attr("minY")) {
								if(($().y(evt) - difY) >= $("#" + tid).attr("minY") && ($().y(evt) - difY) <= $("#" + tid).attr("maxY")) $("#" + tid).y($().y(evt) - difY);
							} else {
								$("#" + tid).y($().y(evt) - difY);
							}
						}
						if(ddarr.onDragging != null) {
							ddarr.onDragging();
						}
					}
				});
				$(document).addEvent("mouseup",function() {
					flag = false;
					if(typeof document.body.onselectstart != "undefined") {
						$(document.body).addEvent("selectstart",function() {
							return true;
						});
					} else if(typeof document.body.style.MozUserSelect != "undefined") {
						document.body.style.MozUserSelect = "";
					} else {
						$(document.body).addEvent("mousedown",function() {
							return true;
						});
					}
					if(ddarr.onDropped != null) {
						ddarr.onDropped();
					}
					$(document).addEvent("mouseup",function() {
						return true;
					});
				});
			});
		}
		return this;
	},
	transparence: function(method) {
		var opElem = "undefined";
		if(document.body.filters) {
			opElem = "filter";
		} else if(typeof document.body.style.MozOpacity == "string") {
			opElem = "MozOpacity";
		} else if(typeof document.body.style.KhtmlOpacity == "string") {
			opElem = "KhtmlOpacity";
		} else if(typeof document.body.style.opacity == "string") {
			opElem = "opacity";
		}
		if(this[0] == document) {
			return opElem;
		} else {
			if(method == null) {
				if(opElem != "filter") {
					return parseInt(parseFloat(this.css(opElem)) * 100);
				} else {
					return parseInt(this.attr("transparence"));
				}
			} else {
				if(opElem != "filter") {
					if(opElem == "MozOpacity") {
						this.css({MozOpacity: parseInt(method) / 100});
					} else if(opElem == "KhtmlOpacity") {
						this.css({KhtmlOpacity: parseInt(method) / 100});
					} else if(opElem == "opacity") {
						this.css({opacity: parseInt(method) / 100});
					}
				} else {
					this.css({filter: "progid:DXImageTransform.Microsoft.Alpha(opacity=" + parseInt(method) + ")"}).attr({transparence: parseInt(method)});
				}
				return this;
			}
		}
	},
	setShadow: function(clr,alp,sp) {
		if(!$("#shd").arr(0)) {
			$("body").prepend({
				tag: "div",
				id: "shd",
				css: {
					position: "absolute",
					display: "none",
					"z-index": "50"
				}
			});
		}
		$("#shd").css({"background-color": clr}).transparence(alp);
		var xScroll, yScroll, windowWidth, windowHeight;
		if(window.innerHeight && window.scrollMaxY) {
			xScroll = document.body.scrollWidth;
			yScroll = window.innerHeight + window.scrollMaxY;
		} else if(document.body.scrollHeight > document.body.offsetHeight) {
			xScroll = document.body.scrollWidth;
			yScroll = document.body.scrollHeight;
		} else {
			xScroll = document.body.offsetWidth;
			yScroll = document.body.offsetHeight;
		}
		if(self.innerHeight) {
			windowWidth = self.innerWidth;
			windowHeight = self.innerHeight;
		} else if(document.documentElement && document.documentElement.clientHeight) {
			windowWidth = document.documentElement.clientWidth;
			windowHeight = document.documentElement.clientHeight;
		} else if(document.body) {
			windowWidth = document.body.clientWidth;
			windowHeight = document.body.clientHeight;
		}
		if(yScroll < windowHeight) {
			pageHeight = windowHeight;
		} else {
			pageHeight = yScroll;
		}
		if(xScroll < windowWidth) {
			pageWidth = windowWidth;
		} else {
			pageWidth = xScroll;
		}
		$("#shd").x("0").y("0").css({
			width: pageWidth,
			height: pageHeight
		});
		var shTm = "";
		if(sp != null) {
			$("#shd").changeIt({
				transparence: {
					from: "1",
					to: alp,
					speed: sp
				},
				onChanged: function() {
					$(window).addEvent("scroll",function() {
						$("#shd").css({
							height: pageHeight + document.body.scrollTop + "px"
						});
					});
				}
			});
		} else {
			$("#shd").css({display: "block"}).transparence(alp);
			$(window).addEvent("scroll",function() {
				$("#shd").css({
					height: pageHeight + document.body.scrollTop + "px"
				});
			});
		}
		return this;
	},
	hideShadow: function(sp) {
		if(sp != null) {
			$("#shd").stop().changeIt({
				transparence: {
					from: $("#shd").transparence(),
					to: "0",
					speed: sp
				}
			});
		} else {
			$("#shd").css({display: "none"});
		}
		$(window).removeEvent("scroll");
		return this;
	},
	title: function(msg,style,transp,timeout) {
		if(this[0] != document) {
			if(!$("#title").arr(0)) {
				$("body").append({
					tag: "div",
					id: "title"
				});
				$("#title").css({
					position: "absolute",
					display: "none",
					top: "-50px",
					left: "-50px",
					"z-index": "150"
				});
			}
			$("#title").css(style);
			var timer = "";
			this.forEach(function(id) {
				$("#" + id).addEvent("mouseover",function(evt) {
					$(document).addEvent("mousemove",function(evt) {
						$("#title").x($().x(evt) + 15).y($().y(evt) + 15);
					});
					timer = setTimeout(function() {
						$("#title").stop("changing").css({display: "none"}).html(msg).changeIt({
							transparence: {
								from: "1",
								to: transp,
								speed: "10"
							}
						});
					},timeout ? timeout : 1000);
				});
				$("#" + id).addEvent("mouseout",function() {
					clearTimeout(timer);
					$("#title").stop("changing").changeIt({
						transparence: {
							from: $("#title").transparence(),
							to: "0",
							speed: "10"
						}
					});
				});
			});
		}
		return this;
	},
	accordion: function(scarr) {
		var argsN = [];
		var an = 0;
		for(n in scarr) {
			argsN[an] = n;
			an++;
		}
		var ch = false;
		for(var i = 0; i < an; i++) {
			$("#" + scarr[argsN[i]].objId).css({overflow: "hidden"});
			if(scarr[argsN[i]].width) {
				$("#" + scarr[argsN[i]].objId).css({width: scarr[argsN[i]].width.min});
			}
			if(scarr[argsN[i]].height) {
				$("#" + scarr[argsN[i]].objId).css({height: scarr[argsN[i]].height.min});
			}
			if(scarr[argsN[i]].transparence) {
				$("#" + scarr[argsN[i]].objId).transparence(scarr[argsN[i]].transparence.min);
			}
			if((scarr[argsN[i]].width && scarr[argsN[i]].width.min == "0") || (scarr[argsN[i]].height && scarr[argsN[i]].height.min == "0") || (scarr[argsN[i]].transparence && scarr[argsN[i]].transparence.min == "0")) {
				$("#" + scarr[argsN[i]].objId).css({display: "none"});
			}
			var te = scarr[argsN[i]].event ? scarr[argsN[i]].event : "click";
			$("#" + argsN[i]).addEvent(te,function() {
				if(!ch) {
					for(var j = 0; j < an; j++) {
						if(this == argsN[j]) {
							var w = scarr[this].width ? parseInt($("#" + scarr[this].objId).css("width")) : null;
							var h = scarr[this].height ? parseInt($("#" + scarr[this].objId).css("height")) : null;
							var t = scarr[this].transparence ? parseInt($("#" + scarr[this].objId).transparence()) : null;
							var minw = scarr[this].width ? parseInt(scarr[this].width.min) : null;
							var minh = scarr[this].height ? parseInt(scarr[this].height.min) : null;
							var mint = scarr[this].transparence ? parseInt(scarr[this].transparence.min) : null;
							var delay = scarr[this].delay ? parseInt(scarr[this].delay) : 10;
							$("#" + scarr[this].objId).attr({
								mint: (mint != null) ? "true" : "false",
								minw: (minw != null) ? "true" : "false",
								minh: (minh != null) ? "true" : "false",
								mintv: mint,
								minwv: minw,
								minhv: minh
							});
							if(w != minw || h != minh || t != mint) {
								ch = true;
								$("#" + scarr[this].objId).changeIt({
									width: (scarr[this].width ? {
										from: scarr[this].width.max,
										to: scarr[this].width.min,
										speed: scarr[this].width.speed
									} : null),
									height: (scarr[this].height ? {
										from: scarr[this].height.max,
										to: scarr[this].height.min,
										speed: scarr[this].height.speed
									} : null),
									transparence: (scarr[this].transparence ? {
										from: scarr[this].transparence.max,
										to: scarr[this].transparence.min,
										speed: scarr[this].transparence.speed
									} : null),
									delay: delay,
									onChanged: function() {
										ch = false;
										if($("#" + this).attr("minw") != "false" && parseInt($("#" + this).css("width")) != parseInt($("#" + this).attr("minwv"))) {
											$("#" + this).css({width: $("#" + this).attr("minwv")});
										}
										if($("#" + this).attr("minh") != "false" && parseInt($("#" + this).css("height")) != parseInt($("#" + this).attr("minhv"))) {
											$("#" + this).css({height: $("#" + this).attr("minhv")});
										}
										if($("#" + this).attr("mint") != "false" && parseInt($("#" + this).transparence()) != parseInt($("#" + this).attr("mintv"))) {
											$("#" + this).transparence($("#" + this).attr("mintv"));
										}
									}.bind(scarr[this].objId)
								});
							} else {
								ch = true;
								$("#" + scarr[this].objId).changeIt({
									width: (scarr[this].width ? {
										from: scarr[this].width.min,
										to: scarr[this].width.max,
										speed: scarr[this].width.speed
									} : null),
									height: (scarr[this].height ? {
										from: scarr[this].height.min,
										to: scarr[this].height.max,
										speed: scarr[this].height.speed
									} : null),
									transparence: (scarr[this].transparence ? {
										from: parseInt(scarr[this].transparence.min) == 0 ? 1 : scarr[this].transparence.min,
										to: scarr[this].transparence.max,
										speed: scarr[this].transparence.speed
									} : null),
									delay: delay,
									onChanged: function() {
										ch = false;
									}
								});
							}
						} else {
							var w = scarr[argsN[j]].width ? parseInt($("#" + scarr[argsN[j]].objId).css("width")) : null;
							var h = scarr[argsN[j]].height ? parseInt($("#" + scarr[argsN[j]].objId).css("height")) : null;
							var t = scarr[argsN[j]].transparence ? parseInt($("#" + scarr[argsN[j]].objId).transparence()) : null;
							var minw = scarr[argsN[j]].width ? parseInt(scarr[argsN[j]].width.min) : null;
							var minh = scarr[argsN[j]].height ? parseInt(scarr[argsN[j]].height.min) : null;
							var mint = scarr[argsN[j]].transparence ? parseInt(scarr[argsN[j]].transparence.min) : null;
							var delay = scarr[argsN[j]].delay ? parseInt(scarr[argsN[j]].delay) : 10;
							$("#" + scarr[argsN[j]].objId).attr({
								mint: (mint != null) ? "true" : "false",
								minw: (minw != null) ? "true" : "false",
								minh: (minh != null) ? "true" : "false",
								mintv: mint,
								minwv: minw,
								minhv: minh
							});
							if(w != minw || h != minh || t != mint) {
								ch = true;
								$("#" + scarr[argsN[j]].objId).changeIt({
									width: (scarr[argsN[j]].width ? {
										from: scarr[argsN[j]].width.max,
										to: scarr[argsN[j]].width.min,
										speed: scarr[argsN[j]].width.speed
									} : null),
									height: (scarr[argsN[j]].height ? {
										from: scarr[argsN[j]].height.max,
										to: scarr[argsN[j]].height.min,
										speed: scarr[argsN[j]].height.speed
									} : null),
									transparence: (scarr[argsN[j]].transparence ? {
										from: scarr[argsN[j]].transparence.max,
										to: scarr[argsN[j]].transparence.min,
										speed: scarr[argsN[j]].transparence.speed
									} : null),
									delay: delay,
									onChanged: function() {
										ch = false;
										if($("#" + this).attr("minw") != "false" && parseInt($("#" + this).css("width")) != parseInt($("#" + this).attr("minwv"))) {
											$("#" + th).css({width: $("#" + this).attr("minwv")});
										}
										if($("#" + this).attr("minh") != "false" && parseInt($("#" + this).css("height")) != parseInt($("#" + this).attr("minhv"))) {
											$("#" + this).css({height: $("#" + this).attr("minhv")});
										}
										if($("#" + this).attr("mint") != "false" && parseInt($("#" + this).transparence()) != parseInt($("#" + this).attr("mintv"))) {
											$("#" + this).transparence($("#" + this).attr("mintv"));
										}
									}.bind(scarr[argsN[j]].objId)
								});
							}
						}
					} 
				}
				return false;
			}.bind(argsN[i]));
		}
		return this;
	},
	addTabs: function(tarr) {
		if(this[0] != document) {
			var argsN = [];
			var an = 0;
			for(n in tarr) {
				argsN[an] = n;
				an++;
			}
			var oldtab = argsN[0];
			var ch = false;
			this.css({overflow: "hidden"}).attr({tabId: argsN[0]}).html(tarr[argsN[0]].content);
			var tabWin = this.attr("id");
			for(var i = 0; i < an; i++) {
				var te = tarr[argsN[i]].event ? tarr[argsN[i]].event : "click";
				var tid = this.attr("id");
				$("#" + argsN[i]).addEvent(te,function() {
					if(!ch) {
						if($("#" + tabWin).attr("tabId") != this) {
							var tabid = tid;
							var thid = this;
							ch = true;
							if(tarr[oldtab].onStartClosing != null) {
								tarr[oldtab].onStartClosing();
							}
							$("#" + tabid).changeIt({
								width: (tarr[thid].width ? {
									from: tarr[thid].width,
									to: "0",
									speed: tarr[thid].speed
								} : null),
								height: (tarr[thid].height ? {
									from: tarr[thid].height,
									to: "0",
									speed: tarr[thid].speed
								} : null),
								transparence: (tarr[thid].transparence ? {
									from: tarr[thid].transparence,
									to: "0",
									speed: tarr[thid].speed
								} : null),
								delay: tarr[thid].delay,
								onChanging: function() {
									if(tarr[oldtab].onClosing != null) {
										tarr[oldtab].onClosing();
									}
								},
								onChanged: function() {
									if(tarr[oldtab].onClosed != null) {
										tarr[oldtab].onClosed();
									}
									if(tarr[thid].onStartOpening != null) {
										tarr[thid].onStartOpening();
									}
									oldtab = thid;
									$("#" + tabid).changeIt({
										width: (tarr[thid].width ? {
											from: "1",
											to: tarr[thid].width,
											speed: tarr[thid].speed
										} : null),
										height: (tarr[thid].height ? {
											from: "1",
											to: tarr[thid].height,
											speed: tarr[thid].speed
										} : null),
										transparence: (tarr[thid].transparence ? {
											from: "1",
											to: tarr[thid].transparence,
											speed: tarr[thid].speed
										} : null),
										delay: tarr[thid].delay,
										onChanging: function() {
											if(tarr[thid].onOpening != null) {
												tarr[thid].onOpening();
											}
										},
										onChanged: function() {
											ch = false;
											if(tarr[thid].onOpened != null) {
												tarr[thid].onOpened();
											}
										}
									});
									$("#" + tabid).html(tarr[thid].content);
								}
							});
						}
					}
					$("#" + tabWin).attr({tabId: this});
					return false;
				}.bind(argsN[i]));
			}
		}
		return this;
	},
	lightbox: function(index) {
		if(this[0] != document) {
			var pics = [];
			var objs = [];
			var hrefs = [];
			var num = this.len();
			this.forEach(function(id,j) {
				if(index == null) var index = j;
				pics[index] = new Image();
				objs.push(id);
				hrefs.push($("#" + id).attr("href"));
				$(this[index]).removeEvent("click").addEvent("click",function(e) {
					e = e || window.event;
					$().setShadow("#000000","75","5");
					if(!$("#lightbox").arr(0)) {
						$("body").append({
							tag: "div",
							id: "lightbox",
							children: [{
								tag: "div",
								id: "lb_content",
								css: {
									position: "relative",
									"text-align": "center"
								},
								children: [{
									tag: "img",
									id: "lb_prev",
									attr: {
										src: "./slge/arrow-prev.gif",
										alt: "Предыдущая",
										width: "30",
										height: "30"
									},
									css: {
										display: "none",
										position: "absolute",
										left: "0px",
										bottom: "3px"
									}
								},{
									tag: "img",
									id: "lb_next",
									attr: {
										src: "./slge/arrow-next.gif",
										alt: "Следующая",
										width: "30",
										height: "30"
									},
									css: {
										display: "none",
										position: "absolute",
										right: "0px",
										bottom: "3px"
									}
								}]
							},{
								tag: "div",
								id: "lb_title"
							}]
						});
					}
					$("#lightbox").css({
						width: "100px",
						height: "100px",
						display: "block",
						"background-color": "#cccccc",
						border: "1px solid #000000",
						"z-index": "100"
					}).x((screen.width - 100) / 2).y(50);
					$("#shd").removeEvent("click").addEvent("click",function() {
						$().hideShadow("5");
						$("#lightbox").stop("changing").remove();
					});
					$("#lb_content").css({"text-align": "center"});
					if(!$("#loader").arr(0)) {
						$("#lb_content").append({
							tag: "img",
							id: "loader",
							attr: {src: "./slge/ajax-loader.gif"},
							css: {"margin-top": "17px"}
						});
					}
					function view(id,index) {
						var picTitle = $("#" + id).attr("title");
						var timer = setInterval(function() {
							if(pics[index].complete) {
								clearInterval(timer);
								var width = pics[index].width;
								var height = pics[index].height;
								$("#loader").css({display: "none"});
								$("#lightbox").changeIt({
									width: {
										from: parseInt($("#lightbox").css("width")),
										to: width + 12,
										speed: "15"
									},
									onChanging: function() {
										$("#lightbox").x((screen.width - parseInt($("#lightbox").css("width"))) / 2);
									},
									onChanged: function() {
										$("#lightbox").changeIt({
											height: {
												from: parseInt($("#lightbox").css("height")),
												to: height + 12,
												speed: "15"
											},
											onChanged: function() {
												$("#lb_content").css({
													width: width,
													height: height,
													margin: "6px"
												}).append({
													tag: "img",
													id: "lb_pic",
													attr: {src: pics[index].src},
													css: {display: "none"}
												});
												$("#lb_pic").changeIt({
													transparence: {
														from: "1",
														to: "100",
														speed: "5"
													},
													onChanged: function() {
														$("#lightbox").changeIt({
															height: {
																from: parseInt($("#lightbox").css("height")),
																to: parseInt($("#lightbox").css("height")) + 40,
																speed: "2"
															}
														});
														$("#lb_prev","#lb_next").css({display: "block"}).transparence("75");
														if((index + 1) == num) $("#lb_next").css({display: "none"});
														if((index + 1) == 1) $("#lb_prev").css({display: "none"});
														$("#lb_prev").removeEvent("click").addEvent("click",function() {
															chPic(index - 1);
														});
														$("#lb_next").removeEvent("click").addEvent("click",function() {
															chPic(index + 1);
														});
														$("#lb_title").css({
															height: "40px",
															"font-family": "Verdana",
															"font-size": "16px",
															"padding-top": "5px",
															"text-align": "center"
														}).html("<span style=\"font-weight: bolder;\">" + picTitle + "</span>" + (num != 1 ? (" (" + (index + 1) + " / " + num + ")") : ""));
													}
												});
											}
										});
									}
								});
							}
						},10);
						pics[index].setAttribute("src",$("#" + id).attr("href"));
					}
					view(id,index);
					function chPic(ind) {
						pics[ind].setAttribute("src",hrefs[ind]);
						$("#lightbox").stop("changing").changeIt({
							height: {
								from: parseInt($("#lightbox").css("height")),
								to: parseInt($("#lightbox").css("height")) - 40,
								speed: "2"
							},
							onChanged: function() {
								$("#lb_title").html("");
								$("#loader").css({
									display: "block",
									position: "absolute",
									top: (parseInt($("#lightbox").css("height")) - 66) / 2,
									left: (parseInt($("#lightbox").css("width")) - 66) / 2
								});
								$("#lb_pic").changeIt({
									transparence: {
										from: "100",
										to: "0",
										speed: "5"
									},
									onChanged: function() {
										$("#lb_pic").remove();
										view(objs[ind],ind);
									}
								});
								$("#lb_prev","#lb_next").css({display: "none"});
							}
						});
					}
					if(typeof e.preventDefault != "undefined") e.preventDefault();
					return false;
				});
			}.bind(this[0]));
		}
		return this;
	},
	//--------------- Работа с AJAX ---------------
	ajaxIt: function(ajaxdarr) {
		var jsRequest = null;
		try {
			jsRequest = new XMLHttpRequest();
		} catch(trymicrosoft) {
			try {
				jsRequest = new ActiveXObject("Msxml2.XMLHTTP");
			} catch(othermicrosoft) {
				try {
					jsRequest = new ActiveXObject("Microsoft.XMLHTTP");
				} catch(failed) {
					jsRequest = null;
				}
			}
		}
		if(jsRequest != null) {
			if(ajaxdarr.url != "" || ajaxdarr.method != "" || ajaxdarr.usersActivity != "") {
				if(ajaxdarr.method.toUpperCase() == "GET" || ajaxdarr.method.toUpperCase() == "POST") {
					var url = ajaxdarr.url;
					var method = ajaxdarr.method.toUpperCase();
					var usersActivity = ajaxdarr.usersActivity ? ajaxdarr.usersActivity : true;
					var pn = 0;
					for(var p in ajaxdarr.params) {
						url += ((pn == 0) ? "?" : "&") + p + "=" + encodeURIComponent(ajaxdarr.params[p]);
						pn++;
					}
					if(method == "GET") {
						url += ((url.indexOf("?") == -1) ? "?" : "&") + "nocache=" + new Date().getTime();
					}
					jsRequest.open(method,url,usersActivity);
					jsRequest.onreadystatechange = function() {
						if(jsRequest.readyState == 4) {
							if(jsRequest.status == 200) {
								if(ajaxdarr.onSuccess != null) {
									ajaxdarr.onSuccess(jsRequest);
								}
							} else {
								var message = jsRequest.getResponseHeader("Status");
								if(message == null || message.length <= 0) {
									if(ajaxdarr.onError != null) {
										ajaxdarr.onError(jsRequest);
									} else {
										var errm = "Ошибка Ajax-запроса #" + jsRequest.status;
										switch(jsRequest.status) {
											case 0:
												errm += "\nОтсутствует соединение с сервером";
												break;
											case 404:
												errm += "\nОтсутствует принимающий скрипт на сервере";
												break;
											case 403:
												errm += "\nДоступ к серверу запрещён";
												break;
											case 500:
												errm += "\nОшибка сервера, свяжитесь с администратором";
												break;
										}
										alert(errm);
									}
								} else {
									if(ajaxdarr.onError != null) {
										ajaxdarr.onError(jsRequest);
									} else {
										alert("Ошибка Ajax-запроса: " + message);
									}
								}
							}
						}
					}
					var data = null;
					if(ajaxdarr.data != "" || ajaxdarr.data != null) {
						data = ajaxdarr.data;
						if(method == "POST") {
							if(ajaxdarr.dataType != "" || ajaxdarr.dataType != null) {
								jsRequest.setRequestHeader("Content-Type",ajaxdarr.dataType);
							} else {
								jsRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
							}
						}
					}
					jsRequest.send(data);
				}
			}
		} else {
			if(ajaxdarr.onError != null) {
				ajaxdarr.onError(jsRequest);
			} else {
				alert("Ошибка создания Ajax-запроса");
			}
		}
		return this;
	}
};