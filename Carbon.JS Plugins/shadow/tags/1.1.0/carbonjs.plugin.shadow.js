/**
 * Carbon.JS - A simple JavaScript framework
 *
 * Carbon.JS Plugin - Set/hide shadow on the page
 *
 * @author		Dmitry Polyuhov <admin@carbonjs.com>
 * @license		http://carbonjs.com/mit-license.txt
 * @version		1.1.0 (build 20100321)
 */

CarbonJS.extend({
	shadow: function(params) {
		CarbonJS.checkModules("animation", "utilities");
		var todo = params && params.to ? params.to : "set"; // Параметр, отвечающий за то, устанавливается тень на страницу, или снимается с неё
		var color = params && params.color ? params.color : "#000000"; // Цвет тени
		var opacity = params && params.opacity ? parseInt(params.opacity) : 50; // Прозрачность тени
		var method = params && params.method ? params.method.split(".") : ["Line", "EaseIn"]; // Закон изменения прозрачности тени (см. animation-module)
		var time = params && params.time ? parseInt(params.time) : 0; // Время изменения прозрачности
		if (!Q("#shd")[0]) {
			Q("body").prepend({
				tag: "div",
				id: "shd",
				css: {
					position: "absolute",
					"z-index": "50"
				}
			});
		}
		Q("#shd").show().css({"background-color": color}).transparence(opacity);
		var xScroll, yScroll, windowWidth, windowHeight; // Кросс-браузерное вычисление размеров страницы
		if (window.innerHeight && window.scrollMaxY) {
			xScroll = document.body.scrollWidth;
			yScroll = window.innerHeight + window.scrollMaxY;
		} else if (document.body.scrollHeight > document.body.offsetHeight) {
			xScroll = document.body.scrollWidth;
			yScroll = document.body.scrollHeight;
		} else {
			xScroll = document.body.offsetWidth;
			yScroll = document.body.offsetHeight;
		}
		if (self.innerHeight) {
			windowWidth = self.innerWidth;
			windowHeight = self.innerHeight;
		} else if (document.documentElement && document.documentElement.clientHeight) {
			windowWidth = document.documentElement.clientWidth;
			windowHeight = document.documentElement.clientHeight;
		} else if (document.body) {
			windowWidth = document.body.clientWidth;
			windowHeight = document.body.clientHeight;
		}
		if (yScroll < windowHeight) {
			pageHeight = windowHeight;
		} else {
			pageHeight = yScroll;
		}
		if (xScroll < windowWidth) {
			pageWidth = windowWidth;
		} else {
			pageWidth = xScroll;
		}
		Q("#shd").x(0).y(0).css({
			width: pageWidth + "px",
			height: pageHeight + "px"
		});
		if (todo == "set") {
			Q("#shd").change({
				opacity: [0, opacity],
				onChanged: function() {
					Q(window).removeEvent("scroll").addEvent("scroll", function() {
						Q("#shd").css({height: pageHeight + document.body.scrollTop + "px"});
					});
				}
			}, CarbonJS.Transitions[method[0]][method[1]], time);
		} else {
			Q("#shd").change({
				opacity: [opacity, 0],
				onChanged: function() {
					Q(this).hide();
				}
			}, CarbonJS.Transitions[method[0]][method[1]], time);
		}
		return this;
	}
});