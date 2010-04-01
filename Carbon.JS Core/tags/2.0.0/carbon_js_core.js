/**
 * Carbon.JS - A simple JavaScript framework
 *
 * Carbon.JS Core - CSS1-3 selectors engine
 *
 * @author		Dmitry Poluhov <admin@sjs-tech.ru>
 * @license		http://www.gnu.org/licenses/gpl.html
 * @version		2.0.0 
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
		for (var i = 0; i < arguments.length; i++) {
			if (i == 0) {
				if (arguments[i] != document) params.push(arguments[i]);
			} else {
				params.push(arguments[i]);
			}
		}
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
					for (var j = 0; j < elements.length; j++) {
						var children = elements[j].parentNode.childNodes;
						var children2 = [];
						for (var k = 0; k < children.length; k++) {
							if (children[k].nodeType == 1) children2.push(children[k]);
						}
						switch (pseudo) {
							case "first-child":
								if (children2[0] === elements[j]) buf.push(elements[j]);
								break;
							case "last-child":
								if (children2[children2.length - 1] === elements[j]) buf.push(elements[j]);
								break;
							case "nth-child":
								if (/^\d+|even|odd|(-?\d*)n((\+|\-)(\d+))?$/.test(value)) {
									if (/^\d+$/.test(value) && value > 0 && value < children2.length) {
										for (var k = 0; k < children2.length; k++) {
											if ((children2[k] == elements[j]) && (k == (value - 1)) && value <= children2.length) buf.push(elements[j]);
										}
									} else if (/^even|odd$/.test(value)) {
										for (var k = 0; k < children2.length; k++) {
											if ((children2[k] == elements[j]) && ((k + 1) % 2 == (value == "even" ? 0 : 1))) buf.push(elements[j]);
										}
									} else if (/^(-?\d*)n((\+|\-)(\d+))?$/.test(value)) {
										var val = value.match(/^(-?\d*)n((\+|\-)(\d+))?$/);
										var v1 = (val[1] == "-") ? -1 : parseInt(val[1]);	// A/-
										var v3 = val[3];			// +/-
										var v4 = parseInt(val[4]);	// B
										var k = 0;
										for (var k = 0; k < children2.length; k++) {
											if (!val[1] && !val[3] && !val[4] && (children2[k] == elements[j])) { // n
												buf.push(children2[k]);
											} else if (!!val[1] && !val[3] && !val[4] && (children2[v1 * k + v1 - 1] == elements[j])) { // An
												if (v1 >= 0 && v1 * k + v1 - 1 < children2.length) buf.push(children2[v1 * k + v1 - 1]);
											} else if (!val[1] && !!val[3] && !!val[4] && (children2[v3 == "+" ? (k + v4 - (v4 == 0 ? 0 : 1)) : (v3 == "-" ? k : "")] == elements[j])) { // n+B
												if (v3 == "+" && (k + v4 - (v4 == 0 ? 0 : 1)) < children2.length) {
													buf.push(children2[k + v4 - (v4 == 0 ? 0 : 1)]);
												} else if (v3 == "-") {
													buf.push(children2[k]);
												}
											} else if (!!val[1] && !!val[3] && !!val[4] && (children2[v3 == "+" ? (v1 * k + (v4 == 0 ? (v1 - 1) : 0) + v4 - (v4 == 0 ? 0 : 1)) : (v3 == "-" ? (v1 * k + (v4 == 0 ? (v1 - 1) : 0) - v4 - (v4 == 0 ? 0 : 1)) : "")] == elements[j])) { // An+B
												if (v3 == "+" && (v1 * k + (v4 == 0 ? (v1 - 1) : 0) + v4 - (v4 == 0 ? 0 : 1)) >= 0 && (v1 * k + (v4 == 0 ? (v1 - 1) : 0) + v4 - (v4 == 0 ? 0 : 1)) < children2.length) {
													buf.push(children2[v1 * k + (v4 == 0 ? (v1 - 1) : 0) + v4 - (v4 == 0 ? 0 : 1)]);
												} else if (v3 == "-" && (v1 * k + (v4 == 0 ? (v1 - 1) : 0) - v4 - (v4 == 0 ? 0 : 1)) >= 0 && (v1 * k + (v4 == 0 ? (v1 - 1) : 0) - v4 - (v4 == 0 ? 0 : 1)) < children2.length) {
													buf.push(children2[v1 * k + (v4 == 0 ? (v1 - 1) : 0) - v4 - (v4 == 0 ? 0 : 1)]);
												}
											}
										}
									}
								}
								break;
							case "only-child":
								if (children2.length == 1 && children2[0] === elements[j]) buf.push(elements[j]);
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
								if (/^([a-zA-Z0-9*]+)(:[^:]+)*$/.test(value) || /^([a-zA-Z0-9*]+)\.(\w+)(:[^:]+)*$/.test(value)) {
									badNodes = QF(where, value);
								} else if (/^\.(\w+)(:[^:]+)*$/.test(value) || regs[2].test(value) || regs[3].test(value)) {
									badNodes = QF(where, nm + value);
								}
								var t = 0;
								var na = [];
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
								if (elements[j].innerHTML.indexOf(value) != -1) buf.push(elements[j]);
								break;
						}
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
								if (className != "" && new RegExp("(^|\s)" + className + "(\s|$)").test(cur[k].className) && !buf.inArray(cur[k])) {
									buf.push(cur[k]);
								} else if (className == "" && !buf.inArray(cur[k])) {
									buf.push(cur[k]);
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
							var searchFor = QF(where, parts[j]);
							switch (combinators[j]) {
								case ">":
									for (var k = 0; k < searchFor.length; k++) {
										for (var l = 0; l < elems.length; l++) {
											if (searchFor[k].parentNode == elems[l] && !buf.inArray(searchFor[k])) buf.push(searchFor[k]);
										}
									}
									elems = buf;
									buf = [];
									break;
								case "+":
									for (var k = 0; k < searchFor.length; k++) {
										for (var l = 0; l < elems.length; l++) {
											if (elems[l].nextSibling) {
												var ns = elems[l].nextSibling;
												var y = true;
												while (y && ns.nodeType != 1) {
													if (ns.nextSibling) {
														ns = ns.nextSibling;
													} else {
														y = false;
													}
												}
											}
											if (ns == searchFor[k] && !buf.inArray(searchFor[k])) buf.push(searchFor[k]);
										}
									}
									elems = buf;
									buf = [];
									break;
								case "~":
									for (var k = 0; k < searchFor.length; k++) {
										for (var l = 0; l < elems.length; l++) {
											if (elems[l].parentNode == searchFor[k].parentNode) {
												var ind1 = 0;
												var ind2 = 0;
												var children = elems[l].parentNode.childNodes;
												for (var m = 0; m < children.length; m++) {
													if (children[m].nodeType == 1) {
														if (children[m] == elems[l]) ind1 = m;
														if (children[m] == searchFor[k]) ind2 = m;
													}
												}
												if (ind2 > ind1 && !buf.inArray(searchFor[k])) {
													buf.push(searchFor[k]);
													break;
												}
											}
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
				output = output.concat(elems);
			} else if ((params[args] != "undefined" || params[args] != "") && typeof params[args] == "object") {
				output.push(params[args]);
			}
			elems = [document];
		}
		this[0] = output;
		return output;
	}
};