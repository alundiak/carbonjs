/**
 * Carbon.JS - A simple JavaScript framework
 *
 * Carbon.JS Animation Module - Basic animation functions with transition curves
 *
 * @author		Dmitry Polyuhov <admin@carbonjs.com>
 * @license		http://carbonjs.com/mit-license.txt
 * @version		1.1.0 (build 20100321)
 */

/**
 * This means that this module was connected to the document by loadModule or by script-tag
 */  
CarbonJS.modules.animation = true;

/**
 * Basic transitions for function of animation
 */
CarbonJS.Transitions = {};
CarbonJS.Transitions.types = {
	Line: function(p) { // Линейное изменение
		return p;
	},
	Sine: function(p) { // Изменение по синусоиде
		return 1 - Math.sin((1 - p) * Math.PI / 2);
	},
	Back: function(p) { // Изменение с обратным ходом
		return Math.pow(p, 2) * (2.618 * p - 1.618);
	},
	Quad: function(p) { // Изменение по параболе
		return Math.pow(p, 2);
	},
	Cubic: function(p) { // Изменение по закону y = x^3
		return Math.pow(p, 3);
	},
	Quart: function(p) { // Изменение по закону y = x^4
		return Math.pow(p, 4);
	},
	Quint: function(p) { // Изменение по закону y = x^5
		return Math.pow(p, 5);
	},
	Bounce: function(p) { // Изменение "гравитация"
		var value;
		for (var a = 0, b = 1; 1; a += b, b /= 2) {
			if (p >= (7 - 4 * a) / 11) {
				value = b * b - Math.pow((11 - 6 * a - 11 * p) / 4, 2);
				break;
			}
		}
		return value;
	}
};
for (var t in CarbonJS.Transitions.types) { // Добавляем к выше перечисленным законам выполнение с прямым, обратным и комбинированным ходом
	CarbonJS.Transitions[t] = {}; 
	CarbonJS.Transitions[t].EaseIn = function(p) { 
		return this(p); 
	}.bind(CarbonJS.Transitions.types[t]); 
	CarbonJS.Transitions[t].EaseOut = function(p) { 
		return 1 - this(1 - p); 
	}.bind(CarbonJS.Transitions.types[t]); 
	CarbonJS.Transitions[t].EaseInOut = function(p) { 
		return (p <= 0.5) ? this(2 * p) / 2 : (2 - this(2 * (1 - p))) / 2; 
	}.bind(CarbonJS.Transitions.types[t]); 
}
CarbonJS.extend({
	
	/**
	 * Function of animation
	 * @param {Object} params Current settings
	 * @param {Function} curve The curve of the transition
	 * @param {Number} time Time of the transition
	 * @return {NodeList}
	 */
	change: function(params, curve, time) {
		CarbonJS.checkModules("utilities");
		var onstart = null; // "Обработчик события" начала анимации
		var onchanging = null; // "Обработчик события" процесса анимации
		var onchanged = null; // "Обработчик события" завершения анимации
		var Changing = function(curve, time, callback) { // Класс, реализующий изменение указанных величин по заданному закону
			this.st = new Date().getTime();
			this.time = time;
			this.curve = curve;
			this.callback = callback;
			var that = this;
			this.runCallback = function(bool, obj) {
				that.start(bool, obj);
			};
		}
		Changing.prototype.start = function(bool, obj) {
			if (obj["animation"] == null || !this.hasNext()) {
				obj["animation"] = null;
				if (onchanged != null && !!bool) onchanged.apply(obj);
				return;
			}
			this.callback(this.next());
			setTimeout(function() {
				this.runCallback(bool, obj);
			}.bind(this), 10);
			if (onchanging != null) onchanging.apply(obj);
		}
		Changing.prototype.hasNext = function() {
			if (this.done) return this.oneLeft;
			var now = new Date().getTime();
			if ((now - this.st) > this.time) {
				this.done = true;
				this.oneLeft = true;
			}
			return true;
		}
		Changing.prototype.next = function() {
			this.oneLeft = false;
			var now = new Date().getTime();
			var percentage = Math.min(1, (now - this.st) / this.time);
			return this.curve(percentage);
		}
		var getColors = function(color) { // Функция обработки изменения цвета
			var rgb = color.replace(/[# ]/g, "").replace(/^(.)(.)(.)$/, "$1$1$2$2$3$3").match(/.{2}/g);
			return {
				r: parseInt(rgb[0], 16),
				g: parseInt(rgb[1], 16),
				b: parseInt(rgb[2], 16)
			};
		}
		var changes = {};
		this.forEach(function() {
			changes[this] = {};
			changes[this].num = 0;
			for (var p in params) {
				if (p != "onStart" && p != "onChanging" && p != "onChanged") changes[this].num++;
			}
			var i = 1;
			var obj = this;
			obj["animation"] = true;
			for (var p in params) {
				if (typeof params[p] == "function") {
					if (p == "onStart") onstart = params[p];
					if (p == "onChanging") onchanging = params[p];
					if (p == "onChanged") onchanged = params[p];
					params[p] = null;
				}
				if (params[p] != null) {
					new Changing(curve, time, function(percentage) { // Для каждого изменяемого параметра создаётся свой экземпляр класса анимации
						if (!this.name) this.name = obj;
						if (!this.parm) this.parm = params[p];
						if (!this.p) {
							if (p != "MozOpacity" && p != "KhtmlOpacity") {
								this.p = p.replace(/\-(\w)/g, function() {
									return arguments[1].toUpperCase();
								});
							} else {
								this.p = p;
							}
						}
						if (this.p.search(/[Cc]olor/) != -1) {
							if (!this.r) this.r = 0;
							if (!this.g) this.g = 0;
							if (!this.b) this.b = 0;
							var sc = getColors(this.parm[0]);
							var ec = getColors(this.parm[1]);
							this.r = Math.floor((ec.r - sc.r) * percentage + sc.r);
							if (this.r < 0) this.r = 0;
							if (this.r > 255) this.r = 255;
							this.g = Math.floor((ec.g - sc.g) * percentage + sc.g);
							if (this.g < 0) this.g = 0;
							if (this.g > 255) this.g = 255;
							this.b = Math.floor((ec.b - sc.b) * percentage + sc.b);
							if (this.b < 0) this.b = 0;
							if (this.b > 255) this.b = 255;
							this.name.style[this.p] = "rgb(" + this.r + "," + this.g + "," + this.b + ")";
						} else if (this.p == "opacity") {
							if (document.body.filters) {
								var val = (parseInt(this.parm[1]) - parseInt(this.parm[0])) * percentage + parseInt(this.parm[0]);
								if (val > 100) val = 100;
								if (val < 0) val = 0;
								this.name.style["filter"] = "progid:DXImageTransform.Microsoft.Alpha(opacity=" + val + ")";
							} else {
								var op = "";
								if (typeof document.body.style.MozOpacity == "string") {
									op = "MozOpacity";
								} else if (typeof document.body.style.KhtmlOpacity == "string") {
									op = "KhtmlOpacity";
								} else if (typeof document.body.style.opacity == "string") {
									op = "opacity";
								}
								var val = (parseInt(this.parm[1]) - parseInt(this.parm[0])) * percentage + parseInt(this.parm[0]);
								if (val > 100) val = 100;
								if (val < 0) val = 0;
								this.name.style[op] = val / 100;
							}
						} else {
							this.name.style[this.p] = (parseInt(this.parm[1]) - parseInt(this.parm[0])) * percentage + parseInt(this.parm[0]) + "px";
						}
					}).start(i == changes[obj].num, obj);
				}
				i++;
			}
			if (onstart != null) onstart.apply(this);
		});
		return this;
	},
	
	/**
	 * This function stops the animation
	 * @return {NodeList}
	 */
	stopChanging: function() {
		this.forEach(function() {
			this["animation"] = null; // Для остановки анимации объкта достаточно удалить у него свойство animation
		});
		return this;
	},
	
	/**
	 * Drag'n'Drop API
	 * @param {Object} params Current settings
	 * @return {NodeList}
	 */
	draggable: function(params) {
		CarbonJS.checkModules("utilities");
		var flag = true, difX, difY, drX, drY, maxX, minX, maxY, minY, method, onClicked, onDragging, onDropped, clone, tomove, handler, posX, posY, dX, dY, mouseX, mouseY, stepX, stepY;
		if (params) {
			drX = params.dragX || true; // Возможно ли перетаскивание по горизонтали
			drY = params.dragY || true; // Возможно ли перетаскивание по вертикали
			maxX = parseInt(params.maxX) || 99999; // Максимально возможное положение перетаскиваемого объекта по горизонтали
			minX = parseInt(params.minX) || -99999; // Минимальная координата перетаскиваемого объекта по горизонтали
			maxY = parseInt(params.maxY) || 99999; // Максимально возможное положение перетаскиваемого объекта по вертикали
			minY = parseInt(params.minY) || -99999; // Минимальная координата перетаскиваемого объекта по вертикали
			method = params.method || "simple"; // Метод перетаскивания (simple, ghostly, reverse, grid)
			onClicked =  params.onClicked || null; // "Обработчик события" нажатия на перетаскиваемый элемент
			onDragging = params.onDragging || null; // "Обработчик события" перетаскивания элемента
			onDropped = params.onDropped || null; // "Обработчик события" завершения перетаскивания
			stepX = params.grid != null ? parseInt(params.grid[0]) : 50; // Шаг сетки по горизонтали
			stepY = params.grid != null ? parseInt(params.grid[1]) : 50; // Шаг сетки по вертикали
		} else {
			drX = true;
			drY = true;
		}
		var element = Q(this[0]);
		if (method == "reverse") {
			var startX = element.x();
			var startY = element.y();
		}
		handler = (params && params.handler != null) ? params.handler : element; // "Ручка", за которую перетаскивают элемент (это может быть как сам объект, так и некий элемент внутри него)
		var ccx = 0, ccy = 0;
		var moveByX = function(inX) {
			if (inX > maxX) return maxX;
			if (inX < minX) return minX;
			if (method == "grid") {
				if (onDragging != null) {
					if (ccx != stepX * Math.round(inX / stepX)) {
						onDragging.apply(element);
						ccx = stepX * Math.round(inX / stepX);
					}
				}
				return stepX * Math.round(inX / stepX);
			} else if (method != "grid") {
				return inX;
			}
		}
		var moveByY = function(inY) {
			if (inY > maxY) return maxY;
			if (inY < minY) return minY;
			if (method == "grid") {
				if (onDragging != null) {
					if (ccy != stepY * Math.round(inY / stepY)) {
						onDragging.apply(element);
						ccy = stepY * Math.round(inY / stepY);
					}
				}
				return stepY * Math.round(inY / stepY);
			} else if (method != "grid") {
				return inY;
			}
		}
		handler.css({cursor: "move"}).addEvent("mousedown", function(evt) {
			if (evt.preventDefault) {
				evt.preventDefault();
			} else {
				evt.returnValue = false;
			}
			if (method == "ghostly") {
				clone = element[0].cloneNode(true);
				document.body.appendChild(clone);
				Q(clone).transparence(50);
			}
			posX = Q().x(evt);
			posY = Q().y(evt);
			if (element.css("position") != "absolute") {
				element.css({
					position: "absolute",
					top: element.y(),
					left: element.x()
				});
			}
			if (onClicked != null) onClicked.apply(element);
			tomove = (method == "ghostly") ? Q(clone) : element;
			difX = Q().x(evt) - tomove.x();
			difY = Q().y(evt) - tomove.y();
			dX = Q().x(evt);
			dY = Q().y(evt);
			flag = true;
			Q(document).addEvent("selectstart", function() {
				return false;
			}).addEvent("mousemove", function(evt) {
				mouseX = Q().x(evt);
				mouseY = Q().y(evt);
				if (mouseX > posX) {
					dX += mouseX - posX;
				} else if (posX > mouseX) {
					dX -= posX - mouseX;
				}
				if (mouseY > posY) {
					dY += mouseY - posY;
				} else if (posY > mouseY) {
					dY -= posY - mouseY;
				}
				posX = mouseX;
				posY = mouseY;
				if (flag) {
					if (drX == true) tomove.x(moveByX(dX - difX));
					if (drY == true) tomove.y(moveByY(dY - difY));
					if (/simple|reverse/.test(method) && onDragging != null) onDragging.apply(element);
				}
			}).addEvent("mouseup", function() {
				flag = false;
				if (method == "ghostly") {
					var x = tomove.x();
					var y = tomove.y();
					clone.parentNode.removeChild(clone);
					element.change({
						top: [element.y(), y],
						left: [element.x(), x],
						onChanging: function() {
							if (onDragging != null) onDragging.apply(element);
						},
						onChanged: function() {
							if (onDropped != null) onDropped.apply(element);
						}
					}, CarbonJS.Transitions.Sine.EaseOut, 1000);
				}
				if (method == "reverse") {
					element.change({
						top: [element.y(), startY],
						left: [element.x(), startX]
					}, CarbonJS.Transitions.Quart.EaseOut, 1000);
				}
				if (method != "ghostly" && onDropped != null) onDropped.apply(element);
				Q(document).removeEvent("mouseup").removeEvent("mousemove").removeEvent("selectstart");
			});
		});
		return this;
	},
	
	/**
	 * Resizing API
	 * @param {Object} params Current settings
	 * @return {NodeList}
	 */
	resizable: function(params) {
		CarbonJS.checkModules("utilities");
		var flag = true, difX, difY, maxW, minW, maxH, minH, onClicked, onResizing, onResized, posX, posY, dX, dY, mouseX, mouseY, hs = params.handlers;
		var th = this, thx, thy, startW, startH, startX, startY;
		maxW = parseInt(params.maxW) || 9999; // Максимальная ширина изменяемого элемента
		minW = parseInt(params.minW) || 10; // Минимальная ширина изменяемого элемента
		maxH = parseInt(params.maxH) || 9999; // Максимальная высота изменяемого элемента
		minH = parseInt(params.minH) || 10; // Минимальная высота изменяемого элемента
		onClicked =  params.onClicked || null; // "Обработчик события" нажатия на ползунки элемента
		onResizing = params.onResizing || null; // "Обработчик события" изменения размеров элемента
		onResized = params.onResized || null; // "Обработчик события" завершения изменения размеров элемента
		var element = Q(this[0]);
		var getCurX = function(x, w) {
			if (w > minW && w < maxW) th.parentNode().x(x);
		}
		var getCurY = function(y, h) {
			if (h > minH && h < maxH) th.parentNode().y(y);
		}
		var getCurW = function(w) {
			if (w > maxW) return maxW;
			if (w < minW) return minW;
			return w;
		}
		var getCurH = function(h) {
			if (h > maxH) return maxH;
			if (h < minH) return minH;
			return h;
		}
		var resize = function(element, evt, type) {
			startW = parseInt(th.css("width"));
			startH = parseInt(th.css("height"));
			startX = th.x();
			startY = th.y();
			dhx = parseInt(element.css("left"));
			dhy = parseInt(element.css("top"));
			if (evt.preventDefault) {
				evt.preventDefault();
			} else {
				evt.returnValue = false;
			}
			posX = Q().x(evt);
			posY = Q().y(evt);
			if (element.css("position") != "absolute") {
				element.css({
					position: "absolute",
					top: element.y(),
					left: element.x()
				});
			}
			if (onClicked != null) onClicked.apply(th);
			difX = Q().x(evt) - element.x();
			difY = Q().y(evt) - element.y();
			dX = Q().x(evt);
			dY = Q().y(evt);
			flag = true;
			Q(document).addEvent("selectstart", function() {
				return false;
			}).addEvent("mousemove", function(evt) {
				mouseX = Q().x(evt);
				mouseY = Q().y(evt);
				if (mouseX > posX) {
					dX += mouseX - posX;
				} else if (posX > mouseX) {
					dX -= posX - mouseX;
				}
				if (mouseY > posY) {
					dY += mouseY - posY;
				} else if (posY > mouseY) {
					dY -= posY - mouseY;
				}
				posX = mouseX;
				posY = mouseY;
				if (flag) {
					switch (type) {
						case "lt":
							var x = dX - difX - dhx;
							var y = dY - difY - dhy;
							var w = startW + startX - x;
							var h = startH + startY - y;
							getCurX(x, w);
							getCurY(y, h);
							th.css({
								width: getCurW(w),
								height: getCurH(h)
							});
							break;
						case "t":
							var y = dY - difY - dhy;
							var h = startH + startY - y;
							getCurY(y, h);
							th.css({height: getCurH(h)});
							break;
						case "rt":
							var x = dX - difX - dhx;
							var y = dY - difY - dhy;
							var h = startH + startY - y;
							getCurY(y, h);
							th.css({
								width: getCurW(x - startX + dhx),
								height: getCurH(h)
							});
							break;
						case "r":
							var x = dX - difX - dhx;
							th.css({width: getCurW(x - startX + dhx)});
							break;
						case "rb":
							var x = dX - difX - dhx;
							var y = dY - difY - dhy;
							th.css({
								width: getCurW(x - startX + dhx),
								height: getCurH(y - startY + dhy)
							});
							break;
						case "b":
							var y = dY - difY - dhy;
							th.css({height: getCurH(y - startY + dhy)});
							break;
						case "lb":
							var x = dX - difX - dhx;
							var y = dY - difY - dhy;
							var w = startW + startX - x;
							getCurX(x, w);
							th.css({
								width: getCurW(w),
								height: getCurH(y - startY + dhy)
							});
							break;
						case "l":
							var x = dX - difX - dhx;
							var w = startW + startX - x;
							getCurX(x, w);
							th.css({width: getCurW(w)});
							break;
					}
					if (onResizing != null) onResizing.apply(th);
				}
			}).addEvent("mouseup", function() {
				flag = false;
				if (onResized != null) onResized.apply(th);
				Q(document).removeEvent("mouseup").removeEvent("mousemove").removeEvent("selectstart");
			});
		}
		if (hs.lt) hs.lt.css({cursor: "nw-resize"}).addEvent("mousedown", function(evt) {
			resize(hs.lt, evt, "lt");
		});
		if (hs.t) hs.t.css({cursor: "n-resize"}).addEvent("mousedown", function(evt) {
			resize(hs.t, evt, "t");
		});
		if (hs.rt) hs.rt.css({cursor: "ne-resize"}).addEvent("mousedown", function(evt) {
			resize(hs.rt, evt, "rt");
		});
		if (hs.r) hs.r.css({cursor: "e-resize"}).addEvent("mousedown", function(evt) {
			resize(hs.r, evt, "r");
		});
		if (hs.rb) hs.rb.css({cursor: "se-resize"}).addEvent("mousedown", function(evt) {
			resize(hs.rb, evt, "rb");
		});
		if (hs.b) hs.b.css({cursor: "s-resize"}).addEvent("mousedown", function(evt) {
			resize(hs.b, evt, "b");
		});
		if (hs.lb) hs.lb.css({cursor: "sw-resize"}).addEvent("mousedown", function(evt) {
			resize(hs.lb, evt, "lb");
		});
		if (hs.l) hs.l.css({cursor: "w-resize"}).addEvent("mousedown", function(evt) {
			resize(hs.l, evt, "l");
		});
		return this;
	}	 
});