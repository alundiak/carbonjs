/**
 * SEI Library - A simple JavaScript framework
 *
 * @author		Dmitry Poluhov <admin@sjs-tech.ru>
 * @license		http://www.gnu.org/licenses/gpl.html
 * @version		0.0.1
 */

var sei = window.sei = function(selector) {
  return this instanceof sei ? this.get(selector) : new sei(selector);
}
sei.prototype = {
  //--------------- Общие функции ---------------
  get: function(selector) {
    this.length = 1;
    this[0] = "document";
    var sel = [];
    var elems = [];
    var buf = "";
    var str = document;
    if((selector != "undefined" || selector != "") && typeof selector == "string") {
      if(selector.indexOf(" ") != -1) {
        sel = selector.split(" ");
        for(var i = 0; i < sel.length; i++) {
          if(sel[i].indexOf("#") != -1) {
            buf = sel[i].split("#");
            str = document.getElementById(buf[1]);
          } else if(sel[i].indexOf(".") != -1) {
            buf = sel[i].split(".");
            if(buf[0] == "") {
              str = str.getElementsByTagName("*");
            } else {
              str = str.getElementsByTagName(buf[0]);
            }
            for(var j = 0; j < str.length; j++) {
              if(str[j].className == buf[1]) {
                elems.push(str[j]);
              }
            } 
          } else {
            str = str.getElementsByTagName(sel[i]);
            for(var j = 0; j < str.length; j++) {
              elems.push(str[j]);
            }
          }
        }
        this[0] = elems;
      } else {
        if(selector.indexOf("#") != -1) {
          buf = selector.split("#");
          this[0] = document.getElementById(buf[1]);
        } else if(selector.indexOf(".") != -1) {
          buf = selector.split(".");
          if(buf[0] == "") {
            str = document.getElementsByTagName("*");
          } else {
            str = document.getElementsByTagName(buf[0]);
          }
          for(var i = 0; i < str.length; i++) {
            if(str[i].className == buf[1]) {
              elems.push(str[i]);
            }
          }
          this[0] = elems;
        } else {
          str = document.getElementsByTagName(selector);
          for(var i = 0; i < str.length; i++) {
            elems.push(str[i]);
          }
          this[0] = elems;
        }
      }
      return this;
    }
  },
  html: function() {
    if(arguments.length == 0) {
      return this.attr("innerHTML");
    } else if(arguments.length == 1) {
      var cnt = arguments[0];
      this.forEach(function(id) {
        sei("#" + id).attr("innerHTML",cnt);
      });
      return this;
    }
  },
  attr: function() {
    if(arguments.length == 2) {
      var an = arguments[0];
      var av = arguments[1];
      this.forEach(function(id) {
        document.getElementById(id)[an] = av;
      });
      return this;
    } else if(arguments.length == 1) {
      return this[0][arguments[0]];
    }
  },
  attrCss: function() {
    if(arguments.length == 2) {
      var an = arguments[0];
      var av = arguments[1];
      this.forEach(function(id) {
        document.getElementById(id).style[an] = av;
      });
      return this;
    } else if(arguments.length == 1) {
      return this[0].style[arguments[0]];
    }
  },
  applyClass: function(name) {
    this.forEach(function(id) {
      document.getElementById(id).className += " " + name;
    });
    return this;
  },
  deleteClass: function(name) {
    this.forEach(function(id) {
      var ncl = "";
      var cl = sei("#" + id).attr("className");
      cl = cl.split(" ");
      for(var i = 0; i < cl.length; i++) {
        if(cl[i] == name) {
          cl.splice(i,1);
        }
      }
      for(var i = 0; i < cl.length; i++) {
        ncl += cl[i];
      }
      sei("#" + id).attr("className",ncl);
    });
    return this;
  },
  getCoords: function(param,evt) {
    if(this[0] == "document") {
      var x,y;
      if(document.layers || window.sidebar) {
        x = evt.pageX;
        y = evt.pageY;
      }
      if(document.all) {
        x = event.x;
        y = event.y;
      }
      (sei().transparence() != "MozOpacity") ? y += document.body.scrollTop : "";
      if(param == "x") {
        return parseInt(x);
      } else if(param == "y") {
        return parseInt(y);
      }
    } else {
      if(param == "x") {
        return parseInt(this.attrCss("left"));
      } else if(param == "y") {
        return parseInt(this.attrCss("top"));
      }
    }
  },
  setCoords: function(param,value) {
    if(param == "x") {
      this.attrCss("left",parseInt(value) + "px");
    } else if(param == "y") {
      this.attrCss("top",parseInt(value) + "px");
    }
    return this;
  },
  repl: function(rWhat,rWith) {
    var cnt = this.html();
    cnt = cnt.replace(rWhat,rWith);
    this.html(cnt);
    return this;
  },
  event: function(evnt,func) {
    this[0]["on" + evnt] = func;
    return this;
  },
  onLoad: function(newfunc) {
    var oldfunc = window.onload;
    if(typeof window.onload != "function") {
      window.onload = newfunc;
    } else {
      window.onload = function() {
        oldfunc();
        newfunc();
      }
    }
    return this;
  },
  toggle: function(param) {
    if(param == null) {
      if(this.attrCss("display") != "none") {
        this.attrCss("display","none");
      } else {
        this.attrCss("display","block");
      }
    } else {
      if(this.attrCss("display") != "none") {
        param.off();
      } else {
        param.on();
      }
    }
    return this;
  },
  forEach: function(func) {
    if(this.attr("id")) {
      func(this.attr("id"));
    } else {
      for(var e = 0; e < this[0].length; e++) {
        if(this[0][e].id == "" || this[0][e].id == "undefined") {
          this[0][e].id = e + Math.floor(Math.random() * 99999);
        }
        func(this[0][e].id,e);
      }
    }
    return this;
  },
  getCookie: function(cName) {
    var start = document.cookie.indexOf(cName + "=");
    var len = start + cName.length + 1;
    var end = document.cookie.indexOf(";",len);
    if((!start && cName != document.cookie.substring(0,cName.length)) || start == -1) {
      return "";
    }
    if (end == -1) {
      end = document.cookie.length;
    }
    return unescape(document.cookie.substring(len,end));
  },
  setCookie: function(cName,value,expires) {
    var n = new Date();
    n.setTime(n.getTime() + ((expires ? parseInt(expires) : 365) * 24 * 60 * 60 * 1000));
    document.cookie = cName + "=" + escape(value) + ";path=" + escape('/') + ";expires=" + n.toGMTString();
    return this;
  },
  deleteCookie: function(cName) {
    if(sei().getCookie(cName) != "") {
      document.cookie = cName + "=;expires=Thu, 01-Jan-1970 00:00:01 GMT";
    }
    return this;
  },
  //--------------- Визуальные эффекты ---------------
  wrapIt: function(warr) {
    var tm = "";
    var tef = warr.effect;
    var tsp = parseInt(warr.speed);
    this.attrCss("overflow","hidden").attrCss("display","block");
    if(tef == "opacity") {
      this.transparence("100");
      var op = 100;
      var newt = 100;
    }
    var tid = this.attr("id");
    function wrapCnt() {
      if(warr.onWrapping != null) {
        warr.onWrapping();
      }
      if(tef == "slide") {
        if(parseInt(sei("#" + tid).attrCss("height")) > tsp) {
          sei("#" + tid).attrCss("height",parseInt(sei("#" + tid).attrCss("height")) - tsp);
        } else if(parseInt(sei("#" + tid).attrCss("height")) <= tsp) {
          sei("#" + tid).attrCss("display","none");
          clearInterval(tm);
          if(warr.onWrapped != null) {
            warr.onWrapped();
          }
        }
      } else if(tef == "opacity") {
        if(sei().transparence() != "filter") {
          if(sei("#" + tid).transparence("get") > (tsp / 100)) {
            sei("#" + tid).transparence(newt - tsp);
            newt = newt - tsp;
          } else if(newt <= tsp) {
            sei("#" + tid).attrCss("display","none");
            clearInterval(tm);
            if(warr.onWrapped != null) {
              warr.onWrapped();
            }
          }
        } else {
          if(op > tsp) {
            sei("#" + tid).transparence(op - tsp);
            op = op - tsp;
          } else if(op <= tsp) {
            sei("#" + tid).attrCss("display","none");
            clearInterval(tm);
            if(warr.onWrapped != null) {
              warr.onWrapped();
            }
          }
        }
      } else if(tef == "comp-diag") {
        if(parseInt(sei("#" + tid).attrCss("width")) > tsp) {
          sei("#" + tid).attrCss("width",parseInt(sei("#" + tid).attrCss("width")) - tsp);
        }
        if(parseInt(sei("#" + tid).attrCss("height")) > tsp) {
          sei("#" + tid).attrCss("height",parseInt(sei("#" + tid).attrCss("height")) - tsp);
        }
        if(parseInt(sei("#" + tid).attrCss("width")) <= tsp && parseInt(sei("#" + tid).attrCss("height")) <= tsp) {
          sei("#" + tid).attrCss("display","none");
          clearInterval(tm);
          if(warr.onWrapped != null) {
            warr.onWrapped();
          }
        }
      } else if(tef == "none") {
        sei("#" + tid).attrCss("display","none");
        clearInterval(tm);
        if(warr.onWrapped != null) {
          warr.onWrapped();
        }
      }
    }
    tm = setInterval(wrapCnt,10);
    return this;
  },
  unwrapIt: function(uwarr) {
    var tm = "";
    var tw = parseInt(uwarr.objW);
    var th = parseInt(uwarr.objH);
    var tef = uwarr.effect;
    var tsp = parseInt(uwarr.speed);
    this.transparence("100");
    this.attrCss("overflow","hidden");
    if(tef == "slide") {
      this.attrCss("width",tw).attrCss("height",1);
    } else if(tef == "comp-diag") {
      this.attrCss("width",1).attrCss("height",1);
    } else if(tef == "opacity") {
      this.transparence("0");
      var newt = 0;
      var op = 0;
      this.attrCss("width",tw).attrCss("height",th);
    } else if(tef == "none") {
      this.attrCss("width",tw).attrCss("height",th);
    }
    this.attrCss("display","block");
    var tid = this.attr("id");
    function unwrapCnt() {
      if(uwarr.onUnwrapping != null) {
        uwarr.onUnwrapping();
      }
      if(tef == "slide") {
        if(parseInt(sei("#" + tid).attrCss("height")) < th) {
          sei("#" + tid).attrCss("height",parseInt(sei("#" + tid).attrCss("height")) + tsp);
        }
        if(parseInt(sei("#" + tid).attrCss("height")) >= th) {
          clearInterval(tm);
          sei("#" + tid).attrCss("height",th);
          if(uwarr.onUnwrapped != null) {
            uwarr.onUnwrapped();
          }
        }
      } else if(tef == "opacity") {
        if(sei().transparence() != "filter") {
          if(sei("#" + tid).transparence("get") < 1) {
            sei("#" + tid).transparence(parseFloat(newt + tsp / 100));
            newt = parseFloat(newt + tsp);
          } else if(newt >= 1) {
            clearInterval(tm);
            if(uwarr.onUnwrapped != null) {
              uwarr.onUnwrapped();
            }
          }
        } else {
          if(op < 100) {
            sei("#" + tid).transparence(op + tsp);
            op = op + tsp;
          } else if(op >= 100) {
            clearInterval(tm);
            if(uwarr.onUnwrapped != null) {
              uwarr.onUnwrapped();
            }
          }
        }
      } else if(tef == "comp-diag") {
        sei("#" + tid).attrCss("display","block");
        if(parseInt(sei("#" + tid).attrCss("width")) < tw) {
          sei("#" + tid).attrCss("width",parseInt(sei("#" + tid).attrCss("width")) + tsp);
        }
        if(parseInt(sei("#" + tid).attrCss("height")) < th) {
          sei("#" + tid).attrCss("height",parseInt(sei("#" + tid).attrCss("height")) + tsp);
        }
        if(parseInt(sei("#" + tid).attrCss("width")) >= tw && parseInt(sei("#" + tid).attrCss("height")) >= th) {
          clearInterval(tm);
          sei("#" + tid).attrCss("width",tw).attrCss("height",th);
          if(uwarr.onUnwrapped != null) {
            uwarr.onUnwrapped();
          }
        }
      } else if(tef == "none") {
        sei("#" + tid).attrCss("display","block");
        clearInterval(tm);
        if(uwarr.onUnwrapped != null) {
          uwarr.onUnwrapped();
        }
      }
    }
    tm = setInterval(unwrapCnt,10);
    return this;
  },
  moveIt: function(marr) {
    this.attrCss("display","block");
    var tsp = parseInt(marr.speed);
    var x1 = parseInt(marr.fromX);
    var y1 = parseInt(marr.fromY);
    var x2 = parseInt(marr.toX);
    var y2 = parseInt(marr.toY);
    this.setCoords("x",x1).setCoords("y",y1);
    var difX = x2 - x1;
    var difY = y2 - y1;
    var x = x1;
    var y = y1;
    var tm = "";
    var tid = this.attr("id");
    if(difX == 0) {
      function moveIt1() {
        if(y1 < y2) {
          if(y < (y2 - tsp)) {
            y += tsp;
            sei("#" + tid).setCoords("y",y);
          } else if(y >= (y2 - tsp)) {
            clearInterval(tm);
            sei("#" + tid).setCoords("x",x2).setCoords("y",y2);
            if(marr.onMoved != null) {
              marr.onMoved();
            }
          }
        } else if(y1 > y2) {
          if(y > (y2 - tsp)) {
            y -= tsp;
            sei("#" + tid).setCoords("y",y);
          } else if(y <= (y2 - tsp)) {
            clearInterval(tm);
            sei("#" + tid).setCoords("x",x2).setCoords("y",y2);
            if(marr.onMoved != null) {
              marr.onMoved();
            }
          }
        }
        if(marr.onMoving != null) {
          marr.onMoving();
        }
      }
      tm = setInterval(moveIt1,10);
    } else if(difY == 0) {
      function moveIt2() {
        if(x1 < x2) {
          if(x < (x2 - tsp)) {
            x += tsp;
            sei("#" + tid).setCoords("x",x);
          } else if(x >= (x2 - tsp)) {
            clearInterval(tm);
            sei("#" + tid).setCoords("x",x2).setCoords("y",y2);
            if(marr.onMoved != null) {
              marr.onMoved();
            }
          }
        } else if(x1 > x2) {
          if(x > (x2 - tsp)) {
            x -= tsp;
            sei("#" + tid).setCoords("x",x);
          } else if(x <= (x2 - tsp)) {
            clearInterval(tm);
            sei("#" + tid).setCoords("x",x2).setCoords("y",y2);
            if(marr.onMoved != null) {
              marr.onMoved();
            }
          }
        }
        if(marr.onMoving != null) {
          marr.onMoving();
        }
      }
      tm = setInterval(moveIt2,10);
    } else if(Math.abs(difX) > Math.abs(difY)) {
      function moveIt3() {
        if(x1 < x2) {
          if(x < (x2 - tsp)) {
            x += tsp;
            y = ((y2 - y1)*(x - x1)) / (x2 - x1) + y1;
            sei("#" + tid).setCoords("x",x).setCoords("y",y);
          } else if(x >= (x2 - tsp)) {
            clearInterval(tm);
            sei("#" + tid).setCoords("x",x2).setCoords("y",y2);
            if(marr.onMoved != null) {
              marr.onMoved();
            }
          }
        } else if(x1 > x2) {
          if(x > (x2 - tsp)) {
            x -= tsp;
            y = ((y2 - y1)*(x - x1)) / (x2 - x1) + y1;
            sei("#" + tid).setCoords("x",x).setCoords("y",y);
          } else if(x <= (x2 - tsp)) {
            clearInterval(tm);
            sei("#" + tid).setCoords("x",x2).setCoords("y",y2);
            if(marr.onMoved != null) {
              marr.onMoved();
            }
          }
        }
        if(marr.onMoving != null) {
          marr.onMoving();
        }
      }
      tm = setInterval(moveIt3,10);
    } else if(Math.abs(difX) < Math.abs(difY)) {
      function moveIt4() {
        if(y1 < y2) {
          if(y < (y2 - tsp)) {
            y += tsp;
            x = ((x2 - x1)*(y - y1) + x1 * (y2 - y1)) / (y2 - y1);
            sei("#" + tid).setCoords("x",x).setCoords("y",y);
          } else if(y >= (y2 - tsp)) {
            clearInterval(tm);
            sei("#" + tid).setCoords("x",x2).setCoords("y",y2);
            if(marr.onMoved != null) {
              marr.onMoved();
            }
          }
        } else if(y1 > y2) {
          if(y > (y2 - tsp)) {
            y -= tsp;
            x = ((x2 - x1)*(y - y1) + x1 * (y2 - y1)) / (y2 - y1);
            sei("#" + tid).setCoords("x",x).setCoords("y",y);
          } else if(y <= (y2 - tsp)) {
            clearInterval(tm);
            sei("#" + tid).setCoords("x",x2).setCoords("y",y2);
            if(marr.onMoved != null) {
              marr.onMoved();
            }
          }
        }
        if(marr.onMoving != null) {
          marr.onMoving();
        }
      }
      tm = setInterval(moveIt4,10);
    } else if(Math.abs(difX) == Math.abs(difY)) {
      function moveIt5() {
        if(x1 < x2) {
          if(x < (x2 - tsp)) {
            x += tsp;
            y += tsp;
            sei("#" + tid).setCoords("x",x).setCoords("y",y);
          } else if(x >= (x2 - tsp)) {
            clearInterval(tm);
            sei("#" + tid).setCoords("x",x2).setCoords("y",y2);
            if(marr.onMoved != null) {
              marr.onMoved();
            }
          }
        } else if(x1 > x2) {
          if(x > (x2 - tsp)) {
            x -= tsp;
            y -= tsp;
            sei("#" + tid).setCoords("x",x).setCoords("y",y);
          } else if(x <= (x2 - tsp)) {
            clearInterval(tm);
            sei("#" + tid).setCoords("x",x2).setCoords("y",y2);
            if(marr.onMoved != null) {
              marr.onMoved();
            }
          }
        }
        if(marr.onMoving != null) {
          marr.onMoving();
        }
      }
      tm = setInterval(moveIt5,10);
    }  
    return this;
  },
  dragIt: function(ddarr) {
    this.forEach(function(id) {
      var flag = true;
      var difX = 5;
      var difY = 5;
      var glid = "";
      var tid = id;
      var mvid = ddarr.objId ? ddarr.objId : tid;
      document.getElementById(tid).onmousedown = function(evt) {
        if(ddarr.onClicked != null) {
          ddarr.onClicked();
        }
        difX = sei().getCoords("x",evt) - sei("#" + mvid).getCoords("x");
        difY = sei().getCoords("y",evt) - sei("#" + mvid).getCoords("y");
        flag = true;
        if(typeof document.body.onselectstart != "undefined") {
          document.body.onselectstart = function() {
            return false;
          }
        } else if(typeof document.body.style.MozUserSelect != "undefined") {
          document.body.style.MozUserSelect = "none";
        } else {
          document.body.onmousedown = function() {
            return false;
          }
        }
        document.onmousemove = function(evt) {
          if(flag) {
            if(ddarr.dragX == "true") {
              sei("#" + mvid).setCoords("x",sei().getCoords("x",evt) - difX);
            }
            if(ddarr.dragY == "true") {
              sei("#" + mvid).setCoords("y",sei().getCoords("y",evt) - difY);
            }
            if(ddarr.onDragging != null) {
              ddarr.onDragging();
            }
          }
        }
        document.onmouseup = function() {
          flag = false;
          if(typeof document.body.onselectstart != "undefined") {
            document.body.onselectstart = function() {
              return true;
            }
          } else if(typeof document.body.style.MozUserSelect != "undefined") {
            document.body.style.MozUserSelect = "";
          } else {
            document.body.onmousedown = function() {
              return true;
            }
          }
          if(ddarr.onDropped != null) {
            ddarr.onDropped();
          }
          document.onmouseup = function() {
            return true;
          }
        }
      };
    });
    return this;
  },
  transparence: function(method) {
    var opElem = "undefined";
    if(document.body.filters) {
      opElem = "filter";
    } else if(typeof document.body.style.MozOpacity == "string") {
      opElem = "MozOpacity";
    } else if(typeof document.body.style.KhtmlOpacity == "string") {
      opElem = "KhtmlOpacity";
    } else if(typeof document.body.style.opacity == "string") {
      opElem = "opacity";
    }
    if(method == null) {
      return opElem;
    } else {
      if(method == "get") {
        if(opElem != "filter") {
          return parseFloat(this.attrCss(opElem));
        } else {
          return "undefined";
        }
      } else {
        if(opElem != "filter") {
          this.attrCss(opElem,parseInt(method) / 100);
        } else {
          this.attrCss("filter","progid:DXImageTransform.Microsoft.Alpha(opacity=" + parseInt(method) + ")");
        }
        return this;
      }
    }
  },
  setShadow: function(clr,alp) {
    sei("#shd").attrCss("display","block").attrCss("backgroundColor",clr).transparence(alp);
    var xScroll, yScroll, windowWidth, windowHeight;
    if(window.innerHeight && window.scrollMaxY) {
      xScroll = document.body.scrollWidth;
      yScroll = window.innerHeight + window.scrollMaxY;
    } else if(document.body.scrollHeight > document.body.offsetHeight) {
      xScroll = document.body.scrollWidth;
      yScroll = document.body.scrollHeight;
    } else {
      xScroll = document.body.offsetWidth;
      yScroll = document.body.offsetHeight;
    }
    if(self.innerHeight) {
      windowWidth = self.innerWidth;
      windowHeight = self.innerHeight;
    } else if(document.documentElement && document.documentElement.clientHeight) {
      windowWidth = document.documentElement.clientWidth;
      windowHeight = document.documentElement.clientHeight;
    } else if(document.body) {
      windowWidth = document.body.clientWidth;
      windowHeight = document.body.clientHeight;
    }
    if(yScroll < windowHeight) {
      pageHeight = windowHeight;
    } else {
      pageHeight = yScroll;
    }
    if(xScroll < windowWidth) {
      pageWidth = windowWidth;
    } else {
      pageWidth = xScroll;
    }
    sei("#shd").setCoords("x","0").setCoords("y","0").attrCss("width",pageWidth).attrCss("height",pageHeight);
    return this;
  },
  unsetShadow: function() {
    sei("#shd").attrCss("display","none");
    return this;
  },
  setPopup: function(pparr) {
    var popupW = parseInt(pparr.popupW);
    var popupH = parseInt(pparr.popupH);
    var popupX = pparr.popupX ? parseInt(pparr.popupX) : ((screen.width - popupW) / 2);
    var popupY = pparr.popupY ? parseInt(pparr.popupY) : ((screen.height - popupH) / 2);
    var popupEf = pparr.effect;
    var popupSp = pparr.speed;
    if(document.getElementById("popup")) {
      sei("#popup").attrCss("display","block");
    } else {
      document.write('<div id="popup" style="position: absolute; z-index: 100; ' + (pparr.popupStyle ? pparr.popupStyle : '') + '"></div>');
    }
    sei("#popup").setCoords("x",popupX).setCoords("y",popupY).html(pparr.popupTxt ? pparr.popupTxt : "").unwrapIt({
      objW: popupW,
      objH: popupH,
      effect: popupEf,
      speed: popupSp,
      onUnwrapped: function() {
        sei("#popup").attrCss("display",(pparr.display ? pparr.display : "block"))
      }
    });
    return this;
  },
  unsetPopup: function(upparr) {
    if(upparr != null) {
      var popupEf = upparr.effect;
      var popupSp = upparr.speed;
      sei("#popup").wrapIt({
        speed: popupSp,
        effect: popupEf
      });
    } else {
      sei("#popup").attrCss("display","none");
    }
    return this;
  },
  addLoader: function(plarr) {
    var loaderW = parseInt(plarr.loaderW);
    var loaderH = parseInt(plarr.loaderH);
    var loaderX = (screen.width - loaderW) / 2;
    var loaderY = (screen.height - loaderH) / 2;
    var loaderSp = parseInt(plarr.speed);
    sei().setShadow(plarr.shadowColor,plarr.shadowAlpha);
    var shTm = setInterval(function() {
      sei().setShadow(plarr.shadowColor,plarr.shadowAlpha);
    },1000);
    function hideLoader() {
      if(!ld) {
        clearInterval(shTm);
        sei().unsetShadow();
        sei("#loaderWin").moveIt({
          fromX: loaderX,
          fromY: loaderY,
          toX: loaderX,
          toY: -loaderH * 2,
          speed: loaderSp
        });
        ld = true;
      }
    }
    document.write('<div id="loaderWin" style="position: absolute; top: ' + loaderY + 'px; left: ' + loaderX + 'px; width: ' + loaderW + 'px; height: ' + loaderH + 'px; z-index: 101; ' + plarr.loaderStyle + '">' + plarr.loaderTxt + '</div>');
    var ld = false;
    sei().onLoad(function() {
      hideLoader();
    });
    setTimeout(hideLoader,10000);
    return this;
  },
  title: function(msg,style) {
    document.write('<div id="txt" style="position: absolute; display: none; top: 1px; left: 1px; z-index: 102; ' + (style ? style : "") + '"></div>');
    var evt = null;
    var tid = this.attr("id");
    function follow(evt) {
      var x,y;
      x = sei().getCoords("x",evt) + 15;
      y = sei().getCoords("y",evt) + 15;
      sei("#txt").setCoords("x",x).setCoords("y",y);
    }
    this.event("mouseover",function(evt) {
      if(document.layers) {
        document.captureEvents(Event.MOUSEMOVE);
      }
      if(window.sidebar) {
        document.addEventListener("mousemove",follow,false);
      }
      if(document.all || document.getElementById) {
        document.onmousemove = follow;
      }
      sei("#txt").attrCss("display","block").html(msg);
    });
    this.event("mouseout",function() {
      sei("#txt").attrCss("display","none");
    });
    return this;
  },
  showHideThem: function(scarr) {
    var argsN = [];
    var an = 0;
    for(n in scarr) {
      argsN[an] = n;
      an++;
    }
    for(var i = 0; i < an; i++) {
      sei("#" + scarr[argsN[i]].objId).attrCss("display","none");
      if(scarr[argsN[i]].effect == "slide") {
        sei("#" + scarr[argsN[i]].objId).attrCss("width",scarr[argsN[i]].objW);
      } else if(scarr[argsN[i]].effect == "comp-diag") {
        sei("#" + scarr[argsN[i]].objId).attrCss("width",1);
      }
      document.getElementById(argsN[i]).onclick = function() {
        for(var j = 0; j < an; j++) {
          if(this.id == argsN[j]) {
            if(sei("#" + scarr[this.id].objId).attrCss("display") == "block") {
              sei("#" + scarr[this.id].objId).wrapIt({
                effect: scarr[this.id].effect,
                speed: scarr[this.id].speed
              });
            } else {
              sei("#" + scarr[this.id].objId).unwrapIt({
                objW: scarr[this.id].objW,
                objH: scarr[this.id].objH,
                effect: scarr[this.id].effect,
                speed: scarr[this.id].speed
              });
            }
          } else {
            if(sei("#" + scarr[argsN[j]].objId).attrCss("display") == "block") {
              sei("#" + scarr[argsN[j]].objId).wrapIt({
                effect: scarr[argsN[j]].effect,
                speed: scarr[argsN[j]].speed
              }); 
            } else {
              sei("#" + scarr[argsN[j]].objId).attrCss("display","none");
            }
          }
        } 
        return false;
      }
    }
    return this;
  },
  addTabs: function(tarr) {
    var argsN = [];
    var an = 0;
    for(n in tarr) {
      argsN[an] = n;
      an++;
    }
    var oldtab = argsN[0];
    this.attrCss("overflow","hidden").html(tarr[argsN[0]].content);
    var tw = tarr[argsN[0]].tabW;
    var th = tarr[argsN[0]].tabH;
    for(var i = 0; i < an; i++) {
      if(tarr[argsN[i]].effect == "slide") {
        this.attrCss("width",tw);
      } else if(tarr[argsN[i]].effect == "comp-diag") {
        this.attrCss("width","1");
      }
      var te = tarr[argsN[i]].event ? tarr[argsN[i]].event : "click";
      var tid = this.attr("id");
      this.attrCss("width",tw).attrCss("height",th);
      document.getElementById(argsN[i])["on" + te] = function() {
        if(sei("#" + tid).attr("innerHTML") != tarr[this.id].content) {
          var tabid = tid;
          var thid = this.id;
          sei("#" + tabid).wrapIt({
            effect: tarr[thid].effect,
            speed: tarr[thid].speed,
            onWrapping: function() {
              if(tarr[thid].onClosing != null) {
                tarr[thid].onClosing();
              }
            },
            onWrapped: function() {
              if(tarr[oldtab].onClosed != null) {
                tarr[oldtab].onClosed();
              }
              oldtab = thid;
              sei("#" + tabid).unwrapIt({
                objW: tarr[thid].tabW,
                objH: tarr[thid].tabH,
                effect: tarr[thid].effect,
                speed: tarr[thid].speed,
                onUnwrapping: function() {
                  if(tarr[thid].onOpening != null) {
                    tarr[thid].onOpening();
                  }
                },
                onUnwrapped: function() {
                  if(tarr[thid].onOpened != null) {
                    tarr[thid].onOpened();
                  }
                }
              });
              sei("#" + tabid).html(tarr[thid].content);
            }
          });
        }
        return false;
      }
    }
    return this;
  },
  //--------------- Работа с AJAX ---------------
  ajaxIt: function(ajaxdarr) {
    var argsN = [];
    var an = 0;
    for(n in ajaxdarr) {
      argsN[an] = n;
      an++;
    }
    var jsRequest = null;
    try {
      jsRequest = new XMLHttpRequest();
    } catch(trymicrosoft) {
      try {
        jsRequest = new ActiveXObject("Msxml2.XMLHTTP");
      } catch(othermicrosoft) {
        try {
          jsRequest = new ActiveXObject("Microsoft.XMLHTTP");
        } catch(failed) {
          jsRequest = null;
        }
      }
    }
    if(jsRequest != null) {
      if(ajaxdarr.url != "" || ajaxdarr.method != "" || ajaxdarr.usersActivity != "") {
        if(ajaxdarr.method.toUpperCase() == "GET" || ajaxdarr.method.toUpperCase() == "POST") {
          var url = ajaxdarr.url;
          var method = ajaxdarr.method.toUpperCase();
          var usersActivity = ajaxdarr.usersActivity;
          if(method == "GET") {
            if(url.indexOf("?") == -1) {
              url += "?nocache=" + new Date().getTime();
            } else {
              url += "&nocache=" + new Date().getTime();
            }
          }
          jsRequest.open(method,url,usersActivity);
          jsRequest.onreadystatechange = function() {
            if(jsRequest.readyState == 4) {
              if(jsRequest.status == 200) {
                if(ajaxdarr.onSuccess != null) {
                  ajaxdarr.onSuccess(jsRequest);
                }
              } else {
                var message = jsRequest.getResponseHeader("Status");
                if(message.length == null || message.length <= 0) {
                  alert("Ошибка SEI Lib: ошибка AJAX-запроса #" + jsRequest.status);
                } else {
                  alert("Ошибка SEI Lib: " + message);
                }
              }
            }
          }
          var data = null;
          if(ajaxdarr.data != "" || ajaxdarr.data != null) {
            data = ajaxdarr.data;
            if(method == "POST") {
              if(ajaxdarr.dataType != "" || ajaxdarr.dataType != null) {
                jsRequest.setRequestHeader("Content-Type",ajaxdarr.dataType);
              } else {
                jsRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
              }
            }
          }
          jsRequest.send(data);
        }
      }
    } else {
      alert("Ошибка SEI Lib: ошибка создания AJAX-запроса");
    }
    return this;
  }
}
document.write('<div id="shd" style="position: absolute; display: none; z-index: 50;"></div>');