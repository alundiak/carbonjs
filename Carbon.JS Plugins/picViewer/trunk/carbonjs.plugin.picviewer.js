/**
 * Carbon.JS - A simple JavaScript framework
 *
 * Carbon.JS Plugin - Animated viewer of images
 *
 * @author		Dmitry Polyuhov <admin@carbonjs.com>
 * @license		http://carbonjs.com/mit-license.txt
 * @version		1.1.0
 */

CarbonJS.extend({
	picViewer: function() {
		CarbonJS.checkModules("animation", "dom", "utilities");
		Q("head").append({
			tag: "link",
			attr: {
				rel: "stylesheet",
				type: "text/css",
				href: CarbonJS.url + "plugins/picViewer/style.css"
			}
		});
		var imgs = [], srcs = [], titles = [], num = this.length;
		var view = function(index) { // Функция загрузки изображений
			var picTitle = titles[index];
			var timer = setInterval(function() {
				if (imgs[index].complete) {
					clearInterval(timer);
					var width = imgs[index].width;
					var height = imgs[index].height;
					Q("#loader").css({display: "none"});
					var pv = Q("#picViewer");
					var pc = Q("#pv_content");
					var t1 = (parseInt(pc.css("width")) == width && parseInt(pc.css("height")) == height);
					pv.change({
						left: [pv.x(), (screen.width - width) / 2],
						top: [pv.y(), (screen.height - height) / 2 - 100 + self.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || (document.body && document.body.scrollTop)]
					}, CarbonJS.Transitions.Sine.EaseOut, 700);
					pc.change({
						width: [parseInt(pc.css("width")), width],
						height: [parseInt(pc.css("height")), height],
						onChanged: function() {
							Q("#pv_content").css({
								width: width,
								height: height
							}).prepend({
								tag: "img",
								id: "pv_pic",
								attr: {src: imgs[index].src}
							});
							Q("#pv_pic").change({
								opacity: [0, 100],
								onChanged: function() {
									var pt = Q("#pv_title");
									pt.css({display: "block"}).change({
										height: [0, 30],
										onStart: function() {
											Q("#pv_prev", "#pv_next").transparence(100);
											if ((index + 1) == num) Q("#pv_next").transparence(40);
											if ((index + 1) == 1) Q("#pv_prev").transparence(40);
										},
										onChanged: function() {
											Q("#pv_prev").removeEvent("click").addEvent("click", function() {
												if (Q("#pv_prev").transparence() != 40) {
													chPic(index - 1);
													Q("#pv_prev", "#pv_next").transparence(40);
												}
											});
											Q("#pv_next").removeEvent("click").addEvent("click", function() {
												if (Q("#pv_next").transparence() != 40) {
													chPic(index + 1);
													Q("#pv_prev", "#pv_next").transparence(40);
												}
											});
											pv.attr({pvIndex: index});
										}
									}, CarbonJS.Transitions.Sine.EaseOut, 500);
									pv.attr({sh: true});
									
									Q("#pv_text").append({
										tag: "span",
										children: [picTitle]
									}, (num != 1 ? (" (" + (index + 1) + " / " + num + ")") : "") + " ");
									Q("#pv_close").addEvent("click", function() {
										Q().shadow({to: "hide", time: 500});
										pv.css({display: "none"});
									});
								}
							}, CarbonJS.Transitions.Line.EaseIn, 500);
						}
					}, CarbonJS.Transitions.Sine.EaseOut, t1 ? 1 : 700);
				}
			}, 10);
			if (imgs[index].src == "") imgs[index].src = srcs[index];
		}
		var chPic = function(ind) { // Функция смены изображений в picViewer
			imgs[ind].src = srcs[ind];
			var pc = Q("#pv_content");
			var pt = Q("#pv_title");
			pt.stopChanging().change({
				height: [30, 0],
				onChanged: function() {
					Q("#pv_text").html("");
					Q("#pv_pic").change({
						opacity: [100, 0],
						onChanged: function() {
							Q("#pv_pic").remove();
							Q("#loader").css({
								display: "block",
								position: "absolute",
								left: (parseInt(pc.css("width")) - 32) / 2 + "px",
								top: (parseInt(pc.css("height")) - 32) / 2 + "px"
							});
							view(ind);
						}
					}, CarbonJS.Transitions.Line.EaseIn, 500);
					pt.css({display: "none"});
					Q("#pv_prev", "#pv_next").transparence(40);
				}
			}, CarbonJS.Transitions.Sine.EaseOut, 500);
		}
		this.forEach(function(index) {
			imgs[imgs.length] = new Image();
			srcs[srcs.length] = this.href;
			titles[titles.length] = this.title;
			this.pvIndex = index;
			var th = this;
			Q(this).addEvent("click", function(evt) { // Вешаем обработчик события на ссылки-миниатюры
				Q().shadow({time: 500});
				if (!Q("#picViewer")[0]) { // Если picViewer ещё не создан на странице,
					Q("body").append({ // то создаём его структуру
						tag: "div",
						id: "picViewer",
						css: {
							position: "absolute",
							top: "50px",
							left: "100px"
						},
						children: [{
							tag: "table",
							attr: {
								border: 0,
								cellPadding: 0,
								cellSpacing: 0
							},
							children: [{
								tag: "tbody",
								children: [{
									tag: "tr",
									children: [{
										tag: "td",
										id: "lt",
										css: {background: "url(" + CarbonJS.url + "plugins/picViewer/pics/pv-tl.png) no-repeat"}
									},{
										tag: "td",
										id: "t",
										css: {background: "url(" + CarbonJS.url + "plugins/picViewer/pics/pv-t.png) repeat-x"}
									},{
										tag: "td",
										id: "rt",
										css: {background: "url(" + CarbonJS.url + "plugins/picViewer/pics/pv-tr.png) no-repeat"}
									}]
								},{
									tag: "tr",
									children: [{
										tag: "td",
										id: "l",
										css: {background: "url(" + CarbonJS.url + "plugins/picViewer/pics/pv-l.png) repeat-y"}
									},{
										tag: "td",
										id: "pv_content",
										children: [{
											tag: "div",
											id: "pv_title",
											children: [{
												tag: "table",
												attr: {
													border: 0,
													cellPadding: 0,
													cellSpacing: 0,
													width: "100%"
												},
												children: [{
													tag: "tbody",
													children: [{
														tag: "tr",
														children: [{
															tag: "td",
															id: "pv_triggers",
															attr: {width: "55"},
															children: [{
																tag: "img",
																id: "pv_prev",
																attr: {
																	src: CarbonJS.url + "plugins/picViewer/pics/prev.png",
																	width: "24",
																	height: "24",
																	alt: "Предыдущая"
																}
															},{
																tag: "img",
																id: "pv_next",
																attr: {
																	src: CarbonJS.url + "plugins/picViewer/pics/next.png",
																	width: "24",
																	height: "24",
																	alt: "Следующая"
																}
															}]
														},{
															tag: "td",
															id: "pv_text"
														},{
															tag: "td",
															id: "pv_close",
															attr: {width: "30"},
															children: [{
																tag: "img",
																id: "pv_close",
																attr: {
																	src: CarbonJS.url + "plugins/picViewer/pics/close.png",
																	width: "24",
																	height: "24",
																	alt: "Закрыть"
																}
															}]
														}]
													}]
												}]
											}]
										}]
									},{
										tag: "td",
										id: "r",
										css: {background: "url(" + CarbonJS.url + "plugins/picViewer/pics/pv-r.png) repeat-y"}
									}]
								},{
									tag: "tr",
									children: [{
										tag: "td",
										id: "lb",
										css: {background: "url(" + CarbonJS.url + "plugins/picViewer/pics/pv-bl.png) no-repeat"}
									},{
										tag: "td",
										id: "b",
										css: {background: "url(" + CarbonJS.url + "plugins/picViewer/pics/pv-b.png) repeat-x"}
									},{
										tag: "td",
										id: "rb",
										css: {background: "url(" + CarbonJS.url + "plugins/picViewer/pics/pv-br.png) no-repeat"}
									}]
								}]
							}]
						}]
					});
				}
				var pv = Q("#picViewer");
				var pc = Q("#pv_content");
				pv.css({display: "block"})
				if (!pv.attr("sh")) pv.x((screen.width - parseInt(pc.css("width"))) / 2).y((screen.height - parseInt(pc.css("height"))) / 2 - 100 + self.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || (document.body && document.body.scrollTop));
				if (!Q("#loader")[0] && !pv.attr("sh")) {
					Q("#pv_content").prepend({
						tag: "img",
						id: "loader",
						attr: {src: CarbonJS.url + "plugins/picViewer/pics/loader.gif"}
					});
				}
				if (!pv.attr("sh")) {
					view(index);
				} else {
					if (pv.attr("pvIndex") != index) chPic(index);
				}
				if (evt.preventDefault) evt.preventDefault();
				return false;
			})
		});
		return this;
	}
});