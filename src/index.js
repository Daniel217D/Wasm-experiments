import Logger from './Logger';
import wasm from './Wasm';

const wasm_url = document.getElementById('wasm').getAttribute('src');

/*
int _sum(int*arr, unsigned int l) {
  int r = 0;
  for (int i = 0; i < l; i++) {
    r += arr[i];
  }
  return r;
}

int* _duplicate_arr(int*arr, unsigned int l) {
  int*new_arr = new int[l*2];
  for (unsigned int i = 0; i < l*2; i+=2) {
    new_arr[i] = arr[i / 2];
    new_arr[i+1] = arr[i / 2] * 2;
  }
  return new_arr;
}
 */
const logger = new Logger('log');

const importObj = {
    module: {},
    functions: {
        '_Znaj': 'malloc'
    }
};

const arr = [1,10];

(async () => {
    const w = await wasm(wasm_url, importObj);

    logger.log(arr, 'Маccив');
    logger.log(w.call('_sum', [{array: arr, type: 'Int32'}, arr.length]), 'Сумма его элементов');

    let new_arr = w.call('_duplicate_arr',
        [{array: arr, type: 'Int32'}, arr.length],
        {type: 'int32', length: arr.length * 2, to_array: true});
    logger.log(new_arr, 'Новый массив возвращенный из C++ функции');
    logger.log(w.call('_sum', [{array: new_arr, type: 'Int32'}, new_arr.length]), 'Сумма его элементов');
})();