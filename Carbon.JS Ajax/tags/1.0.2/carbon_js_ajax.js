/**
 * Carbon.JS - A simple JavaScript framework
 *
 * Carbon.JS Ajax Module - Basic Ajax functions
 *
 * @author		Dmitry Poluhov <admin@sjs-tech.ru>
 * @author		Aleksandr Michalicyn <admin@systemnik.net.ru> (ajax-timeout, headers, onreadystatechange and HTTP-Authentification)
 * @license		http://www.gnu.org/licenses/gpl.html
 * @version		1.0.2
 */
 
/**
 * This means that this module was connected to the document by loadModule or by script-tag
 */ 
CarbonJS.modules.ajax = "enabled";

/**
 * Q().ajaxIt({
 * 	url: <URL of target-script>,
 * 	method: <Get|Post>,
 * 	[usersActivity: <User activity during query>,]
 * 	[username: <Username>,]
 * 	[password: <Password>,]
 * 	params: {
 * 		<Parameter 1>: <Value>,
 * 		<Parameter 2>: <Value>,
 * 		...
 * 	},
 * 	[headers: {
 * 		"Content-type": <Value>,
 * 		<Header 2>: <Value>,
 * 		...
 * 	},]
 * 	[timeout: <Timeout of the request in milliseconds>,]
 * 	[onreadystatechange: function(state) {
 * 		// Tracking the status of the server
 * 	},]
 * 	onSuccess: function(request) { 
 * 		// The function to be executed in the case of a successful request to the server
 * 	},
 * 	[onError: function() {
 * 		// The function to be executed in the case of an error
 * 	}]
 * });
 */

/**
 * Add support of parsing JSON
 */
CarbonJS.json = null;
if (typeof JSON != "undefined") CarbonJS.json = JSON;
var JSON = {
	
	/**
	 * Function of parsing strings with JSON received from Ajax-requests with support of native object JSON of the latest browsers
	 * @param {String} text String with JSON
	 * @return {Object}
	 */
	parse: function(text) {
		if (CarbonJS.json != null) return CarbonJS.json.parse(text);
		if (navigator.userAgent.toLowerCase().indexOf("firefox") != -1) return new Function("return " + text)();
		return eval("(" + text + ")");
	}
};     

CarbonJS.extend({

	/**
	 * Function of creating Ajax-requests
	 * @param {Object} ajaxdarr Settings of the request
	 * @return {NodeList}
	 */
	ajaxIt: function(ajaxdarr) {
		var jsRequest = null;
		try {
			jsRequest = new XMLHttpRequest();
		} catch (trymicrosoft) {
			try {
				jsRequest = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (othermicrosoft) {
				try {
					jsRequest = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (failed) {
					jsRequest = null;
				}
			}
		}
		if (jsRequest != null) {
			if (ajaxdarr.url != "" || ajaxdarr.method != "" || ajaxdarr.usersActivity != "") {
				if (ajaxdarr.method.toUpperCase() == "GET" || ajaxdarr.method.toUpperCase() == "POST") {
					var url = ajaxdarr.url;
					var method = ajaxdarr.method.toUpperCase();
					var usersActivity = ajaxdarr.usersActivity ? ajaxdarr.usersActivity : true;
					var time = ajaxdarr.timeout ? ajaxdarr.timeout : false;
					var username = ajaxdarr.username ? ajaxdarr.username : "";
					var password = ajaxdarr.password ? ajaxdarr.password : "";
					var headers = ajaxdarr.headers ? ajaxdarr.headers : {};
					var pn = 0;
					for (var p in ajaxdarr.params) {
						url += ((pn == 0) ? "?" : "&") + p + "=" + encodeURIComponent(ajaxdarr.params[p]);
						pn++;
					}
					if (method == "GET") url += ((url.indexOf("?") == -1) ? "?" : "&") + "nocache=" + new Date().getTime();
					jsRequest.open(method, url, usersActivity, username, password);
					jsRequest.onreadystatechange = function() {
						if (ajaxdarr.onreadystatechange) ajaxdarr.onreadystatechange(jsRequest.readyState);
						if (jsRequest.readyState == 4) {
							clearTimeout(timeout);
							if (jsRequest.status == 200) {
								if (ajaxdarr.onSuccess != null) ajaxdarr.onSuccess(jsRequest);
							} else {
								var message = jsRequest.getResponseHeader("Status");
								if (message == null || message.length <= 0) {
									if (ajaxdarr.onError != null) {
										ajaxdarr.onError(jsRequest);
									} else {
										var errm = "Ошибка / Error #" + jsRequest.status;
										switch (jsRequest.status) {
											case 0:
												errm += "\nОтсутствует соединение с сервером\nNo connection";
												break;
											case 404:
												errm += "\nОтсутствует принимающий скрипт на сервере\nScript not found";
												break;
											case 403:
												errm += "\nДоступ к серверу запрещён\nForbidden";
												break;
											case 500:
												errm += "\nОшибка сервера, свяжитесь с администратором\nInternal server error, contact the Webmaster";
												break;
										}
										alert(errm);
									}
								} else {
									if (ajaxdarr.onError != null) {
										ajaxdarr.onError(jsRequest);
									} else {
										alert("Ошибка Ajax-запроса / Error of ajax-request: " + message);
									}
								}
							}
						}
					}
					var data = null;
					if (method == "POST") {
						data = "";
						var pn = 0;
						for (var p in ajaxdarr.params) {
							data += ((pn == 0) ? "" : "&") + p + "=" + encodeURIComponent(ajaxdarr.params[p]);
							pn++;
						}
						var noct = true;
						for (var k in headers) {
							if (/[cC]ontent\-[tT]ype/.test(k)) noct = false;
							jsRequest.setRequestHeader(k, headers[k]);
						}
						if (noct) jsRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
					}
					jsRequest.send(data);
					if (time) {
						var timeout = setTimeout(function() {
							jsRequest.abort();
						}, time);
					}
				}
			}
		} else {
			if (ajaxdarr.onError != null) {
				ajaxdarr.onError(jsRequest);
			} else {
				alert("Ошибка создания Ajax-запроса\nError creating Ajax-request");
			}
		}
		return this;
	}
});