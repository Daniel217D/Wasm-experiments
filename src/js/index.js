import Logger from './Logger';
import wasm from './Wasm';

const wasm_url = document.getElementById('wasm').getAttribute('src');

const logger = new Logger('log');

const importObj = {
    module: {},
    functions: {
        '_Znaj': 'malloc',
        '_Znwj': 'malloc'
    }
};

const arr = [1,10];

(async () => {
    const w = await wasm(wasm_url, importObj);

    console.log(w._functions);
    logger.log(arr, 'Маccив');
    logger.log(w.call('_sum', [{array: arr, type: 'Int32'}, arr.length]), 'Сумма его элементов');

    let new_arr = w.call('_duplicate_arr',
        [{array: arr, type: 'Int32'}, arr.length],
        {type: 'int32', length: arr.length * 2, to_array: false});
    logger.log(new_arr, 'Новый массив возвращенный из C++ функции');
    logger.log(w.call('_sum', [{array: new_arr, type: 'Int32'}, new_arr.length]), 'Сумма его элементов');

    const matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    logger.log(matrix, 'Матрица');
    logger.log(w.call('_sum_matrix', [{matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], type: 'Int32'}, 3, 3]), 'Сумма элементов матрицы');
})();