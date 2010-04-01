/**
 * Carbon.JS - A simple JavaScript framework
 *
 * Carbon.JS Ajax Module - Basic Ajax functions
 *
 * @author		Dmitry Polyuhov <admin@carbonjs.com>, Aleksandr Mihalicyn <http://mihalicyn.ru>
 * @license		http://carbonjs.com/mit-license.txt
 * @version		1.1.0 (build 20100321)
 */
CarbonJS.modules.ajax=true;CarbonJS.json=null;if(typeof JSON!="undefined"){CarbonJS.json=JSON}var JSON={parse:function(text){if(CarbonJS.json!=null){return CarbonJS.json.parse(text)}if(navigator.userAgent.toLowerCase().indexOf("firefox")!=-1){return new Function("return "+text)()}return eval("("+text+")")}};CarbonJS.extend({ajax:function(t){var f=t.url||"";var d=t.method?t.method.toUpperCase():"GET";var g=t.async||true;var e=t.username||"";var b=t.password||"";var s=t.params||{};var c=t.headers||{};var i=t.timeout||false;var n=null,r;try{n=new XMLHttpRequest()}catch(j){try{n=new ActiveXObject("Msxml2.XMLHTTP")}catch(h){try{n=new ActiveXObject("Microsoft.XMLHTTP")}catch(u){n=null}}}if(n!=null){var q=0;if(d=="GET"){for(var m in s){f+=((q++==0)?"?":"&")+m+"="+encodeURIComponent(s[m])}f+=((f.indexOf("?")==-1)?"?":"&")+"nocache="+new Date().getTime()}n.open(d,f,g,e,b);var l=setInterval(function(){if(t.onReadyStateChange){t.onReadyStateChange(n.readyState)}if(n.readyState==4){clearTimeout(r);clearInterval(l);if(n.status==200){if(t.onSuccess){t.onSuccess(n)}}else{var k=n.getResponseHeader("Status");if(k==null||k.length<=0){if(t.onError){t.onError(n)}else{var p="Error #"+n.status;switch(n.status){case 0:p+="\nNo connection";break;case 404:p+="\nScript not found";break;case 403:p+="\nForbidden";break;case 500:p+="\nInternal server error, please contact the administrator";break}alert(p)}}else{if(t.onError){t.onError(n)}else{alert("Error of ajax-request: "+k)}}}}},10);var v=null;if(d=="POST"){v="";var q=0;for(var m in s){v+=((q++==0)?"":"&")+m+"="+encodeURIComponent(s[m])}var a=true;for(var o in c){if(/[cC]ontent\-[tT]ype/.test(o)){a=false}n.setRequestHeader(o,c[o])}if(a){n.setRequestHeader("Content-Type","application/x-www-form-urlencoded")}}n.send(v);if(i){r=setTimeout(function(){n.abort()},i)}}else{throw new CarbonJS.Exceptions.DoesntSupportXHR()}return this}});