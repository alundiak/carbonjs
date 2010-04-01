/**
 * Carbon.JS - A simple JavaScript framework
 *
 * Carbon.JS Animation Module - Basic animation functions with transition curves
 *
 * @author		Dmitry Poluhov <admin@sjs-tech.ru>
 * @license		http://www.gnu.org/licenses/gpl.html
 * @version		1.0.0 
 */
CarbonJS.modules.animation = "enabled";

CarbonJS.Transitions = {};
CarbonJS.Transitions.types = {
	Line: function(p) {
		return p;
	},
	Sine: function(p) {
		return 1 - Math.sin((1 - p) * Math.PI / 2);
	},
	Back: function(p) {
		return Math.pow(p, 2) * (2.618 * p - 1.618);
	},
	Quad: function(p) {
		return Math.pow(p, 2);
	},
	Cubic: function(p) {
		return Math.pow(p, 3);
	},
	Quart: function(p) {
		return Math.pow(p, 4);
	},
	Quint: function(p) {
		return Math.pow(p, 5);
	},
	Bounce: function(p) {
		var value;
		for (var a = 0, b = 1; 1; a += b, b /= 2) {
			if (p >= (7 - 4 * a) / 11) {
				value = b * b - Math.pow((11 - 6 * a - 11 * p) / 4, 2);
				break;
			}
		}
		return value;
	}
};
for (var t in CarbonJS.Transitions.types) { 
	CarbonJS.Transitions[t] = {}; 
	CarbonJS.Transitions[t].EaseIn = function(p) { 
		return this(p); 
	}.bind(CarbonJS.Transitions.types[t]); 
	CarbonJS.Transitions[t].EaseOut = function(p) { 
		return 1 - this(1 - p); 
	}.bind(CarbonJS.Transitions.types[t]); 
	CarbonJS.Transitions[t].EaseInOut = function(p) { 
		return (p <= 0.5) ? this(2 * p) / 2 : (2 - this(2 * (1 - p))) / 2; 
	}.bind(CarbonJS.Transitions.types[t]); 
}
CarbonJS.extend({
	change: function(params, curve, time) {
		var onstart = null;
		var onchanging = null;
		var onchanged = null;
		function Changing(curve, time, callback) {
			this.st = new Date().getTime();
			this.time = time;
			this.curve = curve;
			this.callback = callback;
			var that = this;
			this.runCallback = function(bool, obj) {
				that.start(bool, obj);
			};
		}
		Changing.prototype.start = function(bool, obj) {
			if (!this.hasNext()) {
				if (onchanged != null && !!bool) onchanged.apply(obj);
				return;
			}
			this.callback(this.next());
			setTimeout(function() {
				this.runCallback(bool, obj);
			}.bind(this), 10);
			if (onchanging != null) onchanging();
		}
		Changing.prototype.hasNext = function() {
			if (this.done) return this.oneLeft;
			var now = new Date().getTime();
			if ((now - this.st) > this.time) {
				this.done = true;
				this.oneLeft = true;
			}
			return true;
		}
		Changing.prototype.next = function() {
			this.oneLeft = false;
			var now = new Date().getTime();
			var percentage = Math.min(1, (now - this.st) / this.time);
			return this.curve(percentage);
		}
		function getColors(color) {
			var rgb = color.replace(/[# ]/g, "").replace(/^(.)(.)(.)$/, "$1$1$2$2$3$3").match(/.{2}/g);
			return {
				'r': parseInt(rgb[0], 16),
				'g': parseInt(rgb[1], 16),
				'b': parseInt(rgb[2], 16)
			};
		}
		var changes = {};
		this.forEach(function() {
			changes[this] = {};
			changes[this].num = 0;
			for (var p in params) {
				if (p != "onStart" && p != "onChanging" && p != "onChanged") changes[this].num++;
			}
			var i = 1;
			for (var p in params) {
				if (typeof params[p] == "function") {
					if (p == "onStart") onstart = params[p];
					if (p == "onChanging") onchanging = params[p];
					if (p == "onChanged") onchanged = params[p];
					params[p] = null;
				}
				if (params[p] != null) {
					var obj = this;
					new Changing(curve, time, function(percentage) {
						if (!this.name) this.name = obj;
						if (!this.parm) this.parm = params[p];
						if (!this.p) {
							if (p != "MozOpacity" && p != "KhtmlOpacity") {
								this.p = p.replace(/\-(\w)/g, function() {
									return arguments[1].toUpperCase();
								});
							} else {
								this.p = p;
							}
						}
						if (typeof this.parm[0] == "string" && typeof this.parm[1] == "string") {
							if (!this.r) this.r = 0;
							if (!this.g) this.g = 0;
							if (!this.b) this.b = 0;
							var sc = getColors(this.parm[0]);
							var ec = getColors(this.parm[1]);
							this.r = Math.floor((ec.r - sc.r) * percentage + sc.r);
							if (this.r < 0) this.r = 0;
							if (this.r > 255) this.r = 255;
							this.g = Math.floor((ec.g - sc.g) * percentage + sc.g);
							if (this.g < 0) this.g = 0;
							if (this.g > 255) this.g = 255;
							this.b = Math.floor((ec.b - sc.b) * percentage + sc.b);
							if (this.b < 0) this.b = 0;
							if (this.b > 255) this.b = 255;
							this.name.style[this.p] = "rgb(" + this.r + "," + this.g + "," + this.b + ")";
						} else {
							if (this.p == "opacity") {
								if (document.body.filters) {
									var val = (parseInt(this.parm[1]) - parseInt(this.parm[0])) * percentage + parseInt(this.parm[0]);
									if (val > 100) val = 100;
									if (val < 0) val = 0;
									this.name.style["filter"] = "progid:DXImageTransform.Microsoft.Alpha(opacity=" + val + ")";
								} else {
									var op = "";
									if (typeof document.body.style.MozOpacity == "string") {
										op = "MozOpacity";
									} else if (typeof document.body.style.KhtmlOpacity == "string") {
										op = "KhtmlOpacity";
									} else if (typeof document.body.style.opacity == "string") {
										op = "opacity";
									}
									var val = (parseInt(this.parm[1]) - parseInt(this.parm[0])) * percentage + parseInt(this.parm[0]);
									if (val > 100) val = 100;
									if (val < 0) val = 0;
									this.name.style[op] = val / 100;
								}
							} else {
								this.name.style[this.p] = (parseInt(this.parm[1]) - parseInt(this.parm[0])) * percentage + parseInt(this.parm[0]);
							}
						}
					}).start(i == changes[obj].num, obj);
				}
				i++;
			}
			if (onstart != null) onstart.apply(this);
		});
		return this;
	}
});