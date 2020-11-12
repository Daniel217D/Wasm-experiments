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
})({"js/Logger.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class Logger {
  constructor(id) {
    this.el = document.getElementById(id);
    this.el.innerHTML = '';
  }

  log(data, message = "") {
    if (message.length > 0) {
      message += ":";
    }

    this.el.innerHTML += `<pre>${message} ${JSON.stringify(data)}</pre>`;
  }

}

exports.default = Logger;
},{}],"js/Wasm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class Wasm {
  _buffer;
  _buffer_offset = 0;
  _functions;

  constructor() {//
  }

  init(data) {
    this._buffer = data.buffer;
    this._functions = data.functions;
    return this;
  }

  call(f_name, args, r_type = {}) {
    args = args.map(val => {
      if (typeof val === 'number') {
        return val;
      } else if (val.array && Array.isArray(val.array)) {
        const arr = create_typed_array(val.type, this._buffer, this._buffer_offset, val.array);
        this._buffer_offset += arr.byteLength;
        return this._buffer_offset - arr.byteLength;
      } else if (val.array && Object.values(array_types).some(type => val.array.constructor === type)) {
        return val.array.byteOffset;
      } else if (val.matrix) {
        const pointers = val.matrix.map(sub_arr => {
          const arr = create_typed_array(val.type, this._buffer, this._buffer_offset, sub_arr);
          this._buffer_offset += arr.byteLength;
          return this._buffer_offset - arr.byteLength;
        });
        const arr = create_typed_array(val.type, this._buffer, this._buffer_offset, pointers);
        this._buffer_offset += arr.byteLength;
        return this._buffer_offset - arr.byteLength;
      }

      throw new Error(`Unsupported variable type`);
    });

    let result = this._functions[f_name](...args);

    if (r_type.type && r_type.length) {
      result = create_typed_array(r_type.type, this._buffer, result, r_type.length);

      if (r_type.to_array) {
        result = Array.from(result);
      }
    }

    return result;
  }

  malloc(size) {
    this._buffer_offset += size;
    return this._buffer_offset - size;
  }

}

const array_types = {
  'int8': Int8Array,
  'uint8': Uint8Array,
  'int16': Int16Array,
  'uint16': Uint16Array,
  'int32': Int32Array,
  'uint32': Uint32Array,
  'float32': Float32Array,
  'float64': Float64Array,
  'bigint64': BigInt64Array,
  'biguint64': BigUint64Array
};

const create_typed_array = (type, buffer, offset = 0, array_or_length) => {
  type = array_types[type.toLowerCase()];

  if (!type) {
    throw new Error(`Array types: ${Object.keys(array_types).join(', ')}. ${type.toLowerCase()} not included`);
  }

  const typed_array = new type(buffer, offset, Array.isArray(array_or_length) ? array_or_length.length : array_or_length);

  if (array_or_length.length && array_or_length.length > 0) {
    typed_array.set(array_or_length);
  }

  return typed_array;
};

var _default = async (url, importObj = {}) => {
  const wasm = new Wasm();

  if (importObj.functions) {
    if (!importObj.env) {
      importObj.env = {};
    }

    const functions = Object.entries(importObj.functions).reduce((res, [name, value]) => {
      if (typeof value === 'string' && wasm[value]) {
        res[name] = wasm[value].bind(wasm);
      }

      if (typeof value === 'function') {
        res[name] = value;
      }

      return res;
    }, {});
    importObj.env = { ...functions,
      ...importObj.env
    };
  }

  const data = await WebAssembly.instantiateStreaming(fetch(url), importObj).then(r => r).catch(() => {
    return fetch(url).then(response => response.arrayBuffer()).then(bytes => WebAssembly.instantiate(bytes, importObj)).then(r => r);
  });
  return wasm.init({
    // module: data.module,
    buffer: data.instance.exports.memory.buffer,
    functions: Object.entries(data.instance.exports).reduce((res, [key, value]) => {
      return key === 'memory' ? res : { ...res,
        ...{
          [key]: value
        }
      };
    }, {})
  });
};

exports.default = _default;
},{}],"js/index.js":[function(require,module,exports) {
"use strict";

var _Logger = _interopRequireDefault(require("./Logger"));

var _Wasm = _interopRequireDefault(require("./Wasm"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const wasm_url = document.getElementById('wasm').getAttribute('src');
const logger = new _Logger.default('log');
const importObj = {
  module: {},
  functions: {
    '_Znaj': 'malloc',
    '_Znwj': 'malloc'
  }
};
const arr = [1, 10];

(async () => {
  const w = await (0, _Wasm.default)(wasm_url, importObj);
  console.log(w._functions);
  logger.log(arr, 'Маccив');
  logger.log(w.call('_sum', [{
    array: arr,
    type: 'Int32'
  }, arr.length]), 'Сумма его элементов');
  let new_arr = w.call('_duplicate_arr', [{
    array: arr,
    type: 'Int32'
  }, arr.length], {
    type: 'int32',
    length: arr.length * 2,
    to_array: false
  });
  logger.log(new_arr, 'Новый массив возвращенный из C++ функции');
  logger.log(w.call('_sum', [{
    array: new_arr,
    type: 'Int32'
  }, new_arr.length]), 'Сумма его элементов');
  const matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  logger.log(matrix, 'Матрица');
  logger.log(w.call('_sum_matrix', [{
    matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
    type: 'Int32'
  }, 3, 3]), 'Сумма элементов матрицы');
})();
},{"./Logger":"js/Logger.js","./Wasm":"js/Wasm.js"}]},{},["js/index.js"], null)
//# sourceMappingURL=js.00a46daa.js.map