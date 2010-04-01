/**
 * Carbon.JS - A simple JavaScript framework
 *
 * Carbon.JS Plugin - Animated accordion
 *
 * @author		Dmitry Polyuhov <admin@carbonjs.com>
 * @license		http://carbonjs.com/mit-license.txt
 * @version		1.1.0 (build 20100321)
 */

CarbonJS.extend({
	accordion: function(params) {
		CarbonJS.checkModules("animation", "dom", "utilities");
		var orientation = params.orientation || "v"; // Ориентация аккордеона (v - вертикальная, h - горизонтальная
		var timeout = parseInt(params.timeout) || 500;  // Время смены закладок
		var containerId = "#" + this[0].id;
		var evt = params.event || "click"; // Событие, по которому будет происходить смена закладок
		var oneOpened = params.oneOpened || true; // Могут ли быть все закладки закрытыми в данный момент
		var check = true;
		var onOpening = function() {}; // "Обработчик события" начала разворачивания закладки
		if (params.onOpening) onOpening = params.onOpening;
		var onOpened = function() {}; // "Обработчик события" завершения разворачивания закладки
		if (params.onOpened) onOpened = params.onOpened;
		var onClosing = function() {}; // "Обработчик события" начала сворачивания закладки
		if (params.onClosing) onClosing = params.onClosing;
		var onClosed = function() {};  // "Обработчик события" завершения сворачивания закладки
		if (params.onClosed) onClosed = params.onClosed;
		var headers = Q(containerId + " [class*=acc-header]");
		var contents = Q(containerId + " [class*=acc-content]");
		var heights = [];
		var widths = [];
		contents.forEach(function(i) {		
			var current = Q(this);
			heights[heights.length] = this.offsetHeight;
			widths[widths.length] = this.offsetWidth;
			current.attr({accIndex: i});
			if (i + 1 != parseInt(params.opened)) {
				current.hide();
				if (orientation == "v") {
					current.css({height: "0px"});
				} else if (orientation == "v") {
					current.css({width: "0px"});
				}
			}
		}).css({overflow: "hidden"});
		headers.forEach(function(ik) {
			Q(this).addEvent(evt, function() {
				if (check) {
					contents.forEach(function(j) {
						var currentContainer = Q(this);
						if (ik == j) {
							if (CarbonJS.elemIsHidden(currentContainer[0])) {
								check = false;
								if (orientation == "v") {
									currentContainer.show().change({
										height: [CarbonJS.Browsers.IE() ? 1 : 0, heights[ik]],
										onChanging: function() {
											onOpening.apply(currentContainer);
										},
										onChanged: function() {
											onOpened.apply(currentContainer);
											check = true;
										}
									}, CarbonJS.Transitions.Sine.EaseOut, timeout);
								} else if (orientation == "h") {
									currentContainer.show().change({
										width: [CarbonJS.Browsers.IE() ? 1 : 0, widths[ik]],
										onChanging: function() {
											onOpening.apply(currentContainer);
										},
										onChanged: function() {
											onOpened.apply(currentContainer);
											check = true;
										}
									}, CarbonJS.Transitions.Sine.EaseOut, timeout);
								}
							} else if (!oneOpened) {
								check = false;
								if (orientation == "v") {
									currentContainer.change({
										height: [heights[ik], CarbonJS.Browsers.IE() ? 1 : 0],
										onChanged: function() {
											Q(this).hide();
											onClosed.apply(currentContainer);
											check = true;
										},
										onChanging: function() {
											onClosing.apply(currentContainer);
										}
									}, CarbonJS.Transitions.Sine.EaseOut, timeout);
								} else if (orientation == "h") {
									currentContainer.change({
										width: [widths[ik], CarbonJS.Browsers.IE() ? 1 : 0],
										onChanged: function() {
											Q(this).hide();
											onClosed.apply(currentContainer);
											check = true;
										},
										onChanging: function() {
											onClosing.apply(currentContainer);
										}
									}, CarbonJS.Transitions.Sine.EaseOut, timeout);
								}
							}
						} else {
							if (!CarbonJS.elemIsHidden(currentContainer[0])) {
								check = false;
								if (orientation == "v") {
									currentContainer.change({
										height: [heights[currentContainer.attr("accIndex")], CarbonJS.Browsers.IE() ? 1 : 0],
										onChanged: function() {
											Q(this).hide();
											onClosed.apply(currentContainer);
											check = true;
										},
										onChanging: function() {
											onClosing.apply(currentContainer);
										}
									}, CarbonJS.Transitions.Sine.EaseOut, timeout);
								} else if (orientation == "h") {
									currentContainer.change({
										width: [widths[currentContainer.attr("accIndex")], CarbonJS.Browsers.IE() ? 1 : 0],
										onChanged: function() {
											Q(this).hide();
											onClosed.apply(currentContainer);
											check = true;
										},
										onChanging: function() {
											onClosing.apply(currentContainer);
										}
									}, CarbonJS.Transitions.Sine.EaseOut, timeout);
								}
							}
						}
					});
				}	
			});
		});
		return this;
	}
});