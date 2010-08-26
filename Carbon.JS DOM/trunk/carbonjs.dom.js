/**
 * Carbon.JS - A simple JavaScript framework
 *
 * Carbon.JS DOM Module - Basic DOM functions
 *
 * @author		Dmitry Polyuhov <admin@carbonjs.com>
 * @license		http://carbonjs.com/mit-license.txt
 * @version		1.1.0 (build 20100826)
 */

/**
 * This means that this module was connected to the document by loadModule or by script-tag
 */  
CarbonJS.modules.dom = true;

/**
 * All the functions listed below in some way modify the DOM, 
 * so you need to update the cache of Carbon.JS to avoid the return of incorrect elements.
 */ 
CarbonJS.refreshCache = function() {
	CarbonJS.cache = {};
}

CarbonJS.extend({

	/**
	 * This function can write data to nodes via innerHTML and can get content of nodes
	 * @param {String} [str] Data that must be written to nodes
	 * @return {String, NodeList}
	 */
	html: function(str) {
		if (str == null) {
			return this[0].innerHTML;
		} else {
			var cnt = arguments[0];
			this.forEach(function() {
				this.innerHTML = cnt;
			});
			CarbonJS.refreshCache();
			return this;
		}
	},
	
	/**
	 * This function can get text from nodes via DOM
	 * @return {String}
	 */
	text: function() {
		return (this[0].textContent || this[0].innerText); // Браузер Firefox не поддерживает innerHTML, для него используем свойство textContent
	},
	
	/**
	 * Create DOM-fragments using object-API
	 * @param {Object, String} ... Hash with a special syntax to create a DOM-fragments
	 * @return {NodeList}
	 */
	createDOM: function() {
		CarbonJS.checkModules("utilities");
		var dom = [], a = 0, ia;
		while (ia = arguments[a++]) {
			if (typeof ia == "string") { // Если функции передана строка, то это могут быть CSS-селекторы или обычный текст для вставки
				if (/^([a-zA-Z0-9]*)#([a-zA-Z0-9-_]+)(:[^:]+)*$/.test(ia) || /^([a-zA-Z0-9*]+)?(\.([a-zA-Z0-9-_]+))?(:[^:]+)*$/.test(ia) || /^(\w*)(\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\])+(:[^:]+)*$/.test(ia)) { // Если переданы селекторы,
					var elems = Q(ia), i = 0, ii;
					while (ii = elems[i++]) dom.push(ii); // получаем соответствующие им элементы и записываем их в массив
				} else {
					dom.push(document.createTextNode(ia)); // Передан простой текст - создаём текстовый узел
				}
			} else if (typeof ia == "object") {
				if (!ia.tag) {
					dom.push(ia);
				} else {
					var elem = document.createElement(ia.tag); // Создаём узлы, основываясь на полученных параметрах
					if (ia.id) elem.id = ia.id;
					if (ia.css) Q(elem).css(ia.css);
					if (ia.attr) Q(elem).attr(ia.attr);
					if (ia.children) {
						var i = 0, ii, chs = ia.children;
						while (ii = chs[i++]) {
							var elems = Q().createDOM(ii), j = 0, ij;
							while (ij = elems[j++]) elem.appendChild(ij);
						}
					}
					dom.push(elem);
				}
			}
		}
		return dom;
	},
	
	/**
	 * Append a DOM-fragment or some node to another node(s)
	 * @param {Object, String} ... Hash with a special syntax to create a DOM-fragments
	 * @return {NodeList}
	 */
	append: function() {
		var i = 0, ii;
		while (ii = arguments[i++]) {
			this.forEach(function() {
				var elems = Q().createDOM(ii), j = 0, ij;
				while (ij = elems[j++]) this.appendChild(ij);
			});
		}
		CarbonJS.refreshCache();
		return this;
	},
	
	/**
	 * Prepend a DOM-fragment or some node to another node(s)
	 * @param {Object, String} ... Hash with a special syntax to create a DOM-fragments
	 * @return {NodeList}
	 */
	prepend: function() {
		var i = arguments.length - 1, ii;
		while (ii = arguments[i--]) {
			this.forEach(function() {
				var elems = Q().createDOM(ii), j = elems.length - 1, ij;
				while (ij = elems[j--]) this.insertBefore(ij, this.firstChild);
			});
		}
		CarbonJS.refreshCache();
		return this;
	},
	
	/**
	 * Add a DOM-fragment or some node before another node(s)
	 * @param {Object, String} ... Hash with a special syntax to create a DOM-fragments
	 * @return {NodeList}
	 */
	addBeforeIt: function() {
		var i = 0, ii;
		while (ii = arguments[i++]) {
			this.forEach(function() {
				var elems = Q().createDOM(ii), j = 0, ij;
				while (ij = elems[j++]) this.parentNode.insertBefore(ij, this); 
			});
		}
		CarbonJS.refreshCache();
		return this;
	},
	
	/**
	 * Add a DOM-fragment or some node after another node(s)
	 * @param {Object, String} ... Hash with a special syntax to create a DOM-fragments
	 * @return {NodeList}
	 */
	addAfterIt: function() {
		var i = arguments.length - 1, ii;
		while (ii = arguments[i--]) {
			this.forEach(function() {
				var elems = Q().createDOM(ii), j = elems.length - 1, ij;
				while (ij = elems[j--]) this.parentNode.insertBefore(ij, this.nextSibling);
			});
		}
		CarbonJS.refreshCache();
		return this;
	},
	
	/**
	 * Empty the contents of the nodes
	 * @param {String} ... Empty an elements that correspond to the CSS-selectors
	 * @return {NodeList}
	 */
	clear: function() {
		if (arguments.length > 0) {
			var i = 0, ii;
			while (ii = arguments[i++]) {
				this.forEach(function() {
					QF(this, ii).remove(); // Очищаем узлы от выбранных элементов
				});
			}
		} else {
			this.forEach(function() {
				var el = this;
				while (el.firstChild) el.removeChild(el.firstChild); // Если аргумент не передан, удаляем всё содержимое узлов
			});
		}
		CarbonJS.refreshCache();
		return this;
	},
	
	/**
	 * Clone nodes
	 * @param {Boolean} [depth] Clone with contents or not
	 * @return {NodeList}
	 */
	clone: function(depth) {
		return this[0].cloneNode(depth || true);
	},
	
	/**
	 * Remove nodes
	 * @return {NodeList}
	 */
	remove: function() {
		this.forEach(function() {
			this.parentNode.removeChild(this);
		});
		CarbonJS.refreshCache();
		return this;
	},
	
	/**
	 * Return parent node of selected element
	 * @return {Node}
	 */
	parentNode: function() {
		return Q(this[0].parentNode);
	},
	
	/**
	 * Return first child of selected element
	 * @return {Node}
	 */
	firstChild: function() {
		if (CarbonJS.traversal) {
			return Q(this[0].firstElementChild);
		} else {
			var nc = this[0].firstChild;
			while (nc && nc.nodeType != 1) nc = nc.nextSibling;
			return Q(nc);
		}
	},
	
	/**
	 * Return last child of selected element
	 * @return {Node}
	 */
	lastChild: function() {
		if (CarbonJS.traversal) {
			return Q(this[0].lastElementChild);
		} else {
			var pc = this[0].lastChild;
			while (pc && pc.nodeType != 1) pc = pc.previousSibling;
			return Q(pc);
		}
	},
	
	/**
	 * Return next sibling of selected element
	 * @return {Node}
	 */
	nextSibling: function() {
		if (CarbonJS.traversal) {
			return Q(this[0].nextElementSibling);
		} else {
			var ns = this[0];
			while ((ns = ns.nextSibling) && ns.nodeType != 1) {}
			return Q(ns);
		}
	},
	
	/**
	 * Return previous sibling of selected element
	 * @return {Node}
	 */
	prevSibling: function() {
		if (CarbonJS.traversal) {
			return Q(this[0].previousElementSibling);
		} else {
			var ps = this[0];
			while ((ps = ps.previousSibling) && ps.nodeType != 1) {}
			return Q(ps);
		}
	}
});