/**
 * Carbon.JS - A simple JavaScript framework
 *
 * Carbon.JS Core - CSS1-3 selectors engine
 *
 * @author		Dmitry Poluhov <admin@sjs-tech.ru>
 * @license		http://www.gnu.org/licenses/gpl.html
 * @version		2.0.2 
 */

Array.prototype.inArray = function(value) {
	for(var i = 0; i < this.length; i++) {
		if(this[i] === value) {
			return true;
		}
	}
	return false;
};
var Q = window.Q = function() {
	return this instanceof QF ? this.get(document, arguments) : new QF(document, arguments);
}
var QF = window.QF = function() {
	if (arguments.length >= 2) {
		var params = [];
		for (var i = 1; i < arguments.length; i++) params.push(arguments[i]);
		return this instanceof QF ? this.get(arguments[0], params) : new QF(arguments[0], params);
	} else {
		return this instanceof QF ? this.get(document, arguments) : new QF(document, arguments);
	}
}
QF.prototype = {
	get: function(where, selector) {
		this.length = 1;
		function getPseudo(part, elements) {
			if (part.indexOf(":") != -1 && regs[3].test(part.substring(part.indexOf(":"), part.lastIndexOf("")))) {
				var nm = part.substring(0, part.indexOf(":"));
				part = part.substring(part.indexOf(":"), part.lastIndexOf(""));
				var nopc = part.match(/[a-zA-Z\-]+\(?[a-zA-Z0-9_\.\-\+\*=~\|:\^\$\[\]#"']*\)?/g);
				for (var i = 0; i < nopc.length; i++) {
					var marr = nopc[i].match(regs[3]);
					var buf = [];
					var pseudo = marr[1];
					var value = marr[2];
					switch (pseudo) {
						case "first-child":
							for (var j = 0; j < elements.length; j++) {
								if (elements[j].previousSibling) {
									var check = true;
									var ps = elements[j];
									while (ps = ps.previousSibling) {
										if (ps.nodeType == 1) {
											check = false;
											break;
										}
									}
									if (check) buf.push(elements[j]);
								} else {
									buf.push(elements[j]);
								}
							}
							break;
						case "last-child":
							for (var j = 0; j < elements.length; j++) {
								if (elements[j].nextSibling) {
									var check = true;
									var ns = elements[j];
									while (ns = ns.nextSibling) {
										if (ns.nodeType == 1) {
											check = false;
											break;
										}
									}
									if (check) buf.push(elements[j]);
								} else {
									buf.push(elements[j]);
								}
							}
							break;
						case "nth-child":
							if (/^\d+|even|odd|(-?\d*)n((\+|\-)(\d+))?$/.test(value)) {
								if (/^\d+$/.test(value) && value > 0) {
									for (var j = 0; j < elements.length; j++) {
										var index = 0;
										var nc = elements[j].parentNode.firstChild;
										while (nc) {
											if (nc.nodeType == 1) {
												index++;
												if (nc == elements[j] && index == value) {
													buf.push(elements[j]);
													break;
												}
												
											}
											nc = nc.nextSibling;
										}
									}
								} else if (/^even|odd$/.test(value)) {
									for (var j = 0; j < elements.length; j++) {
										var index = 0;
										var nc = elements[j].parentNode.firstChild;
										while (nc) {
											if (nc.nodeType == 1) {
												index++;
												if ((index % 2 == (value == "even" ? 0 : 1)) && (nc == elements[j])) {
													buf.push(elements[j]);
													break;
												}
											}
											nc = nc.nextSibling;
										}
									}
								} else if (/^(-?\d*)n((\+|\-)(\d+))?$/.test(value)) {
									var val = value.match(/^(-?\d*)n((\+|\-)(\d+))?$/);
									var v1 = (val[1] == "-") ? -1 : parseInt(val[1]);	// A/-
									var v3 = val[3];			// +/-
									var v4 = parseInt(val[4]);	// B
									for (var j = 0; j < elements.length; j++) {
										if (!val[1] && !val[3] && !val[4]) { // n
											var index = 0;
											var k = 0;
											var nc = elements[j].parentNode.firstChild;
											while (nc) {
												if (nc.nodeType == 1) {
													index++;
													if (nc == elements[j]) {
														buf.push(elements[j]);
														break;
													}
												}
												nc = nc.nextSibling;
											}
										} else if (!!val[1] && !val[3] && !val[4] && v1 > 0) { // An
											var index = 1;
											var nc = elements[j].parentNode.firstChild;
											while (nc) {
												if (nc.nodeType == 1) {
													if (nc == elements[j] && index % v1 == 0) {
														buf.push(elements[j]);
														break;
													}
													index++;
												}
												nc = nc.nextSibling;
											}
										} else if (!val[1] && !!val[3] && !!val[4]) { // n+B
											var index = 1;
											var nc = elements[j].parentNode.firstChild;
											while (nc) {
												if (nc.nodeType == 1) {
													if (nc == elements[j]) {
														if (v3 == "+" && index >= v4) {
															buf.push(elements[j]);
															break;
														} else if (v3 == "-") {
															buf.push(elements[j]);
															break;
														}
													}
													index++;
												}
												nc = nc.nextSibling;
											}
										} else if (!!val[1] && !!val[3] && !!val[4]) { // An+B
											var index = 1;
											var nc = elements[j].parentNode.firstChild;
											while (nc) {
												if (nc.nodeType == 1) {
													if (nc == elements[j]) {
														if (v3 == "+") {
															if (v1 < 0) {
																if (-index + v4 >= 0) {
																	buf.push(elements[j]);
																	break;
																}
															} else {
																if (v1 != 0 && index % v1 == v4) {
																	buf.push(elements[j]);
																	break;
																} else if (v1 == 0 && index == v4) {
																	buf.push(elements[j]);
																	break;
																}
															}
														} else if (v3 == "-") {
															if (v1 > 0 && (v4 + index) % v1 == 0) {
																buf.push(elements[j]);
																break;
															}
														}
													}
													index++;
												}
												nc = nc.nextSibling;
											}
										}
									}
								}
							}
							break;
						case "only-child":
							for (var j = 0; j < elements.length; j++) {
								var nc = elements[j].parentNode.firstChild;
								var check = false;
								var k = 0;
								while (nc && !check) {
									if (nc.nodeType == 1) {
										k++;
										if (k > 1) check = true;
									}
									nc = nc.nextSibling;
								}
								if (k == 1 && !check) buf.push(elements[j]);
							}
							break;
						case "root":
							buf.push((elements[j].ownerDocument ? elements[j].ownerDocument : document).documentElement);
							break;
						case "enabled":
							buf = elements;
							var k = 0;
							while (k < buf.length) {
								if (!buf[k].disabled) {
									k++;
								} else {
									buf.splice(k, 1);
								}
							}
							break;
						case "disabled":
							buf = elements;
							var k = 0;
							while (k < buf.length) {
								if (buf[k].disabled) {
									k++;
								} else {
									buf.splice(k, 1);
								}
							}
							break;
						case "checked":
							buf = elements;
							var k = 0;
							while (k < buf.length) {
								if (buf[k].checked) {
									k++;
								} else {
									buf.splice(k, 1);
								}
							}
							break;
						case "selected":
							buf = elements;
							var k = 0;
							while (k < buf.length) {
								if (buf[k].selected) {
									k++;
								} else {
									buf.splice(k, 1);
								}
							}
							break;
						case "empty":
							buf = elements;
							var k = 0;
							while (k < buf.length) {
								if (buf[k].childNodes.length == 0) {
									k++;
								} else {
									buf.splice(k, 1);
								}
							}
							break;
						case "not":
							var badNodes = [];
							var t = 0;
							var na = [];
							if (/^([a-zA-Z0-9*]+)(:[^:]+)*$/.test(value) || /^([a-zA-Z0-9*]+)\.(\w+)(:[^:]+)*$/.test(value)) {
								badNodes = QF(where, value);
							} else if (/^\.(\w+)(:[^:]+)*$/.test(value) || regs[2].test(value) || regs[3].test(value)) {
								badNodes = QF(where, nm + value);
							}
							for (var k = 0; k < elements.length; k++) {
								for (var l = 0; l < badNodes.length; l++) {
									if (elements[k] == badNodes[l]) t = 1;
								}
								if (t == 0) {
									na.push(elements[k]);
								} else {
									t = 0;
								}
							}
							buf = na;
							break;
						case "contains":
							for (var j = 0; j < elements.length; j++) {
								if (elements[j].innerHTML.indexOf(value) != -1) buf.push(elements[j]);
							}
							break;
					}
					elements = buf;
				}
			}
			return elements;
		}
		var elems = [where];
		var buf = [];
		var regs = [
			/^([a-zA-Z0-9]*)#(\w+)(:[^:]+)*$/,
			/^([a-zA-Z0-9*]+)?(\.(\w+))?(:[^:]+)*$/,
			/^(\w*)(\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\])+(:[^:]+)*$/,
			/:?([a-zA-Z\-]+)\(?([a-zA-Z0-9_\.\-\+\*=~\|:\^\$\[\]#"']*)\)?/
		];
		var params = selector[0];
		var output = [];
		for (var args = 0; args < params.length; args++) {
			if ((params[args] != "undefined" || params[args] != "") && typeof params[args] == "string") {
				if (document.querySelectorAll && params[args].indexOf(":contains(") == -1 && params[args].indexOf("!=") == -1 && params[args].indexOf("|=") == -1) {
					buf = where.querySelectorAll(params[args]);
					elems = [];
					for (var i = 0; i < buf.length; i++) elems.push(buf[i]);
					buf = [];
				} else {
					var selectors = params[args].replace(/\s?(>|\+|~)\s?/g, "$1");
					var qstr = selectors;
					selectors = selectors.split(" ");
					for (var i = 0; i < selectors.length; i++) {
						if (regs[0].test(selectors[i])) {
							var ch = selectors[i].match(regs[0]);
							var tag = ch[1];
							var id = ch[2];
							if (tag == "") {
								elems = [document.getElementById(id)];
							} else {
								if (document.getElementById(id).nodeName.toLowerCase() == tag) {
									elems = [document.getElementById(id)];
								}
							}
							elems = getPseudo(selectors[i], elems);
							buf = [];
							continue;
						} else if (regs[1].test(selectors[i])) {
							var ch = selectors[i].match(regs[1]);
							var tagName = ch[1] || "*";
							var className = ch[3] || "";
							for (var j = 0; j < elems.length; j++) {
								var cur = elems[j].getElementsByTagName(tagName);
								for (var k = 0; k < cur.length; k++) {
									if (className == "") {
										if (!buf.inArray(cur[k])) buf.push(cur[k]);
									} else if (className != "" && cur[k].className) {
										if (new RegExp("(^|\s)" + className + "(\s|$)").test(cur[k].className) && !buf.inArray(cur[k])) buf.push(cur[k]);
									}
								}
							}
							elems = getPseudo(selectors[i], buf);
							buf = [];
							continue;
						} else if (regs[2].test(selectors[i])) {
							var ch = selectors[i].match(regs[2]);
							var tag = ch[1] || "*";
							var str = selectors[i];
							if (str.indexOf(":") != -1) str = str.substring(0, str.indexOf(":"));
							var m = str.match(/\[\w+[=~\|\^\$\*]?=?"?[^\]"]*"?\]/g);
							for (var j = 0; j < elems.length; j++) {
								var cur = elems[j].getElementsByTagName(tag);
								for (var k = 0; k < cur.length; k++) {
									var check = true;
									for (var l = 0; l < m.length; l++) {
										var parts = m[l].match(/^\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/);
										var an = (parts[1] == "class") ? "className" : parts[1];
										var ao = parts[2];
										var av = parts[3].replace(/'/g, "");
										switch (ao) {
											case "=":
												if (!(cur[k][an] == av)) check = false;
												break;
											case "~":
												if (!(cur[k][an].match(new RegExp("\\b" + av + "\\b")))) check = false;
												break;
											case "|":
												if (!(cur[k][an].match(new RegExp("^" + av + "-|$")))) check = false;
												break;
											case "^":
												if (!(cur[k][an].match(new RegExp("^" + av)))) check = false;
												break;
											case "$":
												if (!(cur[k][an].match(new RegExp(av + "$")))) check = false;
												break;
											case "*":
												if (!(cur[k][an].indexOf(av) != -1)) check = false;
												break;
											case "!":
												if (!(cur[k][an].indexOf(av) == -1)) check = false;
												break;
											default:
												if (!(cur[k][an])) check = false;
										}
									}
									if (check && !buf.inArray(cur[k])) buf.push(cur[k]);
								}
							}
							elems = getPseudo(selectors[i], buf);
							buf = [];
							continue;
						} else if (selectors[i].search(/>|\+|~/) != -1) {
							var combinators = selectors[i].match(/>|\+|~/g);
							var parts = selectors[i].split(/>|\+|~/);
							parts.splice(0, 1);
							var cqp = qstr.substring(0, qstr.indexOf(selectors[i]) + selectors[i].length);
							var searchIn = cqp.substring(0, cqp.indexOf(combinators[0], cqp.lastIndexOf(" ")));
							elems = QF(where, searchIn);
							for (var j = 0; j < parts.length; j++) {
								switch (combinators[j]) {
									case ">":
										for (var k = 0; k < elems.length; k++) {
											var searchFor = QF(elems[k], parts[j]);
											for (var l = 0; l < searchFor.length; l++) {
												if (searchFor[l].parentNode == elems[k]) buf.push(searchFor[l]);
											}
										}
										elems = buf;
										buf = [];
										break;
									case "+":
										var searchFor = QF(where, parts[j]);
										for (var k = 0; k < searchFor.length; k++) {
											for (var l = 0; l < elems.length; l++) {
												var ns = elems[l];
												while ((ns = ns.nextSibling) && ns.nodeType != 1) {}
												if (ns == searchFor[k]) {
													buf.push(searchFor[l]);
													break;
												}
											}
										}
										elems = buf;
										buf = [];
										break;
									case "~":
										var searchFor = QF(where, parts[j]);
										for (var k = 0; k < searchFor.length; k++) {
											var l = 0;
											var check = true;
											while (l < elems.length && check) {
												if (elems[l].parentNode == searchFor[k].parentNode) {
													var nc = elems[l].parentNode.firstChild;
													var ind = 0;
													while (nc) {
														if (nc.nodeType == 1) {
															if (nc == elems[l]) elems[l].nodeIndex = ind;
															if (nc == searchFor[k]) searchFor[k].nodeIndex = ind;
															if (elems[l].nodeIndex && searchFor[k].nodeIndex && searchFor[k].nodeIndex > elems[l].nodeIndex) {
																buf.push(searchFor[k]);
																check = false;
																break;
															}
														}
														ind++;
														nc = nc.nextSibling;
													}
												}
												l++;
											}
										}
										elems = buf;
										buf = [];
										break;
								}
							}
							continue;
						}
					}
				}
				output = output.concat(elems);
			} else if ((params[args] != "undefined" || params[args] != "") && typeof params[args] == "object") {
				output.push(params[args]);
			}
			elems = [where];
		}
		this[0] = output;
		return output;
	},
	version: "0.2.0 beta build 20081031"
};