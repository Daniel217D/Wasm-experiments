class Wasm {
    _buffer;
    _buffer_offset = 0;
    _functions;

    constructor() {
        //
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
            } else if(val.array && Object.values(array_types).some(type => val.array.constructor === type)) {
                return val.array.byteOffset;
            }
            throw new Error(`Unsupported variable type`)
        });

        let result = this._functions[f_name](...args);
        if (r_type.type && r_type.length) {
            result = create_typed_array(r_type.type, this._buffer, result, r_type.length);
            if (r_type.to_array) {
                result = Array.from(result);
            }
        }

        return result
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
    'biguint64': BigUint64Array,
};

const create_typed_array = (type, buffer, offset = 0, array_or_length) => {
    type = array_types[type.toLowerCase()];

    if (!type) {
        throw new Error(`Array types: ${Object.keys(array_types).join(', ')}. ${type.toLowerCase()} not included`)
    }

    const typed_array = new type(buffer, offset, Array.isArray(array_or_length) ? array_or_length.length : array_or_length);
    if (array_or_length.length && array_or_length.length > 0) {
        typed_array.set(array_or_length);
    }
    return typed_array;
};

export default async (url, importObj = {}) => {
    const wasm = new Wasm();

    if (importObj.functions) {
        if (!importObj.env) {
            importObj.env = {}
        }

        const functions = Object.entries(importObj.functions).reduce((res, [name, value]) => {
            if (typeof value === 'string' && wasm[value]) {
                res[name] = wasm[value].bind(wasm);
            }
            if (typeof value === 'function') {
                res[name] = value
            }
            return res;
        }, {});

        importObj.env = {...functions, ...importObj.env};
    }

    const data = await WebAssembly.instantiateStreaming(fetch(url), importObj)
        .then(r => r)
        .catch(() => {
            return fetch(url)
                .then(response => response.arrayBuffer())
                .then(bytes => WebAssembly.instantiate(bytes, importObj))
                .then(r => r);
        });

    return wasm.init({
        // module: data.module,
        buffer: data.instance.exports.memory.buffer,
        functions: Object.entries(data.instance.exports).reduce((res, [key, value]) => {
            return key === 'memory' ? res : {...res, ...{[key]: value}};
        }, {})
    });
}