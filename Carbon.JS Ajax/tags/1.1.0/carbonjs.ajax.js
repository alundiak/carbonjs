/**
 * Carbon.JS - A simple JavaScript framework
 *
 * Carbon.JS Ajax Module - Basic Ajax functions
 *
 * @author		Dmitry Polyuhov <admin@carbonjs.com>, Aleksandr Mihalicyn <http://mihalicyn.ru>
 * @license		http://carbonjs.com/mit-license.txt
 * @version		1.1.0 (build 20100321)
 */
 
/**
 * This means that this module was connected to the document by loadModule or by script-tag
 */ 
CarbonJS.modules.ajax = true;

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
	ajax: function(ajaxdarr) {
		var url = ajaxdarr.url || ""; // URL принимающего скрипта
		var method = ajaxdarr.method ? ajaxdarr.method.toUpperCase() : "GET"; // Метод передачи (по умолчанию GET)
		var async = ajaxdarr.async || true; // Асинхронный запрос или синхронный
		var username = ajaxdarr.username || ""; // Имя пользователя
		var password = ajaxdarr.password || ""; // Пароль
		var params = ajaxdarr.params || {}; // Параметры, передаваемые принимающему скрипту
		var headers = ajaxdarr.headers || {}; // Заголовки запроса
		var time = ajaxdarr.timeout || false; // Таймаут соединения
		
		var jsRequest = null, interval;
		try { // Создаём кросс-браузерный объект запроса
			jsRequest = new XMLHttpRequest();
		} catch (e1) {
			try {
				jsRequest = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (e2) {
				try {
					jsRequest = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (failed) {
					jsRequest = null;
				}
			}
		}
		
		if (jsRequest != null) {
			var pn = 0;
			if (method == "GET") {
				for (var p in params) url += ((pn++ == 0) ? "?" : "&") + p + "=" + encodeURIComponent(params[p]); // Записываем переданные параметры в строку запроса
				url += ((url.indexOf("?") == -1) ? "?" : "&") + "nocache=" + new Date().getTime(); // Чтобы избежать кэширования запросов, добавляем к ним метки
			}
			
			jsRequest.open(method, url, async, username, password);
			var readyStateChange = setInterval(function() { // Чтобы избежать утечек памяти, вместо onreadystatechange используем таймер
				if (ajaxdarr.onReadyStateChange) ajaxdarr.onReadyStateChange(jsRequest.readyState);
				if (jsRequest.readyState == 4) {
					clearTimeout(interval); // readyState == 4, значит обнуляем таймер проверки состояния ответа
					clearInterval(readyStateChange); // и таймер сброса соединения
					if (jsRequest.status == 200) {
						if (ajaxdarr.onSuccess) ajaxdarr.onSuccess(jsRequest);
					} else { // Возникла ошибка - вывести её на экран
						var message = jsRequest.getResponseHeader("Status");
						if (message == null || message.length <= 0) {
							if (ajaxdarr.onError) {
								ajaxdarr.onError(jsRequest);
							} else {
								var errm = "Error #" + jsRequest.status;
								switch (jsRequest.status) { // Top-4 самых распространённых ошибок запросов
									case 0:
										errm += "\nNo connection";
										break;
									case 404:
										errm += "\nScript not found";
										break;
									case 403:
										errm += "\nForbidden";
										break;
									case 500:
										errm += "\nInternal server error, please contact the administrator";
										break;
								}
								alert(errm);
							}
						} else {
							if (ajaxdarr.onError) {
								ajaxdarr.onError(jsRequest);
							} else {
								alert("Error of ajax-request: " + message);
							}
						}
					}
				}
			}, 10);
			var data = null;
			if (method == "POST") {
				data = "";
				var pn = 0;
				for (var p in params) data += ((pn++ == 0) ? "" : "&") + p + "=" + encodeURIComponent(params[p]); // При передаче Post'ом также переводим переданные параметры в строку
				var noct = true;
				for (var k in headers) {
					if (/[cC]ontent\-[tT]ype/.test(k)) noct = false;
					jsRequest.setRequestHeader(k, headers[k]); // При передаче Post'ом обязательно нужно указывать тип отсылаемых данных
				}
				if (noct) jsRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			}
			jsRequest.send(data);
			if (time) {
				interval = setTimeout(function() {
					jsRequest.abort();
				}, time);
			}
		} else {
			throw new CarbonJS.Exceptions.DoesntSupportXHR(); // Если не получилось создать объект запроса, кидаем исключение
		}
		return this;
	}
});