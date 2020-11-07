// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"Logger.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Logger = /*#__PURE__*/function () {
  function Logger(id) {
    _classCallCheck(this, Logger);

    this.el = document.getElementById(id);
    this.el.innerHTML = '';
  }

  _createClass(Logger, [{
    key: "log",
    value: function log(data) {
      var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

      if (message.length > 0) {
        message += ":";
      }

      this.el.innerHTML += "<pre>".concat(message, " ").concat(JSON.stringify(data), "</pre>");
    }
  }]);

  return Logger;
}();

exports.default = Logger;
},{}],"index.js":[function(require,module,exports) {
"use strict";

var _Logger = _interopRequireDefault(require("./Logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var wasm_url = document.getElementById('wasm').getAttribute('src');
/*
int sum(int*arr, unsigned int l) {
  int r = 0;
  for (int i = 0; i < l; i++) {
    r += arr[i];
  }
  return r;
}

int*duplicate_arr(int*arr, unsigned int l) {
  int*new_arr = new int[l*2];
  for (unsigned int i = 0; i < l*2; i+=2) {
    new_arr[i] = arr[i / 2];
    new_arr[i+1] = arr[i / 2] * 2;
  }
  return new_arr;
}
 */

var logger = new _Logger.default('log');
var importObj = {
  module: {},
  env: {
    _Znaj: function _Znaj(x) {
      return 120;
    }
  }
};
WebAssembly.instantiateStreaming(fetch(wasm_url), importObj).then(function (res) {
  var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  var typed_arr = new Int32Array(res.instance.exports.memory.buffer, 0, arr.length);
  typed_arr.set(arr);
  logger.log(typed_arr, 'Типизированный маccив');
  logger.log(res.instance.exports._sum(0, typed_arr.length), 'Сумма его элементов');

  var offset = res.instance.exports._duplicate_arr(0, typed_arr.length);

  typed_arr = new Int32Array(res.instance.exports.memory.buffer, offset, typed_arr.length * 2);
  logger.log(typed_arr, 'Новый массив возвращенный из C++ функции');
  logger.log(res.instance.exports._sum(offset, typed_arr.length), 'Сумма его элементов');
});
},{"./Logger":"Logger.js"}]},{},["index.js"], null)
//# sourceMappingURL=src.e31bb0bc.js.map