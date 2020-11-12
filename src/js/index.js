import Logger from './Logger';
import wasm from './Wasm';

const wasm_url = document.getElementById('wasm').getAttribute('src');

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