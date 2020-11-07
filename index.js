const wasm_url = document.getElementById('wasm').getAttribute('src');

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

const importObj = {
    module: {},
    env: {
        _Znaj: (x) => {
            return 120;
        }
    }
};

WebAssembly.instantiateStreaming(fetch(wasm_url), importObj)
    .then(res => {
        const arr = [1,2,3,4,5,6,7,8,9,10];
        let typed_arr = new Int32Array(res.instance.exports.memory.buffer, 0, arr.length);
        typed_arr.set(arr);
        console.log(typed_arr);
        
        console.log(res.instance.exports._sum(0, typed_arr.length));

        const offset = res.instance.exports._duplicate_arr(0, typed_arr.length);
        typed_arr = new Int32Array(res.instance.exports.memory.buffer, offset, typed_arr.length * 2);
        console.log(typed_arr);
        console.log(res.instance.exports._sum(offset, typed_arr.length));
    });