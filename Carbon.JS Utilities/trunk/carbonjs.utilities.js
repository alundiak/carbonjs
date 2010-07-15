/**
 * Carbon.JS - A simple JavaScript framework
 *
 * Carbon.JS Utilities Module - Common functions
 *
 * @author		Dmitry Polyuhov <admin@carbonjs.com>
 * @license		http://carbonjs.com/mit-license.txt
 * @version		1.1.0 (build 20100716)
 */

/**
 * This means that this module was connected to the document by loadModule or by script-tag
 */  
CarbonJS.modules.utilities = true;

/**
 * The definition of browsers
 */
CarbonJS.Browsers = {
	IE: function() {
		return ("\v" == "v"); // Срабатывает только в Internet Explorer
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
CarbonJS.service.events = []; // Все установленные обработчики событий записываются сюда

/**
 * Garbage collector, erase the event-handlers of selected elements in order to avoid memory leaks
 */
(function() {
	function removeEventHandlers() { // Чтобы избежать утечек памяти во всеми любимом браузере, удаляем вручную все установленные обработчики событий
		while (CarbonJS.service.events.length > 0) Q(CarbonJS.service.events[0].obj).removeEvent(CarbonJS.service.events[0].evt);
	}
	var oldfunc = window.onunload;
	if (typeof window.onunload != "function") {
		window.onunload = removeEventHandlers;
	} else {
		window.onunload = function() {
			oldfunc();
			removeEventHandlers();
		}
	}
})();

/**
 * Cache of elements, which display-property was changed
 */
CarbonJS.service.displayCache = {};

/**
 * Checking the visibility of the element
 * @param {Node} elem
 */
CarbonJS.service.elemIsHidden = function(elem) {
	var width = elem.offsetWidth, height = elem.offsetHeight, tr = elem.nodeName.toLowerCase() === "tr";
	return width === 0 && height === 0 && !tr ? true : width > 0 && height > 0 && !tr ? false : Q(elem).css("display");
}

CarbonJS.extend({
	
	/**
	 * This function may get and set the parameters of selected elements
	 * @param {Object} attrs The list of attributes and their values
	 * @return {String, NodeList}
	 */
	attr: function(attrs) {
		if (typeof attrs == "object") {
			this.forEach(function() {
				for (var n in attrs) this[n] = attrs[n];
			});
			return this;
		} else if (typeof attrs == "string") {
			return this[0][attrs];
		}
	},
	
	/**
	 * This function may get and set the css-styles of selected elements
	 * @param {Object} attrs The list of css-attributes and their values
	 * @return {String, NodeList}
	 */
	css: function(attrs) {
		var cur;
		if (typeof attrs == "object") {
			this.forEach(function() {
				for (n in attrs) {
					cur = n;
					n = n.replace(/\-(\w)/g, function() { // Переводим css-свойства, записанные в обычном виде, в формат interCap
						return arguments[1].toUpperCase();
					});
					if (n == "float") { // Следует помнить, что css-свойству float в JavaScript в IE соответствует styleFloat, а в остальных браузерах - cssFloat
						this.style[(typeof document.body.style.cssFloat == "string") ? "cssFloat" : "styleFloat"] = attrs[cur];
					} else if (n == "opacity") { // Устанавливаем кросс-браузерную прозрачность для элементов
						var val = parseFloat(attrs[cur]);
						if (typeof document.body.style.opacity == "string") this.style.opacity = val;
						if (document.body.filters) this.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=" + (val * 100) + ")";
						if (typeof document.body.style.MozOpacity == "string") this.style.MozOpacity = val;
						if (typeof document.body.style.KhtmlOpacity == "string") this.style.KhtmlOpacity = val;
					} else {
						this.style[n] = attrs[cur];
					}
				}
			});
			return this;
		} else if (typeof attrs == "string") {
			cur = attrs;
			cur = cur.replace(/\-(\w)/g, function() {
				return arguments[1].toUpperCase();
			});
			if (cur == "float") cur = (typeof document.body.style.cssFloat == "string") ? "cssFloat" : "styleFloat";
			if (cur == "opacity") {
				if (typeof document.body.style.opacity == "string") return this[0].style["opacity"];
				if (document.body.filters) return this[0].filters["DXImageTransform.Microsoft.Alpha"].opacity / 100;
				if (typeof document.body.style.MozOpacity == "string") return this[0].style["MozOpacity"];
				if (typeof document.body.style.KhtmlOpacity == "string") return this[0].style["KhtmlOpacity"];
			}
			if (window.getComputedStyle) { // Используем этот метод для Firefox, чтобы можно было получить css-свойство, записанное в подключаемом к странице файле со стилями
				return window.getComputedStyle(this[0], null)[cur];
			} else { // Для других браузеров:
				return this[0].currentStyle[cur];
			}
		}
	},
	
	/**
	 * Apply some css-class to selected elements
	 * @param {String} name Name of the class
	 * @return {NodeList}
	 */
	addClass: function(name) {
		this.forEach(function() { // Чтобы добавить к элементу новый класс, достаточно добавить его через пробел в className		
			if (!(new RegExp("(^|\\s)" + name + "(\\s|$)").test(this.className))) {
				this.className += " " + name;
			}
		});
		return this;
	},
	
	/**
	 * Remove some css-class from selected elements
	 * @param {String} name Name of the class
	 * @return {NodeList}
	 */
	removeClass: function(name) {
		var reg = new RegExp("(^|\\s)" + name + "(\\s|$)", "g");
		this.forEach(function() {
			this.className = this.className.replace(reg, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
		});
		return this;
	},
	
	/**
	 * Show elements (http://javascript.ru/ui/show-hide-toggle)
	 * @return {NodeList}
	 */
	show: function() {
		this.forEach(function() {
			var elem = Q(this);
			var old = elem.attr("displayOld");
			elem.css({display: old || ""});
			if (elem.css("display") === "none") {
				var nodeName = this.nodeName, body = document.body, display;
				if (CarbonJS.service.displayCache[nodeName]) {
					display = CarbonJS.service.displayCache[nodeName];
				} else {
					var testElem = document.createElement(nodeName);
					body.appendChild(testElem);
					display = Q(testElem).css("display");
					if (display == "none") display = "block";
					body.removeChild(testElem);
					CarbonJS.service.displayCache[nodeName] = display;
				}
				elem.attr({displayOld: display});
				elem.css({display: display});
			}
		});
		return this;
	},
	
	/**
	 * Hide elements (http://javascript.ru/ui/show-hide-toggle)
	 * @return {NodeList}
	 */
	hide: function() {
		this.forEach(function() {
			var elem = Q(this);
			if (!elem.attr("displayOld")) elem.attr({"displayOld": elem.css("display")})
			elem.css({display: "none"});
		});
		return this;
	},
	
	/**
	 * Toggle elements (http://javascript.ru/ui/show-hide-toggle)
	 * @return {NodeList}
	 */
	toggle: function() {
		this.forEach(function() {
			CarbonJS.service.elemIsHidden(this) ? Q(this).show() : Q(this).hide();
		});
		return this;
	},
	
	/**
	 * Get and set the X-coordinate of selected elements and get the X-coordinate of the mouse
	 * @param {String, Number, Object} val Coordinate or event-object
	 * @return {Number, NodeList}
	 */
	x: function(val, posType) {
		if (this.length == 0) {
			var x;
			val = val || window.event;
			if (val.pageX) {
				x = val.pageX;
			} else {
				x = val.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft) - document.documentElement.clientLeft;
			}
			return parseInt(x);
		} else {
			if (val != null) {
				this.css({left: parseInt(val) + "px"});
				return this;
			} else {
				if (this[0].getBoundingClientRect) { // Координаты вычисляются на основе блочной модели
					return (this[0].getBoundingClientRect().left + (window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft) - (document.documentElement.clientLeft || document.body.clientLeft || 0));
				} else { // Иначе вычисляем координаты через оффсеты родительских элементов нашего узла
					var left = this[0].offsetLeft, parent = this[0].offsetParent;
					while (parent = parent.offsetParent) left += parent.offsetLeft - parent.scrollLeft;
					return parseInt(left);
				}
			}
		}
	},
	
	/**
	 * Get and set the Y-coordinate of selected elements and get the Y-coordinate of the mouse
	 * @param {String, Number, Object} val Coordinate or event-object
	 * @return {Number, NodeList}
	 */
	y: function(val, posType) {
		if (this.length == 0) {
			var y;
			val = val || window.event;
			if (val.pageY) {
				y = val.pageY;
			} else {
				y = val.clientY + (document.documentElement.scrollTop || document.body.scrollTop) - document.documentElement.clientTop;
			}
			return parseInt(y);
		} else {
			if (val != null) {
				this.css({top: parseInt(val) + "px"});
				return this;
			} else {
				if (this[0].getBoundingClientRect) { // Координаты вычисляются на основе блочной модели
					return (this[0].getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) - (document.documentElement.clientTop || document.body.clientTop || 0));
				} else { // Иначе вычисляем координаты через оффсеты родительских элементов нашего узла
					var top = this[0].offsetTop, parent = this[0].offsetParent;
					while (parent = parent.offsetParent) top += parent.offsetTop - parent.scrollTop;
					return parseInt(top);
				}
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
			if (this.addEventListener) {
				this.addEventListener(evnt, func, false);
			} else if (this.attachEvent) {
				this.attachEvent("on" + evnt, func);
			} else {
				var oldfunc = this["on" + evnt];
				if (oldfunc) {
					this["on" + evnt] = function() {
						oldfunc();
						func();
					}
				} else {
					this["on" + evnt] = func;
				}
			}
			CarbonJS.service.events.push({ // Записываем установленный обработчик события в специальный массив
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
			while (++k < CarbonJS.service.events.length) {
				if (CarbonJS.service.events[k].obj == this && CarbonJS.service.events[k].evt == evnt) {
					if (this.removeEventListener) {
						this.removeEventListener(evnt, CarbonJS.service.events[k].func, false);
					} else if (this.detachEvent) {
						this.detachEvent("on" + evnt, CarbonJS.service.events[k].func);
					} else {
						this["on" + evnt] = "";
					}
					CarbonJS.service.events.splice(k, 1); // Стираем удалённый обработчик события из массива
					break;
				}
			}
		});
		return this;
	}
});

/**
 * Set the cookies
 * @param {String} name Name of the cookie you want to set
 * @param {String} value Value of the cookie you want to set
 * @param {Object} params An additional parameters for the cookie
 */
CarbonJS.setCookie = function(name, value, params) {
	params = params || {};
	var expires = params.expires, updatedCookie = name + "=" + encodeURIComponent(value);
	if (expires) {
		if (typeof expires == "number") {
			var date = new Date();
			date.setTime(date.getTime() + expires);
			expires = date;
		}
		if (expires.toUTCString) expires = expires.toUTCString();
		params.expires = expires;
	}
	for (var n in params) updatedCookie += "; " + n + ((params[n].length != 0) ? ("=" + params[n]) : "");
	document.cookie = updatedCookie;
};

/**
 * Get the value of the cookie
 * @param {String} name Name of the cookie which value you want to get
 */
CarbonJS.getCookie = function(name) {
	var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
	return matches ? decodeURIComponent(matches[1]) : undefined;
};

/**
 * Remove the cookie
 * @param {String} name Name of the cookie you want to remove
 */
CarbonJS.removeCookie = function(name) {
	CarbonJS.setCookie(name, null, {expires: -1});
};