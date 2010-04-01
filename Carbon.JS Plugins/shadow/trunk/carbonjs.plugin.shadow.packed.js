/**
 * Carbon.JS - A simple JavaScript framework
 *
 * Carbon.JS Plugin - Set/hide shadow on the page
 *
 * @author		Dmitry Polyuhov <admin@carbonjs.com>
 * @license		http://carbonjs.com/mit-license.txt
 * @version		1.1.0 (build 20100321)
 */
CarbonJS.extend({shadow:function(f){CarbonJS.checkModules("animation","utilities");var e=f&&f.to?f.to:"set";var g=f&&f.color?f.color:"#000000";var h=f&&f.opacity?parseInt(f.opacity):50;var b=f&&f.method?f.method.split("."):["Line","EaseIn"];var d=f&&f.time?parseInt(f.time):0;if(!Q("#shd")[0]){Q("body").prepend({tag:"div",id:"shd",css:{position:"absolute","z-index":"50"}})}Q("#shd").show().css({"background-color":g}).transparence(h);var j,i,c,a;if(window.innerHeight&&window.scrollMaxY){j=document.body.scrollWidth;i=window.innerHeight+window.scrollMaxY}else{if(document.body.scrollHeight>document.body.offsetHeight){j=document.body.scrollWidth;i=document.body.scrollHeight}else{j=document.body.offsetWidth;i=document.body.offsetHeight}}if(self.innerHeight){c=self.innerWidth;a=self.innerHeight}else{if(document.documentElement&&document.documentElement.clientHeight){c=document.documentElement.clientWidth;a=document.documentElement.clientHeight}else{if(document.body){c=document.body.clientWidth;a=document.body.clientHeight}}}if(i<a){pageHeight=a}else{pageHeight=i}if(j<c){pageWidth=c}else{pageWidth=j}Q("#shd").x(0).y(0).css({width:pageWidth+"px",height:pageHeight+"px"});if(e=="set"){Q("#shd").change({opacity:[0,h],onChanged:function(){Q(window).removeEvent("scroll").addEvent("scroll",function(){Q("#shd").css({height:pageHeight+document.body.scrollTop+"px"})})}},CarbonJS.Transitions[b[0]][b[1]],d)}else{Q("#shd").change({opacity:[h,0],onChanged:function(){Q(this).hide()}},CarbonJS.Transitions[b[0]][b[1]],d)}return this}});