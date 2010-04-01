/**
 * Carbon.JS - A simple JavaScript framework
 *
 * Carbon.JS DOM Module - Basic DOM functions
 *
 * @author		Dmitry Poluhov <admin@sjs-tech.ru>
 * @license		http://www.gnu.org/licenses/gpl.html
 * @version		1.0.2
 */

/**
 * This means that this module was connected to the document by loadModule or by script-tag
 */  
CarbonJS.modules.dom = "enabled";

/**
 * All the functions listed below in some way modify the DOM, 
 * so you need to update the cache of Carbon.JS to avoid the return of incorrect elements.
 */ 
CarbonJS.refreshCache = function() {
	CarbonJS.__cache = {};
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
		if (this[0].nodeType == 3 || this[0].nodeType == 4) {
			return this[0].data;
		}
		var text = [];
		var i = -1;
		while (++i < this[0].childNodes.length) text[text.length] = Q(this[0].childNodes[i]).text();
		return text.join(" ");
	},
	
	/**
	 * Create DOM-fragments using object-API
	 * @param {Object, String} ... Hash with a special syntax to create a DOM-fragments
	 * @return {NodeList}
	 */
	createDOM: function() {
		if (CarbonJS.modules.utilities == "enabled") {
			var dom = "";
			var a = -1;
			while (++a < arguments.length) {
				if (typeof arguments[a] == "string") {
					if (/^#\w+$/.test(arguments[a])) {
						dom = Q(arguments[a])[0];
					} else {
						dom = document.createTextNode(arguments[a]);
					}
				} else if (typeof arguments[a] == "object") {
					if (arguments[a].tag == null) {
						dom = arguments[a];
					} else {
						dom = document.createElement(arguments[a].tag);
						if (arguments[a].id) dom.setAttribute("id", arguments[a].id);
						if (arguments[a].css) Q(dom).css(arguments[a].css);
						if (arguments[a].attr) Q(dom).attr(arguments[a].attr);
						if (arguments[a].children) {
							var i = -1;
							while (++i < arguments[a].children.length) dom.appendChild(Q().createDOM(arguments[a].children[i]));
						}
					}
				}
			}
			return dom;
		} else {
			alert("Модуль Carbon.JS Utilities не загружен!\nCarbon.JS Utilities-module is not loaded!");
		}
	},
	
	/**
	 * Append a DOM-fragment or some node to another node(s)
	 * @param {Object, String} ... Hash with a special syntax to create a DOM-fragments
	 * @return {NodeList}
	 */
	append: function() {
		var i = -1;
		while (++i < arguments.length) {
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
	
	/**
	 * Prepend a DOM-fragment or some node to another node(s)
	 * @param {Object, String} ... Hash with a special syntax to create a DOM-fragments
	 * @return {NodeList}
	 */
	prepend: function() {
		var i = arguments.length;
		while (--i >= 0) {
			if (this.length > 1) {
				var arg = arguments[i];
				this.forEach(function() {
					this.insertBefore(Q().createDOM(arg), this.firstChild);
				});
			} else {
				this[0].insertBefore(Q().createDOM(arguments[i]), this[0].firstChild);
			}
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
		var i = -1;
		while (++i < arguments.length) {
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
	
	/**
	 * Add a DOM-fragment or some node after another node(s)
	 * @param {Object, String} ... Hash with a special syntax to create a DOM-fragments
	 * @return {NodeList}
	 */
	addAfterIt: function() {
		var i = -1;
		while (++i < arguments.length) {
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
	
	/**
	 * Empty the contents of the nodes
	 * @param {String} ... Empty elements satisfying to the CSS-selectors
	 * @return {NodeList}
	 */
	clear: function() {
		if (arguments.length > 0) {
			var i = -1;
			while (++i < arguments.length) {
				var arg = arguments[i];
				this.forEach(function() {
					QF(this, arg).remove();
				});
			}
		} else {
			this.forEach(function() {
				var el = this;
				while (el.firstChild) el.removeChild(el.firstChild);
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
		if (depth == null) {
			return this[0].cloneNode(true);
		} else {
			return this[0].cloneNode(depth);
		}
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