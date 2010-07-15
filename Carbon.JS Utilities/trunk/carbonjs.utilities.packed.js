/**
 * Carbon.JS - A simple JavaScript framework
 *
 * Carbon.JS Utilities Module - Common functions
 *
 * @author		Dmitry Polyuhov <admin@carbonjs.com>
 * @license		http://carbonjs.com/mit-license.txt
 * @version		1.1.0 (build 20100716)
 */
CarbonJS.modules.utilities=true;CarbonJS.Browsers={IE:function(){return("\v"=="v")},FF:function(){return(navigator.userAgent.toLowerCase().indexOf("firefox")!=-1)},Opera:function(){return(navigator.userAgent.toLowerCase().indexOf("opera")!=-1)},Safari:function(){return(navigator.userAgent.toLowerCase().indexOf("safari")!=-1)}};CarbonJS.service.events=[];(function(){function b(){while(CarbonJS.service.events.length>0){Q(CarbonJS.service.events[0].obj).removeEvent(CarbonJS.service.events[0].evt)}}var a=window.onunload;if(typeof window.onunload!="function"){window.onunload=b}else{window.onunload=function(){a();b()}}})();CarbonJS.service.displayCache={};CarbonJS.service.elemIsHidden=function(c){var b=c.offsetWidth,a=c.offsetHeight,d=c.nodeName.toLowerCase()==="tr";return b===0&&a===0&&!d?true:b>0&&a>0&&!d?false:Q(c).css("display")};CarbonJS.extend({attr:function(a){if(typeof a=="object"){this.forEach(function(){for(var b in a){this[b]=a[b]}});return this}else{if(typeof a=="string"){return this[0][a]}}},css:function(a){var b;if(typeof a=="object"){this.forEach(function(){for(n in a){b=n;n=n.replace(/\-(\w)/g,function(){return arguments[1].toUpperCase()});if(n=="float"){this.style[(typeof document.body.style.cssFloat=="string")?"cssFloat":"styleFloat"]=a[b]}else{if(n=="opacity"){var c=parseFloat(a[b]);if(typeof document.body.style.opacity=="string"){this.style.opacity=c}if(document.body.filters){this.style.filter="progid:DXImageTransform.Microsoft.Alpha(opacity="+(c*100)+")"}if(typeof document.body.style.MozOpacity=="string"){this.style.MozOpacity=c}if(typeof document.body.style.KhtmlOpacity=="string"){this.style.KhtmlOpacity=c}}else{this.style[n]=a[b]}}}});return this}else{if(typeof a=="string"){b=a;b=b.replace(/\-(\w)/g,function(){return arguments[1].toUpperCase()});if(b=="float"){b=(typeof document.body.style.cssFloat=="string")?"cssFloat":"styleFloat"}if(b=="opacity"){if(typeof document.body.style.opacity=="string"){return this[0].style.opacity}if(document.body.filters){return this[0].filters["DXImageTransform.Microsoft.Alpha"].opacity/100}if(typeof document.body.style.MozOpacity=="string"){return this[0].style.MozOpacity}if(typeof document.body.style.KhtmlOpacity=="string"){return this[0].style.KhtmlOpacity}}if(window.getComputedStyle){return window.getComputedStyle(this[0],null)[b]}else{return this[0].currentStyle[b]}}}},addClass:function(a){this.forEach(function(){if(!(new RegExp("(^|\\s)"+a+"(\\s|$)").test(this.className))){this.className+=" "+a}});return this},removeClass:function(a){var b=new RegExp("(^|\\s)"+a+"(\\s|$)","g");this.forEach(function(){this.className=this.className.replace(b,"$1").replace(/\s+/g," ").replace(/(^ | $)/g,"")});return this},show:function(){this.forEach(function(){var d=Q(this);var b=d.attr("displayOld");d.css({display:b||""});if(d.css("display")==="none"){var f=this.nodeName,a=document.body,e;if(CarbonJS.service.displayCache[f]){e=CarbonJS.service.displayCache[f]}else{var c=document.createElement(f);a.appendChild(c);e=Q(c).css("display");if(e=="none"){e="block"}a.removeChild(c);CarbonJS.service.displayCache[f]=e}d.attr({displayOld:e});d.css({display:e})}});return this},hide:function(){this.forEach(function(){var a=Q(this);if(!a.attr("displayOld")){a.attr({displayOld:a.css("display")})}a.css({display:"none"})});return this},toggle:function(){this.forEach(function(){CarbonJS.service.elemIsHidden(this)?Q(this).show():Q(this).hide()});return this},x:function(e){if(this.length==0){var a;e=e||window.event;if(e.pageX){a=e.pageX}else{a=e.clientX+(document.documentElement.scrollLeft||document.body.scrollLeft)-document.documentElement.clientLeft}return parseInt(a)}else{if(e!=null){this.css({left:parseInt(e)+"px"});return this}else{if(this[0].getBoundingClientRect){return(this[0].getBoundingClientRect().left+(window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft)-(document.documentElement.clientLeft||document.body.clientLeft||0))}else{var c=this[0].offsetLeft,b=this[0].offsetParent;while(b=b.offsetParent){c+=b.offsetLeft-b.scrollLeft}return parseInt(c)}}}},y:function(d){if(this.length==0){var e;d=d||window.event;if(d.pageY){e=d.pageY}else{e=d.clientY+(document.documentElement.scrollTop||document.body.scrollTop)-document.documentElement.clientTop}return parseInt(e)}else{if(d!=null){this.css({top:parseInt(d)+"px"});return this}else{if(this[0].getBoundingClientRect){return(this[0].getBoundingClientRect().top+(window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop)-(document.documentElement.clientTop||document.body.clientTop||0))}else{var b=this[0].offsetTop,a=this[0].offsetParent;while(a=a.offsetParent){b+=a.offsetTop-a.scrollTop}return parseInt(b)}}}},addEvent:function(b,a){this.forEach(function(){if(this.addEventListener){this.addEventListener(b,a,false)}else{if(this.attachEvent){this.attachEvent("on"+b,a)}else{var c=this["on"+b];if(c){this["on"+b]=function(){c();a()}}else{this["on"+b]=a}}}CarbonJS.service.events.push({obj:this,evt:b,func:a})});return this},removeEvent:function(a){this.forEach(function(){var b=-1;while(++b<CarbonJS.service.events.length){if(CarbonJS.service.events[b].obj==this&&CarbonJS.service.events[b].evt==a){if(this.removeEventListener){this.removeEventListener(a,CarbonJS.service.events[b].func,false)}else{if(this.detachEvent){this.detachEvent("on"+a,CarbonJS.service.events[b].func)}else{this["on"+a]=""}}CarbonJS.service.events.splice(b,1);break}}});return this}});CarbonJS.setCookie=function(d,e,f){f=f||{};var b=f.expires,a=d+"="+encodeURIComponent(e);if(b){if(typeof b=="number"){var c=new Date();c.setTime(c.getTime()+b);b=c}if(b.toUTCString){b=b.toUTCString()}f.expires=b}for(var g in f){a+="; "+g+((f[g].length!=0)?("="+f[g]):"")}document.cookie=a};CarbonJS.getCookie=function(a){var b=document.cookie.match(new RegExp("(?:^|; )"+a.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,"\\$1")+"=([^;]*)"));return b?decodeURIComponent(b[1]):undefined};CarbonJS.removeCookie=function(a){CarbonJS.setCookie(a,null,{expires:-1})};