var enumerables = true,
  enumerablesTest = {
    toString: 1
  },
  toString = Object.prototype.toString;

for (var i in enumerablesTest) {
  enumerables = null;
}
if (enumerables) {
  enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable',
    'toLocaleString', 'toString', 'constructor'
  ];
}


var _extend = function (object, config) {
  var args = arguments,
    options;
  if (args.length > 1) {
    for (var len = 1; len < args.length; len++) {
      options = args[len];
      if (object && options && typeof options === 'object') {
        var i, j, k;
        for (i in options) {
          object[i] = options[i];
        }
        if (enumerables) {
          for (j = enumerables.length; j--;) {
            k = enumerables[j];
            if (options.hasOwnProperty && options.hasOwnProperty(k)) {
              object[k] = options[k];
            }
          }
        }
      }
    }
  }
  return object;
}

var setCookie = function (sName, sValue, oExpires, sPath, sDomain, bSecure) {
  var sCookie = sName + "=" + encodeURIComponent(sValue);
  if (oExpires)
    sCookie += "; expires=" + oExpires.toGMTString();
  if (sPath)
    sCookie += "; path=" + sPath;
  if (sDomain)
    sCookie += "; domain=" + sDomain;
  if (bSecure)
    sCookie += "; secure=" + bSecure;
  document.cookie = sCookie;
}

var getCookie = function (sName) {
  var sRE = "(?:; )?" + sName + "=([^;]*);?";
  var oRE = new RegExp(sRE);

  if (oRE.test(document.cookie)) {
    return decodeURIComponent(RegExp["$1"]);
  } else
    return null;
}

var setSessionItem = function(key, item){
  var itemString = JSON.stringify(item);
  window.sessionStorage.setItem(key, itemString);
}

var getSessionItem = function(key){
  var itemString = window.sessionStorage.getItem(key);
  return JSON.parse(itemString);
}

var setLocalItem = function(key, item){
  var itemString = JSON.stringify(item);
  window.localStorage.setItem(key, itemString);
}

var getLocalItem = function(key){
  var itemString = window.localStorage.getItem(key);
  return JSON.parse(itemString);
}

var getUrlParam = function (name, path) {
  path = path || window.location.search;
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = path.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
export default {
  extend: _extend,
  setCookie: setCookie,
  getCookie: getCookie,
  setSessionItem: setSessionItem,
  getSessionItem: getSessionItem,
  setLocalItem: setLocalItem,
  getLocalItem: getLocalItem,
  getUrlParam: getUrlParam
}