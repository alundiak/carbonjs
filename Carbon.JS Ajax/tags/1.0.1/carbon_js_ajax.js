/**
 * Carbon.JS - A simple JavaScript framework
 *
 * Carbon.JS Ajax Module - Basic Ajax functions
 *
 * @author		Dmitry Poluhov <admin@sjs-tech.ru>
 * @author		Aleksandr Michalicyn <admin@systemnik.net.ru> (ajax-timeout, headers, onreadystatechange and HTTP-Authentification)
 * @license		http://www.gnu.org/licenses/gpl.html
 * @version		1.0.1
 */
 
CarbonJS.modules.ajax = "enabled";

/*
Q().ajaxIt({
	url: "url_скрипта,_к_которому_мы_будем_обращаться",
	method: "метод_передачи_данных_на_сервер",
	usersActivity: "пользовательская_активность_во_время_запроса",
	username: "имя_пользователя",
	password: "пароль",
	params: {
		"параметр_1": "значение",
		"параметр_2": "значение",
		…
	},
	headers: { // Заголовки
		"Content-type": "...",
		...
	},
	timeout: "таймаут_запроса_в_миллисекундах",
	onreadystatechange: function(state) {
		// Отслеживание состояния сервера
	},
	onSuccess: function(request) { 
		// функция, которая выполнится в случае удачного запроса серверу
	},
	onError: function() {
		// функция, которая выполнится, если произойдёт ошибка запроса
	}
});
*/

CarbonJS.extend({
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

					// Timeout for Ajax
					var time = ajaxdarr.timeout ? ajaxdarr.timeout : false;

					// User name and pass for HTTP Auth
					var username = ajaxdarr.username ? ajaxdarr.username : "";
					var password = ajaxdarr.password ? ajaxdarr.password : "";

					// Advanced headers
					var headers = ajaxdarr.headers ? ajaxdarr.headers : {};
					var pn = 0;
					for (var p in ajaxdarr.params) {
						url += ((pn == 0) ? "?" : "&") + p + "=" + encodeURIComponent(ajaxdarr.params[p]);
						pn++;
					}
					if (method == "GET") {
						url += ((url.indexOf("?") == -1) ? "?" : "&") + "nocache=" + new Date().getTime();
					}
					jsRequest.open(method, url, usersActivity, username, password); // Username and password for HTTP Auth
					jsRequest.onreadystatechange = function() {
						if (ajaxdarr.onreadystatechange) {
							ajaxdarr.onreadystatechange(jsRequest.readyState);
						}
						if (jsRequest.readyState == 4) {
							clearTimeout(timeout); // Clear timeout!
							if (jsRequest.status == 200) {
								if (ajaxdarr.onSuccess != null) {
									ajaxdarr.onSuccess(jsRequest);
								}
							} else {
								var message = jsRequest.getResponseHeader("Status");
								if (message == null || message.length <= 0) {
									if (ajaxdarr.onError != null) {
										ajaxdarr.onError(jsRequest);
									} else {
										var errm = "Ошибка Ajax-запроса #" + jsRequest.status;
										switch (jsRequest.status) {
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
									if (ajaxdarr.onError != null) {
										ajaxdarr.onError(jsRequest);
									} else {
										alert("Ошибка Ajax-запроса: " + message);
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
					// Timeout
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
				alert("Ошибка создания Ajax-запроса");
			}
		}
		return this;
	}
});